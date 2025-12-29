'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { db } from "@/lib/db"
import { profiles } from "@/lib/db-schema"
import { eq } from "drizzle-orm"


const updateProfileSchema = z.object({
    username: z.string()
        .min(3, "L'username deve essere di almeno 3 caratteri")
        .regex(/^[a-zA-Z0-9_]+$/, "L'username può contenere solo lettere, numeri e underscore"),
})

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password attuale richiesta"),
    newPassword: z.string()
        .min(8, "La password deve essere di almeno 8 caratteri")
        .regex(/[A-Z]/, "La password deve contenere almeno una lettera maiuscola")
        .regex(/\d/, "La password deve contenere almeno un numero"),
    confirmPassword: z.string().min(1, "Conferma la password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
    message: "La nuova password deve essere diversa dalla precedente",
    path: ["newPassword"],
})

export type SettingsState = {
    error?: string;
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    requiresLogout?: boolean;
}

export async function updateProfile(prevState: SettingsState | undefined, formData: FormData): Promise<SettingsState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Devi effettuare il login." }
    }

    const rawData = {
        username: formData.get('username') as string,
    }

    const validatedFields = updateProfileSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            error: validatedFields.error.issues[0].message
        }
    }

    // Check if username is the same as current (no change needed)
    const currentUsername = user.user_metadata?.username
    if (currentUsername === validatedFields.data.username) {
        return { error: "L'username è uguale a quello attuale." }
    }

    // Check if username is taken by another user
    try {
        const existingUser = await db
            .select()
            .from(profiles)
            .where(eq(profiles.username, validatedFields.data.username))
            .limit(1)

        if (existingUser.length > 0 && existingUser[0].id !== user.id) {
            return { error: "Questo username è già in uso." }
        }
    } catch (error) {
        console.error("Error checking username:", error)
    }

    // Update profile in database using upsert with onConflictDoUpdate
    try {
        console.log("Updating profile for user:", user.id, "to username:", validatedFields.data.username);

        await db
            .insert(profiles)
            .values({
                id: user.id,
                username: validatedFields.data.username,
                email: user.email,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: profiles.id,
                set: {
                    username: validatedFields.data.username,
                    updatedAt: new Date(),
                },
            });

        console.log("Profile updated successfully in DB");

        // Also update user metadata in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                username: validatedFields.data.username,
            }
        });

        if (authError) {
            console.error("Error updating auth metadata:", authError);
        } else {
            console.log("Auth metadata updated successfully");
        }

        // Sign out all sessions
        await supabase.auth.signOut({ scope: 'global' });

        revalidatePath('/profile');
        revalidatePath('/settings');

        return {
            success: true,
            message: "Username aggiornato! Effettua nuovamente il login.",
            requiresLogout: true
        };
    } catch (error) {
        console.error("Error updating profile:", error)
        return { error: "Errore durante l'aggiornamento del profilo." }
    }
}

export async function updatePassword(prevState: SettingsState | undefined, formData: FormData): Promise<SettingsState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Devi effettuare il login." }
    }

    const rawData = {
        currentPassword: formData.get('currentPassword') as string,
        newPassword: formData.get('newPassword') as string,
        confirmPassword: formData.get('confirmPassword') as string,
    }

    const validatedFields = updatePasswordSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            error: validatedFields.error.issues[0].message
        }
    }

    // Verify current password by trying to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: validatedFields.data.currentPassword,
    })

    if (signInError) {
        return { error: "La password attuale non è corretta." }
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
        password: validatedFields.data.newPassword,
    })

    if (updateError) {
        return { error: "Errore durante l'aggiornamento della password." }
    }

    // Sign out all sessions after password change
    await supabase.auth.signOut({ scope: 'global' })

    return {
        success: true,
        message: "Password aggiornata! Effettua nuovamente il login.",
        requiresLogout: true
    }
}

export async function deleteAccount(): Promise<SettingsState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Devi effettuare il login." }
    }

    // Note: Full account deletion requires admin privileges in Supabase
    // This signs out and marks the account for deletion request
    // In production, you might want to use a Supabase Edge Function with service role

    try {
        // Delete profile data (the cascade will handle related data)
        await db.delete(profiles).where(eq(profiles.id, user.id))

        // Sign out user
        await supabase.auth.signOut()

        return { success: true, message: "Account eliminato." }
    } catch (error) {
        console.error("Error deleting account:", error)
        return { error: "Errore durante l'eliminazione dell'account." }
    }
}
