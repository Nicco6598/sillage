import { Suspense } from "react";
import { searchFragrances, getTopBrands, getUniqueAccords, getUniqueNotes, getDatabaseStats } from "@/lib/fragrance-db";
import { ExploreContent } from "./explore-content";
import { FragranceCardSkeleton } from "@/components/fragrance/fragrance-card";
import type { Metadata } from "next";

interface ExplorePageProps {
    searchParams: Promise<{
        q?: string;
        gender?: string;
        brand?: string;
        note?: string;
        accord?: string;
        page?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Esplora Fragranze | SILLAGE",
    description: "Scopri oltre 24.000 fragranze. Filtra per note, accordi, brand e molto altro.",
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const params = await searchParams;

    const query = params.q ?? "";
    const gender = params.gender as "masculine" | "feminine" | "unisex" | undefined;
    const brand = params.brand;
    const note = params.note;
    const accord = params.accord;
    const page = parseInt(params.page ?? "1", 10);
    const limit = 24;
    const offset = (page - 1) * limit;

    // Parallel data fetching for performance
    const [result, brands, accords, notes, stats] = await Promise.all([
        searchFragrances({
            query,
            gender,
            brand,
            note,
            accord,
            limit,
            offset,
        }),
        getTopBrands(3000),
        getUniqueAccords(),
        getUniqueNotes(),
        getDatabaseStats()
    ]);

    // Check if any filters are active
    const hasFilters = !!(gender || brand || note || accord || query);

    return (
        <main className="w-full pt-32 md:pt-40 pb-24">
            <div className="container-page">
                {/* Hero Header */}
                <div className="mb-16 md:mb-24">
                    <div className="relative">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                                <div className="space-y-4">
                                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                        Esplora<span className="text-copper">.</span>
                                    </h1>
                                    <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                        {hasFilters ? (
                                            <>
                                                Trovate <span className="font-semibold text-copper">{result.total.toLocaleString()}</span> fragranze
                                                {result.total !== stats.fragrances && ` su ${stats.fragrances.toLocaleString()}`}
                                            </>
                                        ) : (
                                            "Cerca tra migliaia di profumi, note olfattive e accordi unici."
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className="flex flex-wrap gap-8 pt-8 border-t border-border-primary">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-3xl text-copper">{stats.fragrances.toLocaleString()}</span>
                                    <span className="text-sm text-text-muted uppercase tracking-wide">Fragranze</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-3xl text-gold">{stats.brands.toLocaleString()}</span>
                                    <span className="text-sm text-text-muted uppercase tracking-wide">Brand</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-3xl text-rose-gold">{stats.notes.toLocaleString()}</span>
                                    <span className="text-sm text-text-muted uppercase tracking-wide">Note</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Suspense
                    fallback={
                        <div className="space-y-8">
                            {/* Search skeleton */}
                            <div className="flex justify-between items-center pb-8 border-b border-border-primary">
                                <div className="h-10 w-80 bg-bg-tertiary animate-pulse" />
                                <div className="h-10 w-24 bg-bg-tertiary animate-pulse" />
                            </div>
                            {/* Cards skeleton */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <FragranceCardSkeleton key={i} variant="compact" />
                                ))}
                            </div>
                        </div>
                    }
                >
                    <ExploreContent
                        fragrances={result.fragrances}
                        total={result.total}
                        page={page}
                        limit={limit}
                        query={query}
                        currentFilters={{
                            gender: gender ?? null,
                            brand: brand ?? null,
                            note: note ?? null,
                            accord: accord ?? null,
                        }}
                        filterOptions={{
                            brands,
                            accords,
                            notes,
                        }}
                    />
                </Suspense>
            </div>
        </main>
    );
}
