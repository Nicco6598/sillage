"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import {
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    X,
    Search,
    Sparkles,
    Check,
    ArrowUpDown,
    Loader2,
} from "lucide-react";
import { FragranceCardCompact } from "@/components/fragrance/fragrance-card";
import { SearchBar } from "@/components/ui/search-bar";
import type { Fragrance, Season, Occasion } from "@/types/fragrance";
import { cn } from "@/lib/utils";

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
    { value: "masculine", label: "Maschili", icon: "♂️" },
    { value: "feminine", label: "Femminili", icon: "♀️" },
    { value: "unisex", label: "Unisex", icon: "⚥" },
];

const SEASON_OPTIONS: { value: Season; label: string; icon: string }[] = [
    { value: "spring", label: "Primavera", icon: "🌸" },
    { value: "summer", label: "Estate", icon: "☀️" },
    { value: "autumn", label: "Autunno", icon: "🍂" },
    { value: "winter", label: "Inverno", icon: "❄️" },
];

const OCCASION_OPTIONS: { value: Occasion; label: string; icon: string }[] = [
    { value: "daily", label: "Quotidiano", icon: "📅" },
    { value: "business", label: "Business", icon: "💼" },
    { value: "evening", label: "Serata", icon: "🌙" },
    { value: "night", label: "Notte", icon: "✨" },
    { value: "leisure", label: "Tempo libero", icon: "🎉" },
    { value: "sport", label: "Sport", icon: "🏃" },
];

