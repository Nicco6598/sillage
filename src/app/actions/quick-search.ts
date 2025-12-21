'use server'

import { db } from "@/lib/db";
import { fragrances, brands, userCollection } from "@/lib/db-schema";
import { ilike, eq, or, sql, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export interface QuickSearchResult {
    id: string;
    name: string;
    brandName: string;
    imageUrl: string | null;
    slug: string;
    year: number | null;
    concentration: string | null;
    isOwned: boolean;
}

/**
 * Quick search for fragrances - lightweight version for quick add modal
 * Searches by fragrance name or brand name
 * Also checks if the user already owns each fragrance
 */
export async function quickSearchFragrances(query: string): Promise<QuickSearchResult[]> {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const searchTerm = `%${query.trim()}%`;

    // Get current user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const results = await db
        .select({
            id: fragrances.id,
            name: fragrances.name,
            brandName: brands.name,
            imageUrl: fragrances.imageUrl,
            slug: fragrances.slug,
            year: fragrances.releaseYear,
            concentration: fragrances.concentration,
        })
        .from(fragrances)
        .leftJoin(brands, eq(fragrances.brandId, brands.id))
        .where(
            or(
                ilike(fragrances.name, searchTerm),
                ilike(brands.name, searchTerm)
            )
        )
        .orderBy(
            // Prioritize exact matches
            sql`CASE WHEN LOWER(${fragrances.name}) LIKE LOWER(${query.trim() + '%'}) THEN 0 ELSE 1 END`,
            fragrances.name
        )
        .limit(10);

    // If user is logged in, check which fragrances they own
    let ownedIds = new Set<string>();
    if (user) {
        const ownedFragrances = await db
            .select({ fragranceId: userCollection.fragranceId })
            .from(userCollection)
            .where(and(
                eq(userCollection.userId, user.id),
                eq(userCollection.notes, 'owned')
            ));
        ownedIds = new Set(ownedFragrances.map(f => f.fragranceId));
    }

    return results.map(r => ({
        id: r.id,
        name: r.name,
        brandName: r.brandName || '',
        imageUrl: r.imageUrl,
        slug: r.slug,
        year: r.year,
        concentration: r.concentration,
        isOwned: ownedIds.has(r.id),
    }));
}
