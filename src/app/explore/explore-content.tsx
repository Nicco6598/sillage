"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useEffect } from "react";
import { Search, Filter, X, Check, ArrowRight } from "lucide-react";
import type { Fragrance } from "@/types/fragrance";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface FilterOptions {
    brands: { id: string; name: string; count: number }[];
    accords: string[];
    notes: string[];
}

interface CurrentFilters {
    gender: string | null;
    brand: string | null;
    note: string | null;
    accord: string | null;
}

interface ExploreContentProps {
    fragrances: Fragrance[];
    total: number;
    page: number;
    limit: number;
    query: string;
    currentFilters: CurrentFilters;
    filterOptions: FilterOptions;
}

const GENDER_OPTIONS = [
    { value: "masculine", label: "Maschili" },
    { value: "feminine", label: "Femminili" },
    { value: "unisex", label: "Unisex" },
];

export function ExploreContent({
    fragrances,
    total,
    page,
    limit,
    query,
    currentFilters,
    filterOptions,
}: ExploreContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        gender: currentFilters.gender ?? "",
        brand: currentFilters.brand ?? "",
        note: currentFilters.note ?? "",
        accord: currentFilters.accord ?? "",
    });
    const [priceRange, setPriceRange] = useState([0, 600]);

    // Sync local filters with URL params when they change externally
    useEffect(() => {
        setLocalFilters({
            gender: currentFilters.gender ?? "",
            brand: currentFilters.brand ?? "",
            note: currentFilters.note ?? "",
            accord: currentFilters.accord ?? "",
        });
    }, [currentFilters]);
    const [searchInFilters, setSearchInFilters] = useState({
        brand: "",
        note: "",
        accord: "",
    });

    const totalPages = Math.ceil(total / limit);

    // Apply filters
    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (localFilters.gender) params.set("gender", localFilters.gender);
        if (localFilters.brand) params.set("brand", localFilters.brand);
        if (localFilters.note) params.set("note", localFilters.note);
        if (localFilters.accord) params.set("accord", localFilters.accord);
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 600) params.set("maxPrice", priceRange[1].toString());
        params.set("page", "1");

        startTransition(() => {
            router.push(`/explore?${params.toString()}`);
        });
        setIsFilterOpen(false);
    }, [localFilters, priceRange, query, router]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setLocalFilters({ gender: "", brand: "", note: "", accord: "" });
        setPriceRange([0, 600]);
        startTransition(() => {
            router.push(query ? `/explore?q=${query}` : "/explore");
        });
        setIsFilterOpen(false);
    }, [query, router]);

    // Remove single filter
    const removeFilter = useCallback((key: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        newParams.set("page", "1");
        startTransition(() => {
            router.push(`/explore?${newParams.toString()}`);
        });
    }, [router, searchParams]);

    // Count active filters
    const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;

    // Filtered lists for search within filter modal
    const filteredBrands = filterOptions.brands.filter(b =>
        b.name.toLowerCase().includes(searchInFilters.brand.toLowerCase())
    ).slice(0, 30);

    const filteredNotes = filterOptions.notes.filter(n =>
        n.toLowerCase().includes(searchInFilters.note.toLowerCase())
    ).slice(0, 30);

    const filteredAccords = filterOptions.accords.filter(a =>
        a.toLowerCase().includes(searchInFilters.accord.toLowerCase())
    ).slice(0, 20);

    return (
        <div className="space-y-12">
            {/* Search Bar + Filter Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-end justify-between border-b border-border-primary pb-8">
                <div className="relative flex-1 max-w-md w-full">
                    <input
                        type="text"
                        defaultValue={query}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const params = new URLSearchParams(searchParams);
                                const value = e.currentTarget.value;
                                if (value) params.set("q", value);
                                else params.delete("q");
                                router.push(`/explore?${params.toString()}`);
                            }
                        }}
                        placeholder="CERCA..."
                        className="w-full bg-transparent border-b border-text-primary py-2 pr-8 text-sm uppercase tracking-widest outline-none focus:border-text-secondary placeholder:text-text-muted transition-colors"
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                </div>

                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 text-sm uppercase tracking-widest border border-border-primary px-4 py-2 hover:bg-bg-secondary transition-colors"
                >
                    <Filter className="h-4 w-4" /> Filtri
                    {activeFilterCount > 0 && (
                        <span className="ml-1 text-xs">({activeFilterCount})</span>
                    )}
                </button>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                        Filtri attivi:
                    </span>
                    {currentFilters.gender && (
                        <FilterChip
                            label={GENDER_OPTIONS.find(g => g.value === currentFilters.gender)?.label ?? currentFilters.gender}
                            onRemove={() => removeFilter("gender")}
                        />
                    )}
                    {currentFilters.brand && (
                        <FilterChip label={currentFilters.brand} onRemove={() => removeFilter("brand")} />
                    )}
                    {currentFilters.note && (
                        <FilterChip label={currentFilters.note} onRemove={() => removeFilter("note")} />
                    )}
                    {currentFilters.accord && (
                        <FilterChip label={currentFilters.accord} onRemove={() => removeFilter("accord")} />
                    )}
                    <button
                        onClick={clearFilters}
                        className="text-xs uppercase tracking-widest underline hover:no-underline"
                    >
                        Rimuovi tutti
                    </button>
                </div>
            )}

            {/* Results Grid - Same style as homepage */}
            {fragrances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {fragrances.map((fragrance) => (
                        <Link key={fragrance.id} href={`/fragrance/${fragrance.slug}`} className="group block cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden bg-bg-tertiary relative mb-6">
                                <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 transition-transform duration-700 ease-out group-hover:scale-105" />

                                {/* Rating overlay on hover */}
                                <div className="absolute top-4 right-4 bg-bg-primary text-xs font-mono px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {fragrance.rating.toFixed(1)} ★
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline">
                                <div className="pr-4">
                                    <h3 className="text-lg font-medium leading-tight group-hover:underline decoration-1 underline-offset-4 mb-1 line-clamp-1">
                                        {fragrance.name}
                                    </h3>
                                    <p className="text-sm text-text-muted uppercase tracking-wider line-clamp-1">
                                        {fragrance.brand.name}
                                    </p>
                                </div>
                                <span className="text-sm font-mono">{fragrance.rating.toFixed(1)} ★</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24">
                    <p className="text-xl text-text-secondary font-serif mb-2">Nessuna fragranza trovata.</p>
                    <p className="text-sm text-text-muted mb-6">Prova a modificare i filtri o la ricerca.</p>
                    <button onClick={clearFilters} className="text-xs uppercase tracking-widest border-b border-text-primary pb-1">
                        Reset Filtri
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-24 flex justify-center">
                    <div className="flex items-center gap-4">
                        {page > 1 && (
                            <Link
                                href={`/explore?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) }).toString()}`}
                                className="text-sm uppercase tracking-widest hover:underline"
                            >
                                ← Precedente
                            </Link>
                        )}
                        <span className="text-sm font-mono">
                            Pagina {page} di {totalPages}
                        </span>
                        {page < totalPages && (
                            <Link
                                href={`/explore?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) }).toString()}`}
                                className="text-sm uppercase tracking-widest hover:underline"
                            >
                                Successiva →
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />

                    {/* Drawer */}
                    <div className="relative w-full max-w-sm h-full bg-bg-primary border-l border-border-primary p-8 overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="font-serif text-3xl">Filtri</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-bg-secondary rounded-full transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Gender */}
                            <div className="border-b border-border-primary pb-8">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Genere</h3>
                                <div className="space-y-2">
                                    {GENDER_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                gender: localFilters.gender === option.value ? "" : option.value
                                            })}
                                            className={cn(
                                                "w-full text-left py-2 px-3 border transition-colors",
                                                localFilters.gender === option.value
                                                    ? "border-text-primary bg-bg-secondary"
                                                    : "border-border-primary hover:bg-bg-secondary"
                                            )}
                                        >
                                            <span className="flex items-center justify-between">
                                                <span className="text-sm uppercase tracking-wider">{option.label}</span>
                                                {localFilters.gender === option.value && <Check className="h-4 w-4" />}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="border-b border-border-primary pb-8">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Prezzo Range</h3>
                                <Slider
                                    min={0}
                                    max={600}
                                    step={10}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="mb-4"
                                />
                                <div className="flex justify-between text-sm font-mono">
                                    <span>€{priceRange[0]}</span>
                                    <span>€{priceRange[1]}+</span>
                                </div>
                            </div>

                            {/* Brand Search */}
                            <div className="border-b border-border-primary pb-8">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Brand</h3>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Cerca brand..."
                                        value={searchInFilters.brand}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, brand: e.target.value })}
                                        className="w-full bg-bg-secondary text-sm p-2 border border-border-primary focus:border-text-primary outline-none transition-colors"
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted" />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {filteredBrands.map(brand => (
                                        <button
                                            key={brand.id}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                brand: localFilters.brand === brand.id ? "" : brand.id
                                            })}
                                            className="flex items-center justify-between w-full text-left p-1 hover:bg-bg-secondary"
                                        >
                                            <span className={cn(
                                                "text-sm uppercase tracking-wider",
                                                localFilters.brand === brand.id ? "font-medium" : ""
                                            )}>
                                                {brand.name}
                                            </span>
                                            {localFilters.brand === brand.id && <Check className="h-3 w-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accords */}
                            <div className="border-b border-border-primary pb-8">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Famiglia Olfattiva</h3>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Cerca accordi..."
                                        value={searchInFilters.accord}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, accord: e.target.value })}
                                        className="w-full bg-bg-secondary text-sm p-2 border border-border-primary focus:border-text-primary outline-none transition-colors"
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted" />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {filteredAccords.map(accord => (
                                        <button
                                            key={accord}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                accord: localFilters.accord === accord ? "" : accord
                                            })}
                                            className="flex items-center justify-between w-full text-left p-1 hover:bg-bg-secondary"
                                        >
                                            <span className={cn(
                                                "text-sm",
                                                localFilters.accord === accord ? "font-medium" : ""
                                            )}>
                                                {accord}
                                            </span>
                                            {localFilters.accord === accord && <Check className="h-3 w-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="pb-6">
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Note</h3>
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Cerca note..."
                                        value={searchInFilters.note}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, note: e.target.value })}
                                        className="w-full bg-bg-secondary text-sm p-2 border border-border-primary focus:border-text-primary outline-none transition-colors"
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted" />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {filteredNotes.map(note => (
                                        <button
                                            key={note}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                note: localFilters.note === note ? "" : note
                                            })}
                                            className="flex items-center justify-between w-full text-left p-1 hover:bg-bg-secondary"
                                        >
                                            <span className={cn(
                                                "text-sm",
                                                localFilters.note === note ? "font-medium" : ""
                                            )}>
                                                {note}
                                            </span>
                                            {localFilters.note === note && <Check className="h-3 w-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4 pt-4 border-t border-border-primary">
                            <button
                                onClick={clearFilters}
                                className="flex-1 py-3 text-xs uppercase tracking-widest border border-border-primary hover:bg-bg-secondary transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                disabled={isPending}
                                className="flex-1 py-3 text-xs uppercase tracking-widest bg-text-primary text-bg-primary hover:bg-text-secondary transition-colors"
                            >
                                Applica
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Filter Chip Component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-bg-secondary text-xs uppercase tracking-widest border border-border-primary">
            {label}
            <button onClick={onRemove} className="hover:text-text-primary transition-colors">
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}
