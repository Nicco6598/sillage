
'use server'

import { db } from "@/lib/db";
import { reviews } from "@/lib/db-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ReviewSchema = z.object({
    fragranceId: z.string().uuid(),
    userName: z.string().min(2, "Il nome deve essere di almeno 2 caratteri"),
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
}

export async function submitReview(prevState: ReviewState, formData: FormData) {
    const rawData = {
        fragranceId: formData.get("fragranceId"),
        userName: formData.get("userName"),
        rating: Number(formData.get("rating")),
        comment: formData.get("comment"),
        sillage: formData.get("sillage") ? Number(formData.get("sillage")) : undefined,
        longevity: formData.get("longevity") ? Number(formData.get("longevity")) : undefined,
        genderVote: formData.get("genderVote") || undefined,
        seasonVote: formData.get("seasonVote") || undefined,
        batchCode: formData.get("batchCode") || undefined,
        productionDate: formData.get("productionDate") || undefined,
        slug: formData.get("slug")
    };

    const validatedFields = ReviewSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Controlla i campi inseriti.",
            success: false
        };
    }

    const { slug, ...rawDataForDb } = validatedFields.data;

    // Convert numeric fields to strings for Drizzle numeric columns
    const dbData = {
        ...rawDataForDb,
        rating: rawDataForDb.rating.toString(),
        sillage: rawDataForDb.sillage?.toString(),
        longevity: rawDataForDb.longevity?.toString(),
    };

    try {
        console.log("Attempting to insert review:", dbData);
        const result = await db.insert(reviews).values(dbData).returning();
        console.log("Insert result:", result);

        if (slug) {
            console.log("Revalidating path for slug:", slug);
            revalidatePath(`/fragrance/${slug}`);
            revalidatePath('/'); // Revalidate home just in case
        }
        return { success: true, message: "Recensione inviata! Grazie per il tuo contributo." };
    } catch (e) {
        console.error("Review Insert Error FULL DETAILS:", e);
        if (e instanceof Error) {
            console.error("Error message:", e.message);
            console.error("Error stack:", e.stack);
        }
        return { success: false, message: "Si è verificato un errore durante l'invio della recensione. Controlla la console del server." };
    }
}
