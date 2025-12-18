/**
 * SILLAGE - CSV Database Parser
 * Parses the Fragrantica CSV dataset into our Fragrance type
 */

import { readFileSync } from "fs";
import { join } from "path";
import type { Fragrance } from "@/types/fragrance";

interface CSVFragrance {
    url: string;
    Perfume: string;
    Brand: string;
    Country: string;
    Gender: string;
    "Rating Value": string;
    "Rating Count": string;
    Year: string;
    Top: string;
    Middle: string;
    Base: string;
    Perfumer1: string;
    Perfumer2: string;
    mainaccord1: string;
    mainaccord2: string;
    mainaccord3: string;
    mainaccord4: string;
    mainaccord5: string;
}

// Cache for parsed fragrances
let cachedFragrances: Fragrance[] | null = null;

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string, delimiter = ";"): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());

    return result;
}

/**
 * Parse notes string into array
 */
function parseNotes(notesString: string): { id: string; name: string; type: "top" | "heart" | "base" }[] {
    if (!notesString || notesString === "unknown") return [];

    return notesString
        .split(",")
        .map((note) => note.trim())
        .filter((note) => note.length > 0 && note !== "unknown")
        .slice(0, 5) // Limit to 5 notes per type
        .map((note) => ({
            id: note.toLowerCase().replace(/\s+/g, "-"),
            name: note.charAt(0).toUpperCase() + note.slice(1),
            type: "top" as const, // Will be overwritten
        }));
}

/**
 * Get color for accord
 */
function getAccordColor(accord: string): string {
    const colors: Record<string, string> = {
        aromatic: "#228B22",
        citrus: "#FFD700",
        woody: "#8B4513",
        floral: "#FF69B4",
        oriental: "#8B0000",
        fresh: "#4682B4",
        spicy: "#CD853F",
        "fresh spicy": "#CD853F",
        green: "#228B22",
        earthy: "#8B7355",
        mossy: "#556B2F",
        fruity: "#FFA07A",
        sweet: "#FFB6C1",
        powdery: "#DDA0DD",
        musky: "#A9A9A9",
        amber: "#FFBF00",
        vanilla: "#F5DEB3",
        aquatic: "#4169E1",
        leather: "#3D2914",
        oud: "#3D2914",
        gourmand: "#D2691E",
        nutty: "#8B7355",
        tropical: "#FF6347",
        "white floral": "#FFB6C1",
        balsamic: "#8B4513",
        smoky: "#696969",
        warm: "#DAA520",
        animalic: "#8B4513",
        ozonic: "#87CEEB",
        marine: "#4169E1",
        herbal: "#228B22",
        rose: "#FF69B4",
        lavender: "#9370DB",
    };
    return colors[accord.toLowerCase()] ?? "#71717A";
}

/**
 * Transform CSV row to Fragrance type
 */
function transformCSVToFragrance(row: CSVFragrance, index: number): Fragrance {
    const genderMap: Record<string, "masculine" | "feminine" | "unisex"> = {
        men: "masculine",
        women: "feminine",
        unisex: "unisex",
    };

    // Parse rating (format: "4,5" -> 4.5)
    const rating = parseFloat((row["Rating Value"] || "0").replace(",", "."));
    const reviewCount = parseInt(row["Rating Count"] || "0", 10);
    const year = parseInt(row.Year || "0", 10);

    // Create slug from perfume name
    const slug = row.Perfume.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");

    // Parse accords
    const accords = [row.mainaccord1, row.mainaccord2, row.mainaccord3, row.mainaccord4, row.mainaccord5]
        .filter((a) => a && a.length > 0 && a !== "unknown")
        .slice(0, 4)
        .map((accord, i) => ({
            name: accord.charAt(0).toUpperCase() + accord.slice(1),
            percentage: 90 - i * 15,
            color: getAccordColor(accord),
        }));

    // Parse notes
    const topNotes = parseNotes(row.Top).map((n) => ({ ...n, type: "top" as const }));
    const heartNotes = parseNotes(row.Middle).map((n) => ({ ...n, type: "heart" as const }));
    const baseNotes = parseNotes(row.Base).map((n) => ({ ...n, type: "base" as const }));

    return {
        id: `${index + 1}`,
        name: row.Perfume
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        slug,
        brand: {
            id: row.Brand.toLowerCase().replace(/\s+/g, "-"),
            name: row.Brand.charAt(0).toUpperCase() + row.Brand.slice(1),
            slug: row.Brand.toLowerCase().replace(/\s+/g, "-"),
            country: row.Country || undefined,
        },
        imageUrl: "", // No images in CSV
        rating: isNaN(rating) ? 3.5 : Math.min(5, Math.max(0, rating)),
        reviewCount: isNaN(reviewCount) ? 100 : reviewCount,
        year: year > 1900 && year <= new Date().getFullYear() ? year : undefined,
        gender: genderMap[row.Gender?.toLowerCase()] ?? "unisex",
        concentration: "EDP", // Not in CSV, default to EDP
        notes: {
            top: topNotes,
            heart: heartNotes,
            base: baseNotes,
        },
        accords,
        sillage: 3,
        longevity: 3,
        priceValue: 3,
        seasons: ["spring", "autumn"],
        occasions: ["daily"],
        isFeatured: rating >= 4.0 && reviewCount > 500,
        isNew: year >= 2023,
    };
}

