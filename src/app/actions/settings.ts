'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { db } from "@/lib/db"
import { profiles } from "@/lib/db-schema"
import { eq } from "drizzle-orm"

const updateProfileSchema = z.object({
    username: z.string().min(3, "L'username deve essere di almeno 3 caratteri")
        .regex(/^[a-zA-Z0-9_]+$/, "L'username può contenere solo lettere, numeri e underscore"),
    fullName: z.string().optional(),
})

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Password attuale richiesta"),
    newPassword: z.string().min(6, "La nuova password deve essere di almeno 6 caratteri"),
    confirmPassword: z.string().min(1, "Conferma la password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
})

export type SettingsState = {
    error?: string;
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export async function updateProfile(prevState: SettingsState | undefined, formData: FormData): Promise<SettingsState> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Devi effettuare il login." }
    }

    const rawData = {
        username: formData.get('username') as string,
        fullName: formData.get('fullName') as string || undefined,
    }

    const validatedFields = updateProfileSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            error: validatedFields.error.issues[0].message
        }
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

    // Update profile in database
    try {
        await db.update(profiles)
            .set({
                username: validatedFields.data.username,
                fullName: validatedFields.data.fullName || null,
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, user.id))

        // Also update user metadata
        await supabase.auth.updateUser({
            data: {
                username: validatedFields.data.username,
                full_name: validatedFields.data.fullName,
            }
        })

        revalidatePath('/profile')
        revalidatePath('/settings')

        return { success: true, message: "Profilo aggiornato con successo!" }
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

    return { success: true, message: "Password aggiornata con successo!" }
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
