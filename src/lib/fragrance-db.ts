
import { db } from "./db";
import { fragrances, brands, fragranceNotes, fragranceAccords, notes, reviews, fragranceSimilarities, fragranceSimilarityVotes } from "./db-schema";
import { eq, ilike, and, desc, inArray, count, sql } from "drizzle-orm";
import type { Fragrance, Brand } from "@/types/fragrance";

// DB shape from Drizzle queries
interface DbFragrance {
    id: string;
    name: string;
    slug: string;
    brand: {
        id: string;
        name: string;
        slug: string;
        country: string | null;
    } | null;
    imageUrl: string | null;
    rating: string | number | null;
    reviewCount: number | null;
    releaseYear: number | null;
    gender: string | null;
    concentration: string | null;
    notes: Array<{
        type: string | null;
        note: {
            id: string;
            name: string;
        } | null;
    }>;
    accords: Array<{
        name: string;
        percentage: number | null;
        color: string | null;
    }>;
    sillageRating: string | number | null;
    longevityRating: string | number | null;
    priceValueRating: string | number | null;
}


function transformToFragrance(dbResult: DbFragrance): Fragrance {
    const topNotes = dbResult.notes.filter((n) => n.type === 'top' && n.note).map((n) => ({ id: n.note!.id, name: n.note!.name, type: 'top' as const }));
    const heartNotes = dbResult.notes.filter((n) => n.type === 'heart' && n.note).map((n) => ({ id: n.note!.id, name: n.note!.name, type: 'heart' as const }));
    const baseNotes = dbResult.notes.filter((n) => n.type === 'base' && n.note).map((n) => ({ id: n.note!.id, name: n.note!.name, type: 'base' as const }));

    // Fallback for missing brand (shouldn't happen with FK constraints)
    const brand = dbResult.brand || { id: "unknown", name: "Unknown", slug: "unknown", country: null };

    return {
        id: dbResult.id,
        name: dbResult.name,
        slug: dbResult.slug,
        brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            country: brand.country || undefined,
        },
        imageUrl: dbResult.imageUrl || "",
        rating: Number(dbResult.rating || 0),
        reviewCount: dbResult.reviewCount || 0,
        year: dbResult.releaseYear || undefined,
        gender: (dbResult.gender as "masculine" | "feminine" | "unisex") || "unisex",
        concentration: (dbResult.concentration as "EDT" | "EDP" | "Parfum" | "EDC" | "Cologne") || "EDP",
        notes: {
            top: topNotes,
            heart: heartNotes,
            base: baseNotes,
        },
        accords: dbResult.accords.map((a) => ({
            name: a.name,
            percentage: a.percentage || 0,
            color: a.color || "#cccccc"
        })).sort((a, b) => (b.percentage || 0) - (a.percentage || 0)),
        sillage: Math.min(5, Math.max(1, Math.round(Number(dbResult.sillageRating || 3)))) as 1 | 2 | 3 | 4 | 5,
        longevity: Math.min(5, Math.max(1, Math.round(Number(dbResult.longevityRating || 3)))) as 1 | 2 | 3 | 4 | 5,
        priceValue: Math.min(5, Math.max(1, Math.round(Number(dbResult.priceValueRating || 3)))) as 1 | 2 | 3 | 4 | 5,
        seasons: ["spring", "autumn"],
        occasions: ["daily"],
        isFeatured: (Number(dbResult.rating) >= 4.0 && (dbResult.reviewCount || 0) > 100),
        isNew: (dbResult.releaseYear || 0) >= 2023,
    };
}


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

    return transformToFragrance(result as DbFragrance);
}


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

    return results.map((r) => transformToFragrance(r as DbFragrance));
}



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
        // TODO: switch to full-text search when dataset grows
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
        const noteRecord = await db.query.notes.findFirst({ where: eq(notes.name, note) });
        if (noteRecord) {
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

    return {
        fragrances: results.map((r) => transformToFragrance(r as DbFragrance)),
        total: results.length, // approximation
        source: 'database'
    };
}


export async function getFragranceReviews(fragranceId: string) {
    return await db.query.reviews.findMany({
        where: eq(reviews.fragranceId, fragranceId),
        orderBy: desc(reviews.createdAt),
        limit: 10
    });
}


export async function getBrandBySlug(slug: string): Promise<Brand | null> {
    const result = await db.query.brands.findFirst({
        where: eq(brands.slug, slug),
        with: {
            fragrances: {
                columns: { id: true }
            }
        }
    });

    if (!result) return null;

    return {
        id: result.id,
        name: result.name,
        slug: result.slug,
        country: result.country || undefined,
        description: result.description || undefined,
        history: result.history || undefined,
        fragranceCount: result.fragrances ? result.fragrances.length : 0
    };
}


export async function getFragrancesByBrand(brandSlug: string, limit = 20) {
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

    return results.map((r) => transformToFragrance(r as DbFragrance));
}