/**
 * Load and parse fragrances from CSV
 */
export function loadFragrancesFromCSV(): Fragrance[] {
    if (cachedFragrances) {
        return cachedFragrances;
    }

    try {
        const csvPath = join(process.cwd(), "fra_cleaned.csv");
        const content = readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((line) => line.trim().length > 0);

        // Skip header
        const dataLines = lines.slice(1);

        // Parse header to get column names
        const headers = parseCSVLine(lines[0]);

        const fragrances: Fragrance[] = [];

        for (let i = 0; i < dataLines.length; i++) {
            try {
                const values = parseCSVLine(dataLines[i]);

                if (values.length < headers.length) continue;

                const row: CSVFragrance = {
                    url: values[0] || "",
                    Perfume: values[1] || "",
                    Brand: values[2] || "",
                    Country: values[3] || "",
                    Gender: values[4] || "",
                    "Rating Value": values[5] || "",
                    "Rating Count": values[6] || "",
                    Year: values[7] || "",
                    Top: values[8] || "",
                    Middle: values[9] || "",
                    Base: values[10] || "",
                    Perfumer1: values[11] || "",
                    Perfumer2: values[12] || "",
                    mainaccord1: values[13] || "",
                    mainaccord2: values[14] || "",
                    mainaccord3: values[15] || "",
                    mainaccord4: values[16] || "",
                    mainaccord5: values[17] || "",
                };

                // Skip entries without name or brand
                if (!row.Perfume || !row.Brand) continue;

                const fragrance = transformCSVToFragrance(row, i);
                fragrances.push(fragrance);
            } catch {
                // Skip malformed rows
                continue;
            }
        }

        console.log(`📊 Loaded ${fragrances.length} fragrances from CSV database`);
        cachedFragrances = fragrances;
        return fragrances;
    } catch (error) {
        console.error("Failed to load CSV database:", error);
        return [];
    }
}

/**
 * Search fragrances in CSV database
 */
export function searchCSVFragrances(options: {
    query?: string;
    brand?: string;
    gender?: "masculine" | "feminine" | "unisex";
    limit?: number;
    offset?: number;
}): { fragrances: Fragrance[]; total: number } {
    const { query = "", brand, gender, limit = 20, offset = 0 } = options;

    let fragrances = loadFragrancesFromCSV();

    // Apply filters
    if (query) {
        const q = query.toLowerCase();
        fragrances = fragrances.filter(
            (f) =>
                f.name.toLowerCase().includes(q) ||
                f.brand.name.toLowerCase().includes(q) ||
                f.accords.some((a) => a.name.toLowerCase().includes(q)) ||
                f.notes.top.some((n) => n.name.toLowerCase().includes(q)) ||
                f.notes.heart.some((n) => n.name.toLowerCase().includes(q)) ||
                f.notes.base.some((n) => n.name.toLowerCase().includes(q))
        );
    }

    if (brand) {
        const b = brand.toLowerCase();
        fragrances = fragrances.filter(
            (f) => f.brand.id.includes(b) || f.brand.name.toLowerCase().includes(b)
        );
    }

    if (gender) {
        fragrances = fragrances.filter((f) => f.gender === gender);
    }

    // Sort by rating (best first)
    fragrances.sort((a, b) => b.rating - a.rating);

    const total = fragrances.length;
    const paginated = fragrances.slice(offset, offset + limit);

    return { fragrances: paginated, total };
}

/**
 * Get featured fragrances from CSV
 */
export function getFeaturedCSVFragrances(limit = 8): Fragrance[] {
    const fragrances = loadFragrancesFromCSV();

    return fragrances
        .filter((f) => f.rating >= 4.0 && f.reviewCount > 100)
        .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
        .slice(0, limit);
}

/**
 * Get unique brands from CSV
 */
export function getBrandsFromCSV(): { id: string; name: string; count: number }[] {
    const fragrances = loadFragrancesFromCSV();
    const brandCounts = new Map<string, { name: string; count: number }>();

    for (const f of fragrances) {
        const existing = brandCounts.get(f.brand.id);
        if (existing) {
            existing.count++;
        } else {
            brandCounts.set(f.brand.id, { name: f.brand.name, count: 1 });
        }
    }

    return Array.from(brandCounts.entries())
        .map(([id, { name, count }]) => ({ id, name, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get unique accords from CSV database
 */
export function getUniqueAccords(): string[] {
    const fragrances = loadFragrancesFromCSV();
    const accordSet = new Set<string>();

    for (const f of fragrances) {
        for (const accord of f.accords) {
            if (accord.name && accord.name.length > 0) {
                accordSet.add(accord.name);
            }
        }
    }

    return Array.from(accordSet).sort();
}

/**
 * Get unique notes from CSV database
 */
export function getUniqueNotes(): string[] {
    const fragrances = loadFragrancesFromCSV();
    const noteSet = new Set<string>();

    for (const f of fragrances) {
        for (const note of [...f.notes.top, ...f.notes.heart, ...f.notes.base]) {
            if (note.name && note.name.length > 0) {
                noteSet.add(note.name);
            }
        }
    }

    return Array.from(noteSet).sort();
}
