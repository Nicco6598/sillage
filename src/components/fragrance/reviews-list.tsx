"use client";

import { useState, useMemo } from "react";

import { Star, ArrowRight, Filter, Calendar, BadgeCheck } from "lucide-react";
import { ReviewAction } from "./review-action";

interface ReviewsListProps {
    initialReviews: any[]; // Using any because DB type might differ slightly from strict type, but should match structure
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
}

type SortOption = "newest" | "production_oldest" | "production_newest";

export function ReviewsList({ initialReviews, fragranceId, fragranceSlug, fragranceName }: ReviewsListProps) {
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [onlyWithBatch, setOnlyWithBatch] = useState(false);

    // Filter and Sort Logic
    const filteredReviews = useMemo(() => {
        let result = [...initialReviews];

        // 1. Filter
        if (onlyWithBatch) {
            result = result.filter(r => r.batchCode || r.productionDate);
        }

        // 2. Sort
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "production_oldest") {
                if (!a.productionDate) return 1;
                if (!b.productionDate) return -1;
                return a.productionDate.localeCompare(b.productionDate);
            }
            if (sortBy === "production_newest") {
                if (!a.productionDate) return 1;
                if (!b.productionDate) return -1;
                return b.productionDate.localeCompare(a.productionDate);
            }
            return 0;
        });

        return result;
    }, [initialReviews, sortBy, onlyWithBatch]);

    return (
        <div className="mt-24 border-t border-border-primary pt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h2 className="font-serif text-4xl mb-4">Recensioni ({filteredReviews.length})</h2>
                    <p className="text-text-secondary max-w-lg">
                        Scopri cosa ne pensa la community e analizza come varia la fragranza nel tempo.
                    </p>
                </div>
                <ReviewAction
                    fragranceId={fragranceId}
                    fragranceSlug={fragranceSlug}
                    fragranceName={fragranceName}
                />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-6 mb-8 p-4 bg-bg-secondary border border-border-primary">
                <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-text-muted">
                    <Filter className="h-4 w-4" /> Filtra:
                </div>

                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 border transition-colors select-none ${onlyWithBatch ? 'border-copper text-copper bg-copper/5' : 'border-border-primary hover:border-text-primary'}`}>
                    <input
                        type="checkbox"
                        checked={onlyWithBatch}
                        onChange={(e) => setOnlyWithBatch(e.target.checked)}
                        className="sr-only"
                    />
                    <span className="text-sm uppercase tracking-widest font-medium">Solo con Batch/Data</span>
                </label>

                <div className="h-4 w-[1px] bg-border-primary mx-2 hidden md:block" />

                <div className="flex items-center gap-2">
                    <span className="text-sm text-text-muted hidden md:inline">Ordina per:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-transparent text-sm border-b border-border-primary pb-1 outline-none focus:border-copper transition-colors cursor-pointer"
                    >
                        <option value="newest">Più recenti</option>
                        <option value="production_newest">Produzione (Nuovi → Vecchi)</option>
                        <option value="production_oldest">Produzione (Vecchi → Nuovi)</option>
                    </select>
                </div>
            </div>

            {filteredReviews.length === 0 ? (
                <div className="text-center py-12 bg-bg-secondary border border-border-primary">
                    <p className="text-text-secondary mb-4">Nessuna recensione trovata con questi filtri.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="border-b border-border-primary py-10 last:border-0 animation-fade-in group">
                            {/* Header: User & Rating */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-xl font-serif text-text-primary border border-border-primary">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg text-text-primary">{review.userName}</p>
                                        <p className="text-xs text-text-muted font-mono uppercase tracking-wider mt-1">
                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Rating Box */}
                                <div className="flex flex-col items-end">
                                    <span className="font-serif italic font-bold text-3xl text-copper leading-none">
                                        {Number(review.rating || 0).toFixed(2)}
                                    </span>
                                    <div className="flex gap-0.5 mt-1 text-copper/80">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i <= (review.rating || 0) ? "fill-current" : "text-border-primary fill-transparent"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Comment */}
                            {review.comment && (
                                <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-3xl">
                                    {review.comment}
                                </p>
                            )}

                            {/* Footer: Tech & Sensory Specs */}
                            <div className="flex flex-col xl:flex-row gap-6 xl:items-center justify-between bg-bg-secondary/50 p-5 rounded-sm border border-border-primary/50">

                                {/* Left: Sensory Profile (Sillage, Longevity, Season) */}
                                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                                    {/* Sillage & Longevity */}
                                    {(review.sillage || review.longevity) && (
                                        <div className="flex gap-8">
                                            {review.sillage && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] uppercase tracking-widest text-text-muted">Sillage</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-sm">{review.sillage}</span>
                                                        <div className="w-16 h-1.5 bg-border-primary/50 overflow-hidden">
                                                            <div className="h-full bg-text-secondary" style={{ width: `${(review.sillage / 5) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {review.longevity && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[10px] uppercase tracking-widest text-text-muted">Longevità</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-medium text-sm">{review.longevity}</span>
                                                        <div className="w-16 h-1.5 bg-border-primary/50 overflow-hidden">
                                                            <div className="h-full bg-text-secondary" style={{ width: `${(review.longevity / 5) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="w-[1px] h-8 bg-border-primary hidden sm:block" />

                                    {/* Seasons & Gender */}
                                    <div className="flex items-center gap-4">
                                        {review.seasonVote && (
                                            <div className="flex gap-2">
                                                {review.seasonVote.split(',').map((s: string) => {
                                                    const map: any = {
                                                        spring: { icon: "🌸", label: "Primavera" },
                                                        summer: { icon: "☀️", label: "Estate" },
                                                        autumn: { icon: "🍂", label: "Autunno" },
                                                        winter: { icon: "❄️", label: "Inverno" }
                                                    };
                                                    const info = map[s.trim()];
                                                    if (!info) return null;
                                                    return (
                                                        <div key={s} title={info.label} className="w-8 h-8 flex items-center justify-center bg-bg-primary border border-border-primary rounded-sm text-sm hover:scale-110 transition-transform cursor-help">
                                                            {info.icon}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {review.genderVote && (
                                            <span className="text-xs font-medium px-3 py-1 bg-bg-primary border border-border-primary rounded-sm capitalize text-text-secondary">
                                                {review.genderVote}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Technical Data (Batch) */}
                                {(review.batchCode || review.productionDate) && (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 xl:border-l xl:border-border-primary xl:pl-6">
                                        {review.batchCode && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest text-text-muted">Batch</span>
                                                <span className="font-mono text-xs font-medium text-gold bg-bg-primary px-2 py-1 border border-border-primary rounded-sm flex items-center gap-1.5">
                                                    {review.batchCode}
                                                    <BadgeCheck className="h-3 w-3 fill-gold text-bg-primary" />
                                                </span>
                                            </div>
                                        )}

                                        {review.productionDate && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest text-text-muted">Prod.</span>
                                                <span className="font-mono text-xs font-medium text-rose-gold bg-bg-primary px-2 py-1 border border-border-primary rounded-sm flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {review.productionDate}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More (Visual only for now since we have limited mock data/pagination logic) */}
            {initialReviews.length > 0 && (
                <div className="mt-12 text-center">
                    <button className="group flex items-center gap-4 text-sm uppercase tracking-widest border-b border-text-primary pb-1 hover:text-text-secondary transition-colors mx-auto cursor-pointer">
                        Carica altre recensioni
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            )}
        </div>
    );
}
