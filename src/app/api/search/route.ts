import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fragrances, brands } from "@/lib/db-schema";
import { ilike, or, sql, eq } from "drizzle-orm";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (query.length < 2) {
        return NextResponse.json({ success: true, suggestions: [] });
    }

    const searchTerm = `%${query}%`;
    const results = await db
        .select({
            id: fragrances.id,
            name: fragrances.name,
            brand: brands.name,
            slug: fragrances.slug,
            imageUrl: fragrances.imageUrl,
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
            sql`CASE WHEN LOWER(${fragrances.name}) LIKE LOWER(${query + '%'}) THEN 0 ELSE 1 END`,
            fragrances.name
        )
        .limit(8);

    return NextResponse.json({
        success: true,
        suggestions: results.map((r) => ({
            id: r.id,
            name: r.name,
            brand: r.brand ?? "",
            slug: r.slug,
            imageUrl: r.imageUrl ?? undefined,
        })),
    });
}
