"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useEffect } from "react";
import { Search, SlidersHorizontal, X, Check, ChevronLeft, ChevronRight, Star, ArrowUpRight } from "lucide-react";
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
    { value: "masculine", label: "Maschili", emoji: "♂" },
    { value: "feminine", label: "Femminili", emoji: "♀" },
    { value: "unisex", label: "Unisex", emoji: "⚥" },
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
    const [searchValue, setSearchValue] = useState(query);

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

    // Handle search submit
    const handleSearch = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        if (searchValue) params.set("q", searchValue);
        else params.delete("q");
        params.set("page", "1");
        startTransition(() => {
            router.push(`/explore?${params.toString()}`);
        });
    }, [searchValue, searchParams, router]);

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
        <div className="space-y-10">
            {/* Search Bar + Filter Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                    <div className="absolute inset-0 bg-bg-tertiary/50 backdrop-blur-sm -z-10 border border-border-primary" />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Cerca fragranze..."
                        className="w-full bg-transparent px-4 py-3 pr-12 text-sm tracking-wide placeholder:text-text-muted outline-none"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-bg-secondary transition-colors"
                    >
                        <Search className="h-4 w-4 text-text-muted" />
                    </button>
                </div>

                {/* Filter Button */}
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className={cn(
                        "flex items-center justify-center gap-2 px-5 py-3 text-sm uppercase tracking-widest border transition-all duration-300",
                        activeFilterCount > 0
                            ? "border-copper bg-copper/5 text-copper"
                            : "border-border-primary hover:border-copper hover:text-copper"
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filtri</span>
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 flex items-center justify-center bg-copper text-white text-[10px] font-medium">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-3">
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
                        <FilterChip label={currentFilters.note} onRemove={() => removeFilter("note")} className="capitalize" />
                    )}
                    {currentFilters.accord && (
                        <FilterChip label={currentFilters.accord} onRemove={() => removeFilter("accord")} className="capitalize" />
                    )}
                    <button
                        onClick={clearFilters}
                        className="text-xs uppercase tracking-widest text-text-muted hover:text-copper transition-colors"
                    >
                        Rimuovi tutti
                    </button>
                </div>
            )}

            {/* Results Grid */}
            {fragrances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {fragrances.map((fragrance) => (
                        <FragranceCard key={fragrance.id} fragrance={fragrance} />
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <p className="font-serif text-2xl text-text-secondary mb-3">Nessuna fragranza trovata</p>
                    <p className="text-sm text-text-muted mb-8">Prova a modificare i filtri o la ricerca.</p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 text-xs uppercase tracking-widest border border-copper text-copper hover:bg-copper hover:text-white transition-colors duration-300"
                    >
                        Reset Filtri
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                        {/* Previous */}
                        <Link
                            href={page > 1
                                ? `/explore?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) }).toString()}`
                                : "#"
                            }
                            className={cn(
                                "w-10 h-10 flex items-center justify-center border transition-colors",
                                page > 1
                                    ? "border-border-primary hover:border-copper hover:text-copper"
                                    : "border-border-secondary text-text-muted cursor-not-allowed"
                            )}
                            aria-disabled={page <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 px-2">
                            {generatePageNumbers(page, totalPages).map((p, i) => (
                                p === "..." ? (
                                    <span key={`ellipsis-${i}`} className="px-2 text-text-muted">...</span>
                                ) : (
                                    <Link
                                        key={p}
                                        href={`/explore?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(p) }).toString()}`}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center text-sm font-mono transition-colors",
                                            p === page
                                                ? "bg-text-primary text-text-inverted"
                                                : "hover:bg-bg-secondary"
                                        )}
                                    >
                                        {p}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Next */}
                        <Link
                            href={page < totalPages
                                ? `/explore?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) }).toString()}`
                                : "#"
                            }
                            className={cn(
                                "w-10 h-10 flex items-center justify-center border transition-colors",
                                page < totalPages
                                    ? "border-border-primary hover:border-copper hover:text-copper"
                                    : "border-border-secondary text-text-muted cursor-not-allowed"
                            )}
                            aria-disabled={page >= totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Filter Modal/Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsFilterOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="relative w-full max-w-md h-full bg-bg-primary border-l border-border-primary overflow-hidden shadow-2xl animate-slide-in-right">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-secondary/50">
                            <h2 className="font-serif text-2xl">Filtri</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-bg-tertiary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="h-[calc(100%-140px)] overflow-y-auto p-6 space-y-8">
                            {/* Gender */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Genere</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {GENDER_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                gender: localFilters.gender === option.value ? "" : option.value
                                            })}
                                            className={cn(
                                                "py-3 px-2 border text-center transition-all duration-300",
                                                localFilters.gender === option.value
                                                    ? "border-copper bg-copper/10 text-copper"
                                                    : "border-border-primary hover:border-copper/50"
                                            )}
                                        >
                                            <span className="block text-lg mb-1">{option.emoji}</span>
                                            <span className="text-[10px] uppercase tracking-wider">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-6">Fascia Prezzo</h3>
                                <Slider
                                    min={0}
                                    max={600}
                                    step={10}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="mb-4"
                                />
                                <div className="flex justify-between text-sm font-mono text-text-secondary">
                                    <span>€{priceRange[0]}</span>
                                    <span>€{priceRange[1]}+</span>
                                </div>
                            </div>

                            {/* Brand */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Brand</h3>
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        placeholder="Cerca brand..."
                                        value={searchInFilters.brand}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, brand: e.target.value })}
                                        className="w-full bg-bg-tertiary text-sm p-3 pr-10 border border-border-primary focus:border-copper outline-none transition-colors"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {filteredBrands.map(brand => (
                                        <button
                                            key={brand.id}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                brand: localFilters.brand === brand.id ? "" : brand.id
                                            })}
                                            className={cn(
                                                "flex items-center justify-between w-full text-left px-3 py-2 transition-colors",
                                                localFilters.brand === brand.id
                                                    ? "bg-copper/10 text-copper"
                                                    : "hover:bg-bg-secondary"
                                            )}
                                        >
                                            <span className="text-sm">{brand.name}</span>
                                            {localFilters.brand === brand.id && <Check className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Accord */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Famiglia Olfattiva</h3>
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        placeholder="Cerca accordi..."
                                        value={searchInFilters.accord}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, accord: e.target.value })}
                                        className="w-full bg-bg-tertiary text-sm p-3 pr-10 border border-border-primary focus:border-copper outline-none transition-colors"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {filteredAccords.map(accord => (
                                        <button
                                            key={accord}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                accord: localFilters.accord === accord ? "" : accord
                                            })}
                                            className={cn(
                                                "flex items-center justify-between w-full text-left px-3 py-2 transition-colors",
                                                localFilters.accord === accord
                                                    ? "bg-copper/10 text-copper"
                                                    : "hover:bg-bg-secondary"
                                            )}
                                        >
                                            <span className="text-sm capitalize">{accord}</span>
                                            {localFilters.accord === accord && <Check className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Note</h3>
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        placeholder="Cerca note..."
                                        value={searchInFilters.note}
                                        onChange={(e) => setSearchInFilters({ ...searchInFilters, note: e.target.value })}
                                        className="w-full bg-bg-tertiary text-sm p-3 pr-10 border border-border-primary focus:border-copper outline-none transition-colors"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                </div>
                                <div className="max-h-40 overflow-y-auto space-y-1">
                                    {filteredNotes.map(note => (
                                        <button
                                            key={note}
                                            onClick={() => setLocalFilters({
                                                ...localFilters,
                                                note: localFilters.note === note ? "" : note
                                            })}
                                            className={cn(
                                                "flex items-center justify-between w-full text-left px-3 py-2 transition-colors",
                                                localFilters.note === note
                                                    ? "bg-copper/10 text-copper"
                                                    : "hover:bg-bg-secondary"
                                            )}
                                        >
                                            <span className="text-sm capitalize">{note}</span>
                                            {localFilters.note === note && <Check className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-bg-primary border-t border-border-primary flex gap-3">
                            <button
                                onClick={clearFilters}
                                className="flex-1 py-3 text-xs uppercase tracking-widest border border-border-primary hover:border-text-primary transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                disabled={isPending}
                                className="flex-1 py-3 text-xs uppercase tracking-widest bg-copper text-white hover:bg-copper/90 disabled:opacity-50 transition-colors"
                            >
                                {isPending ? "..." : "Applica Filtri"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Fragrance Card Component
function FragranceCard({ fragrance }: { fragrance: Fragrance }) {
    return (
        <Link
            href={`/fragrance/${fragrance.slug}`}
            className="group block"
        >
            <div className="relative overflow-hidden bg-bg-tertiary aspect-[3/4] mb-4 group/image ring-1 ring-inset ring-white/10 rounded-sm">
                {fragrance.imageUrl ? (
                    <Image
                        src={fragrance.imageUrl}
                        alt={fragrance.name}
                        fill
                        className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-bg-tertiary" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-bg-primary/90 backdrop-blur-sm text-xs font-mono opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    {fragrance.rating.toFixed(1)}
                </div>

                {/* View Arrow */}
                <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-copper text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* New Badge */}
                {fragrance.isNew && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gold text-[10px] font-mono uppercase tracking-wider text-white">
                        New
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-1">
                <h3 className="font-medium leading-tight line-clamp-1 group-hover:text-copper transition-colors duration-300">
                    {fragrance.name}
                </h3>
                <p className="text-sm text-text-muted uppercase tracking-wider line-clamp-1">
                    {fragrance.brand.name}
                </p>
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-text-tertiary">{fragrance.concentration}</span>
                    {fragrance.year && (
                        <>
                            <span className="text-text-muted">·</span>
                            <span className="text-xs text-text-tertiary">{fragrance.year}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}

// Filter Chip Component
function FilterChip({ label, onRemove, className }: { label: string; onRemove: () => void; className?: string }) {
    return (
        <span className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 bg-copper/10 text-xs uppercase tracking-widest border border-copper/20 text-copper",
            className
        )}>
            {label}
            <button onClick={onRemove} className="hover:bg-copper/20 -mr-1 p-0.5 transition-colors">
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

// Generate page numbers with ellipsis
function generatePageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(1);

    if (current > 3) {
        pages.push("...");
    }

    // Pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("...");
    }

    // Always show last page
    if (total > 1) {
        pages.push(total);
    }

    return pages;
}
