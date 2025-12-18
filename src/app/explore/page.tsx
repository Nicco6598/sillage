import { Suspense } from "react";
import { searchFragrances } from "@/lib/fragrance-service";
import { getBrandsFromCSV, getUniqueAccords, getUniqueNotes } from "@/lib/csv-database";
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
        season?: string;
        occasion?: string;
        concentration?: string;
        ratingMin?: string;
        yearMin?: string;
        yearMax?: string;
        sortBy?: string;
        page?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Esplora Fragranze | SILLAGE",
    description: "Scopri oltre 24.000 fragranze. Filtra per note, accordi, stagione, occasione e molto altro. Trova il tuo profumo perfetto.",
};

/**
 * Explore/Search page - Modern 2025 Design
 */
export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const params = await searchParams;

    const query = params.q ?? "";
    const gender = params.gender as "masculine" | "feminine" | "unisex" | undefined;
    const brand = params.brand;
    const note = params.note;
    const accord = params.accord;
    const page = parseInt(params.page ?? "1", 10);
    const limit = 24; // More items per page for smaller cards
    const offset = (page - 1) * limit;

    const result = await searchFragrances({
        query,
        gender,
        brand,
        note,
        accord,
        limit,
        offset,
    });

    // Get filter options for the filter panel
    const brands = getBrandsFromCSV().slice(0, 50);
    const accords = getUniqueAccords();
    const notes = getUniqueNotes();

    return (
        <main className="min-h-screen bg-bg-primary">
            {/* Hero Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-accent-secondary/5 to-transparent pt-28 pb-8">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
                    <div className="absolute top-20 -left-20 h-60 w-60 rounded-full bg-accent-secondary/10 blur-3xl" />
                </div>

                <div className="container-page relative">
                    {/* Title & Stats */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl">
                                {query ? (
                                    <>
                                        <span className="text-text-muted">Risultati per</span>{" "}
                                        <span className="gradient-text">&quot;{query}&quot;</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="gradient-text">Esplora</span>{" "}
                                        <span className="text-text-primary">Fragranze</span>
                                    </>
                                )}
                            </h1>
                            <p className="mt-2 text-text-secondary md:text-lg">
                                <span className="font-semibold text-accent">{result.total.toLocaleString()}</span>{" "}
                                {result.total === 1 ? "fragranza trovata" : "fragranze trovate"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-page py-6">
                <Suspense
                    fallback={
                        <div className="space-y-6">
                            {/* Skeleton Filter Bar */}
                            <div className="flex gap-3">
                                <div className="skeleton h-11 w-32 rounded-xl" />
                                <div className="skeleton h-11 w-24 rounded-xl" />
                                <div className="skeleton h-11 w-28 rounded-xl" />
                            </div>
                            {/* Skeleton Grid */}
                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {Array.from({ length: 18 }).map((_, i) => (
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
