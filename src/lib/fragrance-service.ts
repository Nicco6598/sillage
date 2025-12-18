/**
 * SILLAGE - Fragrance Service
 * Unified service using CSV database (24k+ fragrances)
 */

import { searchCSVFragrances, getFeaturedCSVFragrances, loadFragrancesFromCSV } from "./csv-database";
import type { Fragrance } from "@/types/fragrance";

export interface SearchOptions {
    query?: string;
    brand?: string;
    gender?: "masculine" | "feminine" | "unisex";
    note?: string;
    accord?: string;
    limit?: number;
    offset?: number;
}

export interface SearchResult {
    fragrances: Fragrance[];
    total: number;
    source: "csv";
}

/**
 * Search fragrances in the CSV database
 */
export async function searchFragrances(options: SearchOptions): Promise<SearchResult> {
    const { query = "", limit = 20, offset = 0 } = options;

    const result = searchCSVFragrances({
        query,
        brand: options.brand,
        gender: options.gender,
        limit,
        offset,
    });

    return {
        fragrances: result.fragrances,
        total: result.total,
        source: "csv",
    };
}

/**
 * Get featured fragrances (top rated with many reviews)
 */
export async function getFeaturedFragrances(limit = 8): Promise<Fragrance[]> {
    return getFeaturedCSVFragrances(limit);
}

/**
 * Get fragrance by slug
 */
export async function getFragranceBySlug(slug: string): Promise<Fragrance | null> {
    const fragrances = loadFragrancesFromCSV();
    return fragrances.find((f) => f.slug === slug) ?? null;
}

/**
 * Get fragrances by brand
 */
export async function getFragrancesByBrand(brandSlug: string, limit = 20): Promise<Fragrance[]> {
    const result = await searchFragrances({ brand: brandSlug, limit });
    return result.fragrances;
}

/**
 * Get similar fragrances (same main accord or gender)
 */
export async function getSimilarFragrances(fragrance: Fragrance, limit = 4): Promise<Fragrance[]> {
    const mainAccord = fragrance.accords[0]?.name;

    if (mainAccord) {
        const result = await searchFragrances({ query: mainAccord.toLowerCase(), limit: limit + 1 });
        return result.fragrances
            .filter((f) => f.id !== fragrance.id)
            .slice(0, limit);
    }

    const result = await searchFragrances({ gender: fragrance.gender, limit: limit + 1 });
    return result.fragrances
        .filter((f) => f.id !== fragrance.id)
        .slice(0, limit);
}
