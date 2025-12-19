"use client";

import { useState, useMemo } from "react";
import { Wind, Clock, Droplets, TrendingUp, TrendingDown, Minus, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    sillage?: string | number | null;
    longevity?: string | number | null;
    rating?: string | number | null;
    batchCode?: string | null;
    productionDate?: string | null;
    createdAt?: Date | string | null;
}

interface DynamicPerformanceProps {
    reviews: Review[];
    defaultSillage: number;
    defaultLongevity: number;
    defaultPriceValue: number;
}

type TimeFilter = "all" | "recent" | "2024" | "2023" | "older";
type BatchFilter = string | null;

export function DynamicPerformance({
    reviews,
    defaultSillage,
    defaultLongevity,
    defaultPriceValue
}: DynamicPerformanceProps) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
    const [batchFilter, setBatchFilter] = useState<BatchFilter>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Get unique batch codes
    const uniqueBatches = useMemo(() => {
        const batches = reviews
            .filter(r => r.batchCode)
            .map(r => r.batchCode!)
            .filter((v, i, a) => a.indexOf(v) === i);
        return batches.sort();
    }, [reviews]);

    // Filter reviews based on selected filters
    const filteredReviews = useMemo(() => {
        let filtered = [...reviews];

        // Time filter
        if (timeFilter !== "all") {
            const now = new Date();
            filtered = filtered.filter(r => {
                if (!r.createdAt && !r.productionDate) return false;

                const date = r.productionDate
                    ? new Date(r.productionDate + "-01")
                    : new Date(r.createdAt!);

                switch (timeFilter) {
                    case "recent":
                        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
                        return date > sixMonthsAgo;
                    case "2024":
                        return date.getFullYear() === 2024;
                    case "2023":
                        return date.getFullYear() === 2023;
                    case "older":
                        return date.getFullYear() < 2023;
                    default:
                        return true;
                }
            });
        }

        // Batch filter
        if (batchFilter) {
            filtered = filtered.filter(r => r.batchCode === batchFilter);
        }

        return filtered;
    }, [reviews, timeFilter, batchFilter]);

    // Calculate stats from filtered reviews
    const stats = useMemo(() => {
        if (filteredReviews.length === 0) {
            return {
                sillage: defaultSillage,
                longevity: defaultLongevity,
                rating: defaultPriceValue,
                count: 0,
            };
        }

        const sillageReviews = filteredReviews.filter(r => r.sillage);
        const longevityReviews = filteredReviews.filter(r => r.longevity);
        const ratingReviews = filteredReviews.filter(r => r.rating);

        return {
            sillage: sillageReviews.length > 0
                ? sillageReviews.reduce((sum, r) => sum + Number(r.sillage), 0) / sillageReviews.length
                : defaultSillage,
            longevity: longevityReviews.length > 0
                ? longevityReviews.reduce((sum, r) => sum + Number(r.longevity), 0) / longevityReviews.length
                : defaultLongevity,
            rating: ratingReviews.length > 0
                ? ratingReviews.reduce((sum, r) => sum + Number(r.rating), 0) / ratingReviews.length
                : defaultPriceValue,
            count: filteredReviews.length,
        };
    }, [filteredReviews, defaultSillage, defaultLongevity, defaultPriceValue]);

    // Calculate trend (comparing filtered vs all reviews)
    const trends = useMemo(() => {
        if (timeFilter === "all" && !batchFilter) {
            return { sillage: 0, longevity: 0, rating: 0 };
        }

        const allSillage = reviews.filter(r => r.sillage);
        const allLongevity = reviews.filter(r => r.longevity);
        const allRating = reviews.filter(r => r.rating);

        const allAvgSillage = allSillage.length > 0
            ? allSillage.reduce((sum, r) => sum + Number(r.sillage), 0) / allSillage.length
            : defaultSillage;
        const allAvgLongevity = allLongevity.length > 0
            ? allLongevity.reduce((sum, r) => sum + Number(r.longevity), 0) / allLongevity.length
            : defaultLongevity;
        const allAvgRating = allRating.length > 0
            ? allRating.reduce((sum, r) => sum + Number(r.rating), 0) / allRating.length
            : defaultPriceValue;

        return {
            sillage: stats.sillage - allAvgSillage,
            longevity: stats.longevity - allAvgLongevity,
            rating: stats.rating - allAvgRating,
        };
    }, [reviews, stats, timeFilter, batchFilter, defaultSillage, defaultLongevity, defaultPriceValue]);

    const TrendIcon = ({ value }: { value: number }) => {
        if (Math.abs(value) < 0.1) return <Minus className="h-3 w-3 text-text-muted" />;
        if (value > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
        return <TrendingDown className="h-3 w-3 text-red-500" />;
    };

    const hasActiveFilter = timeFilter !== "all" || batchFilter !== null;

    return (
        <div className="mb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-px bg-copper" />
                    <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted">
                        Performance
                        {hasActiveFilter && (
                            <span className="ml-2 text-copper">• Filtrato</span>
                        )}
                    </h3>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "flex items-center gap-2 text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors cursor-pointer",
                        showFilters || hasActiveFilter
                            ? "border-copper text-copper"
                            : "border-border-primary text-text-muted hover:text-text-primary"
                    )}
                >
                    <Filter className="h-3 w-3" />
                    Filtri
                    {hasActiveFilter && (
                        <span className="w-4 h-4 flex items-center justify-center bg-copper text-white text-[10px]">
                            {(timeFilter !== "all" ? 1 : 0) + (batchFilter ? 1 : 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 bg-bg-secondary border border-border-primary">
                    <div className="flex flex-wrap gap-6">
                        {/* Time Filter */}
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                                Periodo
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "all", label: "Tutti" },
                                    { value: "recent", label: "Ultimi 6 mesi" },
                                    { value: "2024", label: "2024" },
                                    { value: "2023", label: "2023" },
                                    { value: "older", label: "Prima 2023" },
                                ].map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setTimeFilter(value as TimeFilter)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs transition-colors cursor-pointer",
                                            timeFilter === value
                                                ? "bg-copper text-white"
                                                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Batch Filter */}
                        {uniqueBatches.length > 0 && (
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                                    Batch Code
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setBatchFilter(null)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs transition-colors cursor-pointer",
                                            batchFilter === null
                                                ? "bg-gold text-white"
                                                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                        )}
                                    >
                                        Tutti
                                    </button>
                                    {uniqueBatches.map((batch) => (
                                        <button
                                            key={batch}
                                            onClick={() => setBatchFilter(batch)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer",
                                                batchFilter === batch
                                                    ? "bg-gold text-white"
                                                    : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
                                            )}
                                        >
                                            {batch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilter && (
                        <button
                            onClick={() => {
                                setTimeFilter("all");
                                setBatchFilter(null);
                            }}
                            className="mt-4 flex items-center gap-2 text-xs text-text-muted hover:text-copper transition-colors cursor-pointer"
                        >
                            <X className="h-3 w-3" />
                            Rimuovi filtri
                        </button>
                    )}
                </div>
            )}

            {/* Stats Count */}
            {hasActiveFilter && (
                <p className="text-xs text-text-muted mb-4">
                    Basato su <span className="text-copper font-medium">{stats.count}</span> recensioni
                    {batchFilter && <span> del batch <span className="font-mono">{batchFilter}</span></span>}
                </p>
            )}

            {/* Performance Cards */}
            <div className="grid grid-cols-3 gap-4">
                {/* Sillage */}
                <div className="p-5 border border-border-primary text-center relative">
                    <Wind className="h-5 w-5 mx-auto mb-3 text-copper" />
                    <span className="block text-3xl font-serif text-copper">
                        {stats.sillage.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Sillage</span>

                    {/* Trend indicator */}
                    {hasActiveFilter && Math.abs(trends.sillage) >= 0.1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                            <TrendIcon value={trends.sillage} />
                            <span className={cn(
                                "text-[10px] font-mono",
                                trends.sillage > 0 ? "text-green-500" : "text-red-500"
                            )}>
                                {trends.sillage > 0 ? "+" : ""}{trends.sillage.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Longevity */}
                <div className="p-5 border border-border-primary text-center relative">
                    <Clock className="h-5 w-5 mx-auto mb-3 text-gold" />
                    <span className="block text-3xl font-serif text-gold">
                        {stats.longevity.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Longevity</span>

                    {hasActiveFilter && Math.abs(trends.longevity) >= 0.1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                            <TrendIcon value={trends.longevity} />
                            <span className={cn(
                                "text-[10px] font-mono",
                                trends.longevity > 0 ? "text-green-500" : "text-red-500"
                            )}>
                                {trends.longevity > 0 ? "+" : ""}{trends.longevity.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Rating/Value */}
                <div className="p-5 border border-border-primary text-center relative">
                    <Droplets className="h-5 w-5 mx-auto mb-3 text-rose-gold" />
                    <span className="block text-3xl font-serif text-rose-gold">
                        {stats.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Rating</span>

                    {hasActiveFilter && Math.abs(trends.rating) >= 0.1 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                            <TrendIcon value={trends.rating} />
                            <span className={cn(
                                "text-[10px] font-mono",
                                trends.rating > 0 ? "text-green-500" : "text-red-500"
                            )}>
                                {trends.rating > 0 ? "+" : ""}{trends.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Reformulation Notice */}
            {hasActiveFilter && (Math.abs(trends.sillage) >= 0.5 || Math.abs(trends.longevity) >= 0.5) && (
                <div className="mt-4 p-3 bg-bg-tertiary border border-border-primary text-sm">
                    {trends.sillage < -0.5 || trends.longevity < -0.5 ? (
                        <p className="text-text-secondary">
                            ⚠️ <span className="text-text-primary">Possibile riformulazione:</span> Le performance in questo periodo
                            sono significativamente diverse dalla media generale.
                        </p>
                    ) : (
                        <p className="text-text-secondary">
                            ✨ <span className="text-text-primary">Batch performante:</span> Questo periodo/batch mostra
                            performance superiori alla media.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
