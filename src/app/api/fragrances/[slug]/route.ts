/**
 * GET /api/fragrances/[slug]
 * Get single fragrance by slug
 */

import { NextRequest, NextResponse } from "next/server";
import { getFragranceBySlug, getSimilarFragrances } from "@/lib/fragrance-service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const fragrance = await getFragranceBySlug(slug);

        if (!fragrance) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Fragrance not found",
                },
                { status: 404 }
            );
        }

        // Get similar fragrances
        const similar = await getSimilarFragrances(fragrance, 4);

        return NextResponse.json({
            success: true,
            data: fragrance,
            similar,
        });
    } catch (error) {
        console.error("Error fetching fragrance:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch fragrance",
            },
            { status: 500 }
        );
    }
}
