/**
 * GET /api/fragrances
 * Search and list fragrances
 */

import { NextRequest, NextResponse } from "next/server";
import { searchFragrances } from "@/lib/fragrance-service";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get("q") ?? "";
        const brand = searchParams.get("brand") ?? undefined;
        const gender = searchParams.get("gender") as "masculine" | "feminine" | "unisex" | undefined;
        const note = searchParams.get("note") ?? undefined;
        const accord = searchParams.get("accord") ?? undefined;
        const limit = parseInt(searchParams.get("limit") ?? "20", 10);
        const offset = parseInt(searchParams.get("offset") ?? "0", 10);

        const result = await searchFragrances({
            query,
            brand,
            gender,
            note,
            accord,
            limit: Math.min(limit, 100), // Cap at 100
            offset,
        });

        return NextResponse.json({
            success: true,
            data: result.fragrances,
            meta: {
                total: result.total,
                limit,
                offset,
                source: result.source,
            },
        });
    } catch (error) {
        console.error("Error fetching fragrances:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch fragrances",
            },
            { status: 500 }
        );
    }
}
