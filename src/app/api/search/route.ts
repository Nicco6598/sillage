/**
 * GET /api/search
 * Quick search endpoint for autocomplete
 */

import { NextRequest, NextResponse } from "next/server";
import { searchFragrances } from "@/lib/fragrance-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json({
                success: true,
                suggestions: [],
            });
        }

        const result = await searchFragrances({
            query,
            limit: 5,
        });

        const suggestions = result.fragrances.map((f) => ({
            id: f.id,
            name: f.name,
            brand: f.brand.name,
            slug: f.slug,
            imageUrl: f.imageUrl,
        }));

        return NextResponse.json({
            success: true,
            suggestions,
        });
    } catch (error) {
        console.error("Error searching:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Search failed",
            },
            { status: 500 }
        );
    }
}
