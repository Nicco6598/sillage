'use server'

import { db } from "@/lib/db";
import { userCollection, userFavorites } from "@/lib/db-schema";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";

export type CollectionStatus = 'owned' | 'wanted' | 'had' | null;

export type ActionResult = {
    success: boolean;
    message?: string;
    status?: CollectionStatus;
    isFavorite?: boolean;
};

// Check user's collection status for a fragrance
export async function getCollectionStatus(fragranceId: string): Promise<{ status: CollectionStatus; isFavorite: boolean }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { status: null, isFavorite: false };
    }

    try {
        // Check collection
        const [collectionItem] = await db
            .select()
            .from(userCollection)
            .where(and(
                eq(userCollection.userId, user.id),
                eq(userCollection.fragranceId, fragranceId)
            ))
            .limit(1);

        // Check favorites
        const [favoriteItem] = await db
            .select()
            .from(userFavorites)
            .where(and(
                eq(userFavorites.userId, user.id),
                eq(userFavorites.fragranceId, fragranceId)
            ))
            .limit(1);

        let status: CollectionStatus = null;
        if (collectionItem) {
            // Notes field stores the status type
            status = (collectionItem.notes as CollectionStatus) || 'owned';
        }

        return {
            status,
            isFavorite: !!favoriteItem
        };
    } catch (e) {
        console.error("Error checking collection status:", e);
        return { status: null, isFavorite: false };
    }
}

// Add to collection with status
export async function addToCollection(fragranceId: string, status: CollectionStatus, size?: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Devi effettuare il login." };
    }

    try {
        // Check if already exists
        const [existing] = await db
            .select()
            .from(userCollection)
            .where(and(
                eq(userCollection.userId, user.id),
                eq(userCollection.fragranceId, fragranceId)
            ))
            .limit(1);

        if (existing) {
            if (status === null) {
                // Remove from collection
                await db.delete(userCollection).where(eq(userCollection.id, existing.id));
                revalidatePath('/profile');
                return { success: true, message: "Rimosso dalla collezione.", status: null };
            } else {
                // Update status
                await db.update(userCollection)
                    .set({ notes: status, size })
                    .where(eq(userCollection.id, existing.id));
                revalidatePath('/profile');
                return { success: true, message: "Stato aggiornato.", status };
            }
        } else if (status) {
            // Add new
            await db.insert(userCollection).values({
                userId: user.id,
                fragranceId,
                notes: status,
                size,
            });
            revalidatePath('/profile');
            return { success: true, message: "Aggiunto alla collezione!", status };
        }

        return { success: true, status: null };
    } catch (e) {
        console.error("Error adding to collection:", e);
        return { success: false, message: "Errore durante l'operazione." };
    }
}

// Toggle favorite
export async function toggleFavorite(fragranceId: string): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Devi effettuare il login." };
    }

    try {
        // Check if already favorited
        const [existing] = await db
            .select()
            .from(userFavorites)
            .where(and(
                eq(userFavorites.userId, user.id),
                eq(userFavorites.fragranceId, fragranceId)
            ))
            .limit(1);

        if (existing) {
            // Remove
            await db.delete(userFavorites).where(eq(userFavorites.id, existing.id));
            revalidatePath('/profile');
            revalidatePath('/favorites');
            return { success: true, message: "Rimosso dai preferiti.", isFavorite: false };
        } else {
            // Add
            await db.insert(userFavorites).values({
                userId: user.id,
                fragranceId,
            });
            revalidatePath('/profile');
            revalidatePath('/favorites');
            return { success: true, message: "Aggiunto ai preferiti!", isFavorite: true };
        }
    } catch (e) {
        console.error("Error toggling favorite:", e);
        return { success: false, message: "Errore durante l'operazione." };
    }
}
