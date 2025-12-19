import Link from "next/link";
import { Search, ArrowUpRight, Crown, Gem, Star, Sparkles } from "lucide-react";
import { getAllBrandsWithCount, getFeaturedBrands, getDatabaseStats } from "@/lib/fragrance-db";
import { BrandsClientPage } from "./brands-client";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function BrandsPage() {
    // Fetch data from Supabase
    const [allBrands, featuredBrands, stats] = await Promise.all([
        getAllBrandsWithCount(),
        getFeaturedBrands(4),
        getDatabaseStats()
    ]);

    return (
        <BrandsClientPage
            allBrands={allBrands}
            featuredBrands={featuredBrands}
            stats={stats}
        />
    );
}