const SORT_OPTIONS = [
    { value: "rating", label: "Valutazione" },
    { value: "popularity", label: "Popolarità" },
    { value: "newest", label: "Più recenti" },
    { value: "name", label: "Nome" },
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
    const [searchInFilters, setSearchInFilters] = useState({
        brand: "",
        note: "",
        accord: "",
    });

    const totalPages = Math.ceil(total / limit);

    // Build URL with filters
    const buildUrl = useCallback((overrides: Record<string, string | null> = {}) => {
        const params = new URLSearchParams();

        // Preserve query
        if (query) params.set("q", query);

        // Merge current params with overrides
        const currentParams = Object.fromEntries(searchParams.entries());
        const merged = { ...currentParams, ...overrides };

        Object.entries(merged).forEach(([key, value]) => {
            if (value && key !== "q") {
                params.set(key, value);
            }
        });

        return `/explore?${params.toString()}`;
    }, [query, searchParams]);

    // Apply filters
    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (localFilters.gender) params.set("gender", localFilters.gender);
        if (localFilters.brand) params.set("brand", localFilters.brand);
        if (localFilters.note) params.set("note", localFilters.note);
        if (localFilters.accord) params.set("accord", localFilters.accord);
        params.set("page", "1");

        startTransition(() => {
            router.push(`/explore?${params.toString()}`);
        });
        setIsFilterOpen(false);
    }, [localFilters, query, router]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setLocalFilters({ gender: "", brand: "", note: "", accord: "" });
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
    ).slice(0, 20);

    const filteredNotes = filterOptions.notes.filter(n =>
        n.toLowerCase().includes(searchInFilters.note.toLowerCase())
    ).slice(0, 30);

    const filteredAccords = filterOptions.accords.filter(a =>
        a.toLowerCase().includes(searchInFilters.accord.toLowerCase())
    ).slice(0, 20);

    return (
        <div className="space-y-5">
            {/* Top Bar: Search + Filters + Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <SearchBar
                    placeholder="Cerca tra le fragranze..."
                    className="max-w-md"
                />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={cn(
                            "relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                            activeFilterCount > 0
                                ? "border-accent bg-accent/10 text-accent hover:bg-accent/20"
                                : "border-border-primary bg-bg-secondary text-text-secondary hover:border-accent/50 hover:text-accent"
                        )}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filtri</span>
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams);
                                params.set("sortBy", e.target.value);
                                params.set("page", "1");
                                router.push(`/explore?${params.toString()}`);
                            }}
                            defaultValue={searchParams.get("sortBy") ?? "rating"}
                            className="h-10 appearance-none rounded-xl border border-border-primary bg-bg-secondary pl-4 pr-10 text-sm text-text-secondary transition-all hover:border-accent/50 focus:border-accent focus:outline-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    </div>
                </div>
            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 animate-fade-in">
                    <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                        Filtri attivi:
                    </span>
                    {currentFilters.gender && (
                        <FilterChip
                            label={GENDER_OPTIONS.find(g => g.value === currentFilters.gender)?.label ?? currentFilters.gender}
                            onRemove={() => removeFilter("gender")}
                        />
                    )}
                    {currentFilters.brand && (
                        <FilterChip
                            label={currentFilters.brand}
                            onRemove={() => removeFilter("brand")}
                        />
                    )}
                    {currentFilters.note && (
                        <FilterChip
                            label={currentFilters.note}
                            onRemove={() => removeFilter("note")}
                        />
                    )}
                    {currentFilters.accord && (
                        <FilterChip
                            label={currentFilters.accord}
                            onRemove={() => removeFilter("accord")}
                        />
                    )}
                    <button
                        onClick={clearFilters}
                        className="text-xs font-medium text-error hover:underline"
                    >
                        Rimuovi tutti
                    </button>
                </div>
            )}

            {/* Quick Gender Filters */}
            <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((gender) => {
                    const isActive = currentFilters.gender === gender.value;
                    return (
                        <Link
                            key={gender.value}
                            href={buildUrl({ gender: isActive ? null : gender.value, page: "1" })}
                            className={cn(
                                "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                isActive
                                    ? "border-accent bg-accent text-white shadow-md shadow-accent/20"
                                    : "border-border-primary bg-bg-secondary text-text-secondary hover:border-accent hover:text-accent"
                            )}
                        >
                            <span>{gender.icon}</span>
                            <span>{gender.label}</span>
                            {isActive && <Check className="h-3.5 w-3.5" />}
                        </Link>
                    );
                })}
            </div>

            {/* Loading Overlay */}
            {isPending && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-2xl bg-bg-secondary px-6 py-4 shadow-xl">
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        <span className="text-sm font-medium text-text-primary">Caricamento...</span>
                    </div>
                </div>
            )}

            {/* Results Grid - Compact 6-column layout */}
            {fragrances.length > 0 ? (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {fragrances.map((fragrance) => (
                        <FragranceCardCompact key={fragrance.id} fragrance={fragrance} />
                    ))}
                </div>
            ) : (
                <EmptyState query={query} onClearFilters={clearFilters} hasFilters={activeFilterCount > 0} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    buildPageUrl={(p) => buildUrl({ page: String(p) })}
                />
            )}

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                localFilters={localFilters}
                setLocalFilters={setLocalFilters}
                searchInFilters={searchInFilters}
                setSearchInFilters={setSearchInFilters}
                filteredBrands={filteredBrands}
                filteredNotes={filteredNotes}
                filteredAccords={filteredAccords}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
            />
        </div>
    );
}

// Filter Chip Component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
            {label}
            <button
                onClick={onRemove}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 transition-colors hover:bg-accent/40"
            >
                <X className="h-2.5 w-2.5" />
            </button>
        </span>
    );
}

// Empty State Component
function EmptyState({
    query,
    onClearFilters,
    hasFilters
}: {
    query: string;
    onClearFilters: () => void;
    hasFilters: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                <Sparkles className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary">
                Nessuna fragranza trovata
            </h3>
            <p className="mt-2 max-w-md text-text-muted">
                {query
                    ? `Non abbiamo trovato fragranze per "${query}". Prova con altri termini di ricerca.`
                    : "Prova a modificare i filtri o effettua una nuova ricerca."}
            </p>
            {hasFilters && (
                <button
                    onClick={onClearFilters}
                    className="mt-6 rounded-xl bg-accent px-6 py-3 font-medium text-white transition-all hover:bg-accent-hover"
                >
                    Rimuovi tutti i filtri
                </button>
            )}
        </div>
    );
}

