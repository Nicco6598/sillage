
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
        getTopBrands(3000), // Load all brands (approx 1000 currently)
        getUniqueAccords(),
        getUniqueNotes(),
        getDatabaseStats()
    ]);

    return (
        <main className="w-full pt-40 pb-24">
            <div className="container-page">
                {/* Header */}
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-border-primary pb-8">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl mb-4">Esplora.</h1>
                        <p className="text-text-secondary text-lg max-w-md">
                            {result.total !== stats.fragrances ? (
                                <>
                                    Trovate <span className="font-semibold text-text-primary">{result.total.toLocaleString()}</span> fragranze su {stats.fragrances.toLocaleString()}.
                                </>
                            ) : (
                                "Cerca tra migliaia di profumi, note e accordi."
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 md:gap-12 pb-2 w-full md:w-auto">
                        <div className="bg-bg-secondary p-4 text-center border border-border-primary min-w-[100px]">
                            <span className="block text-xl md:text-2xl font-serif mb-1">{stats.fragrances.toLocaleString()}</span>
                            <span className="text-[10px] uppercase tracking-widest text-text-muted block">Fragranze</span>
                        </div>
                        <div className="bg-bg-secondary p-4 text-center border border-border-primary min-w-[100px]">
                            <span className="block text-xl md:text-2xl font-serif mb-1">{stats.brands.toLocaleString()}</span>
                            <span className="text-[10px] uppercase tracking-widest text-text-muted block">Brand</span>
                        </div>
                        <div className="bg-bg-secondary p-4 text-center border border-border-primary min-w-[100px]">
                            <span className="block text-xl md:text-2xl font-serif mb-1">{stats.notes.toLocaleString()}</span>
                            <span className="text-[10px] uppercase tracking-widest text-text-muted block">Note</span>
                        </div>
                    </div>
                </div>

                <Suspense
                    fallback={
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <FragranceCardSkeleton key={i} variant="compact" />
                            ))}
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
