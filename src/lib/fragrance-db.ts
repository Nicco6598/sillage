
import { db } from "./db";
import { fragrances, brands, fragranceNotes, fragranceAccords, notes, reviews } from "./db-schema";
import { eq, ilike, and, desc, sql, inArray, count } from "drizzle-orm";
import type { Fragrance } from "@/types/fragrance";

/**
 * Helper to transform DB result to Fragrance type
 */
function transformToFragrance(curr: any): Fragrance {
    const topNotes = curr.notes.filter(n => n.type === 'top' && n.note).map(n => ({ id: n.note!.id, name: n.note!.name, type: 'top' as const }));
    const heartNotes = curr.notes.filter(n => n.type === 'heart' && n.note).map(n => ({ id: n.note!.id, name: n.note!.name, type: 'heart' as const }));
    const baseNotes = curr.notes.filter(n => n.type === 'base' && n.note).map(n => ({ id: n.note!.id, name: n.note!.name, type: 'base' as const }));

    // Ensure brand exists (it should due to foreign key, but TS doesn't know)
    const brand = curr.brand || { id: "unknown", name: "Unknown", slug: "unknown", country: null };

    return {
        id: curr.id,
        name: curr.name,
        slug: curr.slug,
        brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            country: brand.country || undefined,
        },
        imageUrl: curr.imageUrl || "",
        rating: Number(curr.rating || 0),
        reviewCount: curr.reviewCount || 0,
        year: curr.releaseYear || undefined,
        gender: (curr.gender as "masculine" | "feminine" | "unisex") || "unisex",
        concentration: curr.concentration || "EDP",
        notes: {
            top: topNotes,
            heart: heartNotes,
            base: baseNotes,
        },
        accords: curr.accords.map(a => ({
            name: a.name,
            percentage: a.percentage || 0,
            color: a.color || "#cccccc"
        })).sort((a, b) => b.percentage - a.percentage),
        sillage: Number(curr.sillageRating || 3),
        longevity: Number(curr.longevityRating || 3),
        priceValue: Number(curr.priceValueRating || 3),
        seasons: ["spring", "autumn"], // Default for now
        occasions: ["daily"],
        isFeatured: (Number(curr.rating) >= 4.0 && (curr.reviewCount || 0) > 100),
        isNew: (curr.releaseYear || 0) >= 2023,
    };
}

/**
 * Get fragrance by slug with all relations
 */
export async function getFragranceBySlug(slug: string): Promise<Fragrance | null> {
    const result = await db.query.fragrances.findFirst({
        where: eq(fragrances.slug, slug),
        with: {
            brand: true,
            notes: {
                with: {
                    note: true
                }
            },
            accords: true,
        }
    });

    if (!result) return null;

    return transformToFragrance(result);
}

/**
 * Get featured fragrances
 */
export async function getFeaturedFragrances(limit = 8): Promise<Fragrance[]> {
    const results = await db.query.fragrances.findMany({
        orderBy: [desc(fragrances.rating), desc(fragrances.reviewCount)],
        limit: limit,
        with: {
            brand: true,
            notes: {
                with: {
                    note: true
                }
            },
            accords: true,
        }
    });

    return results.map(transformToFragrance);
}

/**
 * Search fragrances (Supabase / DB version)
 */
export async function searchFragrances(options: {
    query?: string;
    brand?: string;
    gender?: "masculine" | "feminine" | "unisex";
    note?: string;
    accord?: string;
    limit?: number;
    offset?: number;
}) {
    const { query = "", brand, gender, note, accord, limit = 20, offset = 0 } = options;

    const filters = [];

    if (query) {
        filters.push(ilike(fragrances.name, `%${query}%`));
        // Note: Simple name search for now. Full text search is better with Postgres FTS but keeping it simple.
    }

    if (brand) {
        const brandRecord = await db.query.brands.findFirst({
            where: eq(brands.slug, brand)
        });
        if (brandRecord) {
            filters.push(eq(fragrances.brandId, brandRecord.id));
        } else {
            return { fragrances: [], total: 0, source: 'database' };
        }
    }

    if (gender) {
        filters.push(eq(fragrances.gender, gender));
    }

    if (note) {
        // 1. Get note ID
        const noteRecord = await db.query.notes.findFirst({ where: eq(notes.name, note) });
        if (noteRecord) {
            // 2. Get fragrance IDs with this note
            const fNotes = await db.query.fragranceNotes.findMany({
                where: eq(fragranceNotes.noteId, noteRecord.id),
                columns: { fragranceId: true }
            });
            const ids = fNotes.map(f => f.fragranceId).filter(Boolean) as string[];
            if (ids.length > 0) {
                filters.push(inArray(fragrances.id, ids));
            } else {
                return { fragrances: [], total: 0, source: 'database' };
            }
        } else {
            return { fragrances: [], total: 0, source: 'database' };
        }
    }

    if (accord) {
        // Get fragrance IDs with this accord
        const fAccords = await db.query.fragranceAccords.findMany({
            where: eq(fragranceAccords.name, accord),
            columns: { fragranceId: true }
        });
        const ids = fAccords.map(f => f.fragranceId).filter(Boolean) as string[];
        if (ids.length > 0) {
            filters.push(inArray(fragrances.id, ids));
        } else {
            return { fragrances: [], total: 0, source: 'database' };
        }
    }

    const results = await db.query.fragrances.findMany({
        where: and(...filters),
        limit: limit,
        offset: offset,
        with: {
            brand: true,
            notes: { with: { note: true } },
            accords: true
        }
    });

    // Count total (optional, separate query)

    return {
        fragrances: results.map(transformToFragrance),
        total: results.length, // approximation
        source: 'database'
    };
}