// Pagination Component
function Pagination({
    page,
    totalPages,
    buildPageUrl,
}: {
    page: number;
    totalPages: number;
    buildPageUrl: (page: number) => string;
}) {
    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 pt-8">
            <Link
                href={buildPageUrl(page - 1)}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    page <= 1
                        ? "pointer-events-none border-border-primary bg-bg-tertiary text-text-muted opacity-50"
                        : "border-border-primary bg-bg-secondary text-text-secondary hover:border-accent hover:text-accent"
                )}
                aria-disabled={page <= 1}
            >
                <ChevronLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) =>
                    pageNum === "..." ? (
                        <span
                            key={`dots-${idx}`}
                            className="flex h-10 w-10 items-center justify-center text-text-muted"
                        >
                            ...
                        </span>
                    ) : (
                        <Link
                            key={pageNum}
                            href={buildPageUrl(pageNum)}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-all",
                                page === pageNum
                                    ? "border-accent bg-accent text-white"
                                    : "border-border-primary bg-bg-secondary text-text-secondary hover:border-accent hover:text-accent"
                            )}
                        >
                            {pageNum}
                        </Link>
                    )
                )}
            </div>

            <Link
                href={buildPageUrl(page + 1)}
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                    page >= totalPages
                        ? "pointer-events-none border-border-primary bg-bg-tertiary text-text-muted opacity-50"
                        : "border-border-primary bg-bg-secondary text-text-secondary hover:border-accent hover:text-accent"
                )}
                aria-disabled={page >= totalPages}
            >
                <ChevronRight className="h-5 w-5" />
            </Link>
        </div>
    );
}

