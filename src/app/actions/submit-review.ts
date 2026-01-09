
'use server'

import { db } from "@/lib/db";
import { reviews } from "@/lib/db-schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { moderateContent, getModerationMessage } from "@/lib/moderation";
import { checkReviewRateLimit, getTimeUntilReset } from "@/lib/rate-limit";

const ReviewSchema = z.object({
    fragranceId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    sillage: z.number().min(1).max(5).optional(),
    longevity: z.number().min(1).max(5).optional(),
    genderVote: z.enum(["masculine", "feminine", "unisex"]).optional(),
    seasonVote: z.string().optional(),
    batchCode: z.string().optional(),
    productionDate: z.string().optional(),
    slug: z.string().optional()
});

export type ReviewState = {
    message?: string;
    errors?: Record<string, string[]>;
    success?: boolean;
    resetTimestamp?: number; // Unix timestamp for rate limit reset
}

// Basic profanity filter (runs before AI moderation)
const FORBIDDEN_WORDS = [
    "merda", "cazzo", "minchia", "stronzo", "coglione", "puttana",
    "troia", "fottiti", "vaffanculo", "bastardo", "negro", "frocio"
];


function containsForbiddenWords(text: string): boolean {
    const lowerText = text.toLowerCase();
    return FORBIDDEN_WORDS.some(word => lowerText.includes(word));
}

export async function submitReview(prevState: ReviewState, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            message: "Devi effettuare il login per lasciare una recensione."
        };
    }

    // Rate limiting: 1 review per 5 minutes
    try {
        const rateLimitResult = await checkReviewRateLimit(user.id);

        if (!rateLimitResult.success) {
            const timeLeft = getTimeUntilReset(rateLimitResult.reset);
            return {
                success: false,
                message: `Puoi inviare una recensione ogni 5 minuti. Riprova tra ${timeLeft}.`,
                resetTimestamp: rateLimitResult.reset.getTime()
            };
        }
    } catch (error) {
        console.error("Review rate limit check error:", error);
        // Continue if rate limit check fails (better UX)
    }

    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Utente';

    const rawData = {
        fragranceId: formData.get("fragranceId"),
        rating: Number(formData.get("rating")),
        comment: formData.get("comment") || undefined,
        sillage: formData.get("sillage") ? Number(formData.get("sillage")) : undefined,
        longevity: formData.get("longevity") ? Number(formData.get("longevity")) : undefined,
        genderVote: formData.get("genderVote") || undefined,
        seasonVote: formData.get("seasonVote") || undefined,
        batchCode: formData.get("batchCode") || undefined,
        productionDate: formData.get("productionDate") || undefined,
        slug: formData.get("slug")
    };

    const formFields = ReviewSchema.safeParse(rawData);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
            message: "Controlla i campi inseriti.",
            success: false
        };
    }

    // Quick profanity check before AI
    if (formFields.data.comment && formFields.data.comment.trim().length > 0) {
        if (containsForbiddenWords(formFields.data.comment)) {
            return {
                success: false,
                message: "Il contenuto contiene linguaggio volgare o offensivo."
            };
        }

        // AI moderation with Gemini
        const moderationResult = await moderateContent(formFields.data.comment);

        if (moderationResult.flagged) {
            return {
                success: false,
                message: getModerationMessage(moderationResult.flaggedCategories)
            };
        }
    }

    const { slug, ...rawDataForDb } = formFields.data;

    // Convert to strings for Drizzle numeric columns
    const dbData = {
        ...rawDataForDb,
        userId: user.id,
        userName: username,
        rating: rawDataForDb.rating.toString(),
        sillage: rawDataForDb.sillage?.toString(),
        longevity: rawDataForDb.longevity?.toString(),
    };

    try {
        console.log("Attempting to insert review for user:", user.id);
        const result = await db.insert(reviews).values(dbData).returning();
        console.log("Insert result:", result);

        if (slug) {
            revalidatePath(`/fragrance/${slug}`);
            revalidatePath('/profile');
        }
        return { success: true, message: "Recensione inviata! Grazie per il tuo contributo." };
    } catch (e) {
        console.error("Review Insert Error:", e);
        return { success: false, message: "Si è verificato un errore durante l'invio della recensione." };
    }
}

// Update an existing review
export async function updateReview(prevState: ReviewState, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Devi effettuare il login." };
    }

    const reviewId = formData.get("reviewId") as string;
    const slug = formData.get("slug") as string;

    // Verify ownership
    const [existingReview] = await db
        .select({ userId: reviews.userId })
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1);

    if (!existingReview || existingReview.userId !== user.id) {
        return { success: false, message: "Non puoi modificare questa recensione." };
    }

    const rawData = {
        fragranceId: formData.get("fragranceId"),
        rating: Number(formData.get("rating")),
        comment: formData.get("comment") || undefined,
        sillage: formData.get("sillage") ? Number(formData.get("sillage")) : undefined,
        longevity: formData.get("longevity") ? Number(formData.get("longevity")) : undefined,
        genderVote: formData.get("genderVote") || undefined,
        seasonVote: formData.get("seasonVote") || undefined,
        batchCode: formData.get("batchCode") || undefined,
        productionDate: formData.get("productionDate") || undefined,
        slug
    };

    const formFields = ReviewSchema.safeParse(rawData);

    if (!formFields.success) {
        return {
            errors: formFields.error.flatten().fieldErrors,
            message: "Controlla i campi inseriti.",
            success: false
        };
    }

    // Moderate comment if present
    if (formFields.data.comment && formFields.data.comment.trim().length > 0) {
        if (containsForbiddenWords(formFields.data.comment)) {
            return {
                success: false,
                message: "Il contenuto contiene linguaggio volgare o offensivo."
            };
        }

        const moderationResult = await moderateContent(formFields.data.comment);

        if (moderationResult.flagged) {
            return {
                success: false,
                message: getModerationMessage(moderationResult.flaggedCategories)
            };
        }
    }

    const { slug: _slug, ...rawDataForDb } = formFields.data;


    const dbData = {
        ...rawDataForDb,
        rating: rawDataForDb.rating.toString(),
        sillage: rawDataForDb.sillage?.toString(),
        longevity: rawDataForDb.longevity?.toString(),
        updatedAt: new Date(),
    };

    try {
        await db.update(reviews).set(dbData).where(eq(reviews.id, reviewId));

        if (slug) {
            revalidatePath(`/fragrance/${slug}`);
            revalidatePath('/profile');
        }
        return { success: true, message: "Recensione aggiornata!" };
    } catch (e) {
        console.error("Review Update Error:", e);
        return { success: false, message: "Errore durante l'aggiornamento." };
    }
}

// Delete a review
export async function deleteReview(reviewId: string, slug?: string): Promise<ReviewState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Devi effettuare il login." };
    }

    // Verify ownership
    const [existingReview] = await db
        .select({ userId: reviews.userId })
        .from(reviews)
        .where(eq(reviews.id, reviewId))
        .limit(1);

    if (!existingReview || existingReview.userId !== user.id) {
        return { success: false, message: "Non puoi eliminare questa recensione." };
    }

    try {
        await db.delete(reviews).where(eq(reviews.id, reviewId));

        if (slug) {
            revalidatePath(`/fragrance/${slug}`);
        }
        revalidatePath('/profile');
        return { success: true, message: "Recensione eliminata." };
    } catch (e) {
        console.error("Review Delete Error:", e);
        return { success: false, message: "Errore durante l'eliminazione." };
    }
}
