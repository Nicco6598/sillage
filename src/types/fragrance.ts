/**
 * SILLAGE - Fragrance Types
 * Type definitions for the fragrance database
 */

export interface FragranceNote {
    id: string;
    name: string;
    type: "top" | "heart" | "base";
    icon?: string;
}

export interface FragranceBrand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    country?: string;
}

export interface Fragrance {
    id: string;
    name: string;
    slug: string;
    brand: FragranceBrand;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    year?: number;
    gender: "masculine" | "feminine" | "unisex";
    concentration: "EDT" | "EDP" | "Parfum" | "EDC" | "Cologne";
    notes: {
        top: FragranceNote[];
        heart: FragranceNote[];
        base: FragranceNote[];
    };
    accords: FragranceAccord[];
    sillage: 1 | 2 | 3 | 4 | 5;
    longevity: 1 | 2 | 3 | 4 | 5;
    priceValue: 1 | 2 | 3 | 4 | 5;
    seasons: Season[];
    occasions: Occasion[];
    description?: string;
    isFeatured?: boolean;
    isNew?: boolean;
}

export interface FragranceAccord {
    name: string;
    percentage: number;
    color: string;
}

export type Season = "spring" | "summer" | "autumn" | "winter";
export type Occasion = "daily" | "business" | "evening" | "night" | "leisure" | "sport";
export type Gender = "masculine" | "feminine" | "unisex";

export interface Review {
    id: string;
    fragranceId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    content: string;
    sillage: 1 | 2 | 3 | 4 | 5;
    longevity: 1 | 2 | 3 | 4 | 5;
    date: string;
    likes: number;
    isVerified?: boolean;
    batchCode?: string;
    productionDate?: string;
}

export interface FragranceCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    fragranceCount: number;
}

export interface SearchFilters {
    query?: string;
    brands?: string[];
    gender?: Gender[];
    notes?: string[];
    accords?: string[];
    seasons?: Season[];
    occasions?: Occasion[];
    priceRange?: [number, number];
    ratingMin?: number;
    concentration?: string[];
    sortBy?: "rating" | "popularity" | "newest" | "name";
    sortOrder?: "asc" | "desc";
}