// Filter Modal Component
function FilterModal({
    isOpen,
    onClose,
    localFilters,
    setLocalFilters,
    searchInFilters,
    setSearchInFilters,
    filteredBrands,
    filteredNotes,
    filteredAccords,
    applyFilters,
    clearFilters,
}: {
    isOpen: boolean;
    onClose: () => void;
    localFilters: { gender: string; brand: string; note: string; accord: string };
    setLocalFilters: (filters: { gender: string; brand: string; note: string; accord: string }) => void;
    searchInFilters: { brand: string; note: string; accord: string };
    setSearchInFilters: (search: { brand: string; note: string; accord: string }) => void;
    filteredBrands: { id: string; name: string; count: number }[];
    filteredNotes: string[];
    filteredAccords: string[];
    applyFilters: () => void;
    clearFilters: () => void;
}) {
    const [activeTab, setActiveTab] = useState<"gender" | "brand" | "note" | "accord" | "season" | "occasion">("gender");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-t-3xl sm:rounded-3xl bg-bg-secondary shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-primary bg-bg-secondary/95 backdrop-blur-md px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Filtri Avanzati</h2>
                        <p className="text-sm text-text-muted">Affina la tua ricerca</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary text-text-muted transition-colors hover:text-text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-border-primary overflow-x-auto scrollbar-hide">
                    <div className="flex gap-1 px-4 py-2">
                        {[
                            { id: "gender", label: "Genere", icon: "👤" },
                            { id: "brand", label: "Brand", icon: "🏷️" },
                            { id: "note", label: "Note", icon: "🌸" },
                            { id: "accord", label: "Accordi", icon: "🎨" },
                            { id: "season", label: "Stagione", icon: "🌤️" },
                            { id: "occasion", label: "Occasione", icon: "✨" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={cn(
                                    "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === tab.id
                                        ? "bg-accent text-white"
                                        : "text-text-secondary hover:bg-bg-tertiary"
                                )}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
                    {/* Gender Tab */}
                    {activeTab === "gender" && (
                        <div className="grid grid-cols-3 gap-3">
                            {GENDER_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setLocalFilters({
                                        ...localFilters,
                                        gender: localFilters.gender === option.value ? "" : option.value
                                    })}
                                    className={cn(
                                        "flex flex-col items-center gap-2 rounded-2xl border-2 p-6 transition-all",
                                        localFilters.gender === option.value
                                            ? "border-accent bg-accent/10 text-accent"
                                            : "border-border-primary hover:border-accent/50"
                                    )}
                                >
                                    <span className="text-3xl">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Brand Tab */}
                    {activeTab === "brand" && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Cerca brand..."
                                    value={searchInFilters.brand}
                                    onChange={(e) => setSearchInFilters({ ...searchInFilters, brand: e.target.value })}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {filteredBrands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        onClick={() => setLocalFilters({
                                            ...localFilters,
                                            brand: localFilters.brand === brand.id ? "" : brand.id
                                        })}
                                        className={cn(
                                            "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                                            localFilters.brand === brand.id
                                                ? "border-accent bg-accent/10 text-accent"
                                                : "border-border-primary hover:border-accent/50"
                                        )}
                                    >
                                        <span className="truncate font-medium">{brand.name}</span>
                                        <span className="ml-2 text-xs text-text-muted">{brand.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Note Tab */}
                    {activeTab === "note" && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Cerca note..."
                                    value={searchInFilters.note}
                                    onChange={(e) => setSearchInFilters({ ...searchInFilters, note: e.target.value })}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filteredNotes.map((note) => (
                                    <button
                                        key={note}
                                        onClick={() => setLocalFilters({
                                            ...localFilters,
                                            note: localFilters.note === note ? "" : note
                                        })}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                            localFilters.note === note
                                                ? "border-accent bg-accent text-white"
                                                : "border-border-primary hover:border-accent hover:text-accent"
                                        )}
                                    >
                                        {note}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Accord Tab */}
                    {activeTab === "accord" && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Cerca accordi..."
                                    value={searchInFilters.accord}
                                    onChange={(e) => setSearchInFilters({ ...searchInFilters, accord: e.target.value })}
                                    className="w-full rounded-xl border border-border-primary bg-bg-tertiary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filteredAccords.map((accord) => (
                                    <button
                                        key={accord}
                                        onClick={() => setLocalFilters({
                                            ...localFilters,
                                            accord: localFilters.accord === accord ? "" : accord
                                        })}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                            localFilters.accord === accord
                                                ? "border-accent bg-accent text-white"
                                                : "border-border-primary hover:border-accent hover:text-accent"
                                        )}
                                    >
                                        {accord}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Season Tab */}
                    {activeTab === "season" && (
                        <div className="grid grid-cols-2 gap-3">
                            {SEASON_OPTIONS.map((season) => (
                                <button
                                    key={season.value}
                                    className="flex items-center gap-3 rounded-2xl border-2 border-border-primary p-5 transition-all hover:border-accent/50"
                                >
                                    <span className="text-2xl">{season.icon}</span>
                                    <span className="font-medium text-text-primary">{season.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Occasion Tab */}
                    {activeTab === "occasion" && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {OCCASION_OPTIONS.map((occasion) => (
                                <button
                                    key={occasion.value}
                                    className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border-primary p-5 transition-all hover:border-accent/50"
                                >
                                    <span className="text-2xl">{occasion.icon}</span>
                                    <span className="font-medium text-text-primary">{occasion.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-border-primary bg-bg-secondary/95 backdrop-blur-md px-6 py-4">
                    <button
                        onClick={clearFilters}
                        className="text-sm font-medium text-text-muted hover:text-error transition-colors"
                    >
                        Resetta tutto
                    </button>
                    <button
                        onClick={applyFilters}
                        className="rounded-xl bg-accent px-8 py-3 font-semibold text-white transition-all hover:bg-accent-hover active:scale-95"
                    >
                        Applica Filtri
                    </button>
                </div>
            </div>
        </div>
    );
}