export async function getSimilarFragrances(fragrance: Fragrance, limit = 4): Promise<Fragrance[]> {
    const mainAccord = fragrance.accords[0]?.name;

    if (mainAccord) {
        const similarByAccord = await db.query.fragranceAccords.findMany({
            where: and(
                eq(fragranceAccords.name, mainAccord)
            ),
            limit: limit + 5,
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
            .filter((a) => a.fragrance)
            .map((a) => transformToFragrance(a.fragrance as DbFragrance))
            .filter((f) => f.id !== fragrance.id)
            .slice(0, limit);

        if (mapped.length > 0) return mapped;
    }

    // Fallback: same gender
    const results = await db.query.fragrances.findMany({
        where: and(
            eq(fragrances.gender, fragrance.gender)
        ),
        limit: limit + 1,
        with: {
            brand: true,
            notes: { with: { note: true } },
            accords: true
        }
    });

    return results
        .map((r) => transformToFragrance(r as DbFragrance))
        .filter((f) => f.id !== fragrance.id)
        .slice(0, limit);
}


export async function getUniqueAccords(): Promise<string[]> {
    const results = await db.selectDistinct({ name: fragranceAccords.name })
        .from(fragranceAccords)
        .orderBy(fragranceAccords.name);
    return results.map(r => r.name);
}


export async function getUniqueNotes(): Promise<string[]> {
    const results = await db.selectDistinct({ name: notes.name })
        .from(notes)
        .orderBy(notes.name);
    return results.map(r => r.name);
}


export async function getTopBrands(limit = 100): Promise<{ id: string; name: string; count: number }[]> {
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


export async function getAllBrandsWithCount(): Promise<{
    id: string;
    name: string;
    slug: string;
    country: string | null;
    fragranceCount: number;
}[]> {
    const allBrands = await db.query.brands.findMany({
        orderBy: brands.name,
        with: {
            fragrances: {
                columns: { id: true }
            }
        }
    });

    return allBrands.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        country: b.country,
        fragranceCount: b.fragrances?.length || 0
    }));
}


export async function getFeaturedBrands(limit = 4): Promise<{
    id: string;
    name: string;
    slug: string;
    country: string | null;
    fragranceCount: number;
}[]> {
    const allBrands = await getAllBrandsWithCount();
    return allBrands
        .sort((a, b) => b.fragranceCount - a.fragranceCount)
        .slice(0, limit);
}


export async function getManualSimilarities(fragranceId: string, limit = 50) {
    const results = await db.select({
        id: fragranceSimilarities.id,
        similarFragrance: fragrances,
        brand: brands,
        votesScore: sql<number>`COALESCE(SUM(${fragranceSimilarityVotes.vote}), 0)`.mapWith(Number),
        upvotes: sql<number>`COUNT(CASE WHEN ${fragranceSimilarityVotes.vote} = 1 THEN 1 END)`.mapWith(Number),
        downvotes: sql<number>`COUNT(CASE WHEN ${fragranceSimilarityVotes.vote} = -1 THEN 1 END)`.mapWith(Number),
    })
        .from(fragranceSimilarities)
        .innerJoin(fragrances, eq(fragranceSimilarities.similarId, fragrances.id))
        .innerJoin(brands, eq(fragrances.brandId, brands.id))
        .leftJoin(fragranceSimilarityVotes, eq(fragranceSimilarities.id, fragranceSimilarityVotes.similarityId))
        .where(eq(fragranceSimilarities.fragranceId, fragranceId))
        .groupBy(fragranceSimilarities.id, fragrances.id, brands.id)
        .orderBy(desc(sql`COALESCE(SUM(${fragranceSimilarityVotes.vote}), 0)`))
        .limit(limit);

    return results.map(r => ({
        similarityId: r.id,
        fragrance: transformToFragrance({ ...r.similarFragrance, brand: r.brand, notes: [], accords: [] } as DbFragrance),
        score: r.votesScore,
        upvotes: r.upvotes,
        downvotes: r.downvotes,
    }));
}


export async function voteSimilarity(similarityId: string, userId: string | null, vote: 1 | -1) {
    if (!userId) return null;

    return await db.insert(fragranceSimilarityVotes)
        .values({
            similarityId,
            userId,
            vote,
        })
        .onConflictDoUpdate({
            target: [fragranceSimilarityVotes.similarityId, fragranceSimilarityVotes.userId],
            set: { vote },
        });
}


export async function deleteSimilarityVote(similarityId: string, userId: string | null) {
    if (!userId) return null;

    return await db.delete(fragranceSimilarityVotes)
        .where(and(
            eq(fragranceSimilarityVotes.similarityId, similarityId),
            eq(fragranceSimilarityVotes.userId, userId)
        ));
}


export async function getUserSimilarityVotes(fragranceId: string, userId: string): Promise<Record<string, number>> {
    const results = await db.select({
        similarityId: fragranceSimilarityVotes.similarityId,
        vote: fragranceSimilarityVotes.vote,
    })
        .from(fragranceSimilarityVotes)
        .innerJoin(fragranceSimilarities, eq(fragranceSimilarityVotes.similarityId, fragranceSimilarities.id))
        .where(and(
            eq(fragranceSimilarities.fragranceId, fragranceId),
            eq(fragranceSimilarityVotes.userId, userId)
        ));

    return results.reduce((acc, curr) => {
        if (curr.similarityId) {
            acc[curr.similarityId] = curr.vote;
        }
        return acc;
    }, {} as Record<string, number>);
}


export async function getSpecificSimilarityVote(similarityId: string, userId: string) {
    const result = await db.select({ vote: fragranceSimilarityVotes.vote })
        .from(fragranceSimilarityVotes)
        .where(and(
            eq(fragranceSimilarityVotes.similarityId, similarityId),
            eq(fragranceSimilarityVotes.userId, userId)
        ))
        .limit(1);

    return result[0]?.vote || null;
}


export async function addSimilaritySuggestion(fragranceId: string, similarId: string) {
    if (fragranceId === similarId) return null;

    return await db.insert(fragranceSimilarities)
        .values({
            fragranceId,
            similarId,
        })
        .onConflictDoNothing();
}
