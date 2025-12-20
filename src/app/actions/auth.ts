
'use server'


import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { db } from "@/lib/db";
import { profiles } from "@/lib/db-schema";
import { eq } from "drizzle-orm";

const loginIdentifierSchema = z.string().min(1, "Email o username richiesto");
const loginSchema = z.object({
    identifier: loginIdentifierSchema,
    password: z.string().min(1, "Password richiesta"),
})

const signupSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string().min(6, "La password deve essere di almeno 6 caratteri"),
    username: z.string().min(3, "L'username deve essere di almeno 3 caratteri").regex(/^[a-zA-Z0-9_]+$/, "L'username può contenere solo lettere, numeri e underscore"),
})

export type AuthState = {
    error?: string;
    success?: boolean;
    message?: string;
}

export async function login(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()

    const rawData = {
        identifier: formData.get('identifier') as string,
        password: formData.get('password') as string,
    }

    const validatedFields = loginSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message }
    }

    let emailToSignIn = rawData.identifier;
    const isEmail = z.string().email().safeParse(rawData.identifier).success;

    if (!isEmail) {
        try {
            const userProfile = await db.select().from(profiles).where(eq(profiles.username, rawData.identifier)).limit(1);

            if (userProfile.length === 0) {
                return { error: "Utente non trovato" }
            }

            // @ts-ignore
            if (!userProfile[0].email) {
                return { error: "Impossibile recuperare l'email per questo username." }
            }
            // @ts-ignore
            emailToSignIn = userProfile[0].email;

        } catch (e) {
            console.error("Login username lookup error:", e);
            return { error: "Errore durante il login. Riprova." }
        }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: emailToSignIn,
        password: rawData.password,
    })

    if (error) {
        // Generico errore per sicurezza o specifico se preferito
        return { error: error.message } // "Credenziali non valide"
    }

    revalidatePath('/', 'layout')
    redirect('/')
    // Redirect throws, so this line is unreachable, but TypeScript might want a return type consistent if redirect wasn't called (which it is).
}

export async function signup(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        username: formData.get('username') as string,
    }

    const validatedFields = signupSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message }
    }

    // Check if username check... (keep existing)
    try {
        const existingUser = await db.select().from(profiles).where(eq(profiles.username, rawData.username)).limit(1);
        if (existingUser.length > 0) {
            return { error: "Questo username è già in uso. Scegline un altro." }
        }
    } catch (error) {
        console.error("Error checking username:", error);
    }

    // Check if email is taken (via profiles check as proxy, Supabase also checks but this gives custom error early)
    try {
        const existingEmail = await db.select().from(profiles).where(eq(profiles.email, rawData.email)).limit(1);
        if (existingEmail.length > 0) {
            return { error: "Questa email è già registrata. Effettua il login." }
        }
    } catch (error) {
        console.error("Error checking email:", error);
    }

    const { error } = await supabase.auth.signUp({
        email: rawData.email,
        password: rawData.password,
        options: {
            data: {
                username: rawData.username,
                full_name: rawData.username,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Se l'email confirmation è attiva, l'utente non sarà loggato subito.
    // Supabase di default richiede conferma email.
    // Controlliamo se siamo loggati.

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // Probabilmente richiede verifica email
        return { success: true, message: "Controlla la tua email per confermare la registrazione." }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
