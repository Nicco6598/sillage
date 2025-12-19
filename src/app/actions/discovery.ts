
"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { fragrances } from "@/lib/db-schema";
import { redirect } from "next/navigation";

export async function surpriseMe() {
    // Select a random fragrance slug
    // We use SQL random() which is specific to PostgreSQL
    const result = await db.execute(sql`
        SELECT slug FROM ${fragrances}
        ORDER BY RANDOM()
        LIMIT 1
    `);

    if (result && result.length > 0) {
        const slug = result[0].slug as string;
        redirect(`/fragrance/${slug}`);
    }

    // Fallback if DB is empty
    redirect("/explore");
}
