
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { db } from "@/lib/db";
import { profiles } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import {
    validateEmail,
    getEmailForDuplicateCheck
} from "@/lib/email-validation";
import {
    checkSignupRateLimit,
    getTimeUntilReset
} from "@/lib/rate-limit";

const loginIdentifierSchema = z.string().min(1, "Email o username richiesto");
const loginSchema = z.object({
    identifier: loginIdentifierSchema,
    password: z.string().min(1, "Password richiesta"),
})

const signupSchema = z.object({
    email: z.string().email("Email non valida"),
    password: z.string()
        .min(8, "La password deve essere di almeno 8 caratteri")
        .regex(/[A-Z]/, "La password deve contenere almeno una maiuscola")
        .regex(/\d/, "La password deve contenere almeno un numero"),
    confirmPassword: z.string().min(1, "Conferma la password"),
    username: z.string()
        .min(3, "L'username deve essere di almeno 3 caratteri")
        .regex(/^[a-zA-Z0-9_]+$/, "L'username può contenere solo lettere, numeri e underscore"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Le password non corrispondono",
    path: ["confirmPassword"],
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

            if (!userProfile[0].email) {
                return { error: "Impossibile recuperare l'email per questo username." }
            }
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
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(prevState: AuthState | undefined, formData: FormData): Promise<AuthState> {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        username: formData.get('username') as string,
    }

    // === 1. BASIC VALIDATION ===
    const validatedFields = signupSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message }
    }

    // === 2. EMAIL VALIDATION (Disposable check) ===
    const emailValidationError = validateEmail(rawData.email);
    if (emailValidationError) {
        return { error: emailValidationError }
    }

    // === 3. RATE LIMITING (IP-based) ===
    try {
        const headersList = await headers();
        // Get IP from various headers (Vercel, Cloudflare, etc.)
        const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
            || headersList.get('x-real-ip')
            || headersList.get('cf-connecting-ip')
            || 'unknown';

        const rateLimitResult = await checkSignupRateLimit(ip);

        if (!rateLimitResult.success) {
            const timeLeft = getTimeUntilReset(rateLimitResult.reset);
            return {
                error: `Troppi tentativi di registrazione. Riprova tra ${timeLeft}.`
            }
        }
    } catch (error) {
        console.error("Rate limit check error:", error);
        // Continue on rate limit errors (fail open for UX)
    }

    // === 4. NORMALIZE EMAIL for duplicate check ===
    const normalizedEmail = getEmailForDuplicateCheck(rawData.email);

    // === 5. CHECK USERNAME UNIQUENESS ===
    try {
        const existingUser = await db.select().from(profiles).where(eq(profiles.username, rawData.username)).limit(1);
        if (existingUser.length > 0) {
            return { error: "Questo username è già in uso. Scegline un altro." }
        }
    } catch (error) {
        console.error("Error checking username:", error);
    }

    // === 6. CHECK EMAIL UNIQUENESS (with normalization) ===
    // We need to check if any existing email, when normalized, matches our normalized email
    try {
        // Get all emails from profiles (for small user bases this is fine)
        // For large scale, consider adding a normalized_email column
        const allProfiles = await db.select({ email: profiles.email }).from(profiles).limit(1000);

        for (const profile of allProfiles) {
            if (profile.email) {
                const existingNormalized = getEmailForDuplicateCheck(profile.email);
                if (existingNormalized === normalizedEmail) {
                    return { error: "Questa email è già registrata. Effettua il login." }
                }
            }
        }
    } catch (error) {
        console.error("Error checking email:", error);
    }

    // === 7. CREATE ACCOUNT IN SUPABASE ===
    const { error } = await supabase.auth.signUp({
        email: rawData.email, // Use original email for Supabase
        password: rawData.password,
        options: {
            data: {
                username: rawData.username,
                full_name: rawData.username,
                // Store normalized email for future duplicate checks
                normalized_email: normalizedEmail,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Check if email confirmation is required
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
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