/**
 * Get reviews for a fragrance
 */
export async function getFragranceReviews(fragranceId: string) {
    return await db.query.reviews.findMany({
        where: eq(reviews.fragranceId, fragranceId),
        orderBy: desc(reviews.createdAt),
        limit: 10
    });
}

/**
 * Get fragrances by brand
 */
export async function getFragrancesByBrand(brandSlug: string, limit = 20) {
    // First find the brand
    const brand = await db.query.brands.findFirst({
        where: eq(brands.slug, brandSlug)
    });

    if (!brand) return [];

    const results = await db.query.fragrances.findMany({
        where: eq(fragrances.brandId, brand.id),
        limit: limit,
        with: {
            brand: true,
            notes: { with: { note: true } },
            accords: true
        }
    });

    return results.map(transformToFragrance);
}

/**
 * Get similar fragrances
 */
export async function getSimilarFragrances(fragrance: Fragrance, limit = 4): Promise<Fragrance[]> {
    // 1. Try to match by main accord
    const mainAccord = fragrance.accords[0]?.name;

    if (mainAccord) {
        // Find fragrances with this accord
        const similarByAccord = await db.query.fragranceAccords.findMany({
            where: and(
                eq(fragranceAccords.name, mainAccord),
                // Ideally we exclude current fragrance here, but we do it in post-filter
            ),
            limit: limit + 5, // fetch a bit more
            with: {
                fragrance: {
                    with: {
                        brand: true,
                        notes: { with: { note: true } },
                        accords: true
                    }
                }
            }
        });

        const mapped = similarByAccord
            .map(a => transformToFragrance(a.fragrance))
            .filter(f => f.id !== fragrance.id)
            .slice(0, limit);

        if (mapped.length > 0) return mapped;
    }

    // 2. Fallback: match by gender
    const results = await db.query.fragrances.findMany({
        where: and(
            eq(fragrances.gender, fragrance.gender),
            // ne(fragrances.id, fragrance.id) // ne not imported yet
        ),
        limit: limit + 1,
        with: {
            brand: true,
            notes: { with: { note: true } },
            accords: true
        }
    });

    return results
        .map(transformToFragrance)
        .filter(f => f.id !== fragrance.id)
        .slice(0, limit);
}

/**
 * Get unique accords
 */
export async function getUniqueAccords(): Promise<string[]> {
    const results = await db.selectDistinct({ name: fragranceAccords.name })
        .from(fragranceAccords)
        .orderBy(fragranceAccords.name);
    return results.map(r => r.name);
}

/**
 * Get unique notes
 */
export async function getUniqueNotes(): Promise<string[]> {
    const results = await db.selectDistinct({ name: notes.name })
        .from(notes)
        .orderBy(notes.name);
    return results.map(r => r.name);
}

/**
 * Get top brands for filters
 */
export async function getTopBrands(limit = 100): Promise<{ id: string; name: string; count: number }[]> {
    // Simplified: just return brands alphabetically for now as counting is expensive without materialized view
    const results = await db.query.brands.findMany({
        orderBy: brands.name,
        limit: limit
    });

    return results.map(b => ({
        id: b.slug,
        name: b.name,
        count: 0 // TODO: Implement count properly if needed
    }));
}

export async function getDatabaseStats() {
    const [fragranceCount, brandCount, notesCount] = await Promise.all([
        db.select({ count: count() }).from(fragrances),
        db.select({ count: count() }).from(brands),
        db.select({ count: count() }).from(notes)
    ]);
    return {
        fragrances: fragranceCount[0].count,
        brands: brandCount[0].count,
        notes: notesCount[0].count
    };
}
