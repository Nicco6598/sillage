"use client";

import { useState, useMemo } from "react";
import { Clock, Wind, User, Filter, X } from "lucide-react";
import { Season } from "@/types/fragrance";

interface Review {
    productionDate?: string | null;
    longevity?: string | number | null;
    sillage?: string | number | null;
    genderVote?: string | null;
    seasonVote?: string | null;
}

interface CommunityStatsProps {
    fragrance: {
        longevity: number;
        sillage: number;
        gender: "masculine" | "feminine" | "unisex";
        seasons: Season[];
    };
    allReviews: Review[]; // Containing detailed votes
}

export function CommunityStats({ fragrance, allReviews }: CommunityStatsProps) {
    const [selectedYears, setSelectedYears] = useState<number[]>([]);

    // 1. Extract all available years
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        allReviews.forEach(r => {
            if (r.productionDate) {
                const year = parseInt(r.productionDate.split('-')[0]);
                if (!isNaN(year)) years.add(year);
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [allReviews]);

    // 2. Toggle Year Selection
    const toggleYear = (year: number) => {
        if (selectedYears.includes(year)) {
            setSelectedYears(selectedYears.filter(y => y !== year));
        } else {
            setSelectedYears([...selectedYears, year]);
        }
    };

    // 3. Calculate Stats dynamically
    const stats = useMemo(() => {
        // Source data: either filtered by year or ALL reviews
        const sourceData = selectedYears.length > 0
            ? allReviews.filter(r => {
                if (!r.productionDate) return false;
                const y = parseInt(r.productionDate.split('-')[0]);
                return selectedYears.includes(y);
            })
            : allReviews;

        if (sourceData.length === 0) return null;

        // Calc Averages
        const longevitySum = sourceData.reduce((acc, r) => acc + Number(r.longevity || 0), 0);
        const longevityCount = sourceData.filter(r => Number(r.longevity) > 0).length;
        const avgLongevity = longevityCount ? longevitySum / longevityCount : 0;

        const sillageSum = sourceData.reduce((acc, r) => acc + Number(r.sillage || 0), 0);
        const sillageCount = sourceData.filter(r => Number(r.sillage) > 0).length;
        const avgSillage = sillageCount ? sillageSum / sillageCount : 0;

        // Gender Mode
        const genderCounts = { masculine: 0, feminine: 0, unisex: 0 };
        sourceData.forEach(r => {
            if (r.genderVote) {
                const g = r.genderVote as keyof typeof genderCounts;
                if (genderCounts[g] !== undefined) genderCounts[g]++;
            }
        });

        // Find dominant gender
        let maxGender = "unisex";
        let maxCount = -1;
        Object.entries(genderCounts).forEach(([g, c]) => {
            if (c > maxCount) {
                maxCount = c;
                maxGender = g;
            }
        });

        // Seasons Percentages
        const seasonCounts: Record<string, number> = {
            spring: 0, summer: 0, autumn: 0, winter: 0
        };
        let totalSeasonVotes = 0;

        sourceData.forEach(r => {
            if (r.seasonVote) {
                r.seasonVote.split(',').forEach((s: string) => {
                    const season = s.trim();
                    if (seasonCounts[season] !== undefined) {
                        seasonCounts[season]++;
                        totalSeasonVotes++;
                    }
                });
            }
        });

        const seasonPercentages: Record<string, number> = {};
        Object.keys(seasonCounts).forEach(s => {
            seasonPercentages[s] = totalSeasonVotes ? (seasonCounts[s] / totalSeasonVotes) * 100 : 0;
        });

        return {
            longevity: avgLongevity || fragrance.longevity,
            sillage: avgSillage || fragrance.sillage,
            gender: maxGender as "masculine" | "feminine" | "unisex",
            seasonPercentages,
            count: sourceData.length,
            isFiltered: selectedYears.length > 0
        };

    }, [selectedYears, allReviews, fragrance]);

    return (
        <div className="bg-bg-secondary p-8 border border-border-primary rounded-sm mt-12 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-border-primary pb-6">
                <div>
                    <h3 className="font-serif text-3xl mb-2">Statistiche Community</h3>
                    <p className="text-text-secondary text-sm">
                        Analisi basata su {stats ? stats.count : 0} valutazioni.
                    </p>
                </div>

                {/* Batch/Year Filter */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-text-muted flex items-center gap-2 mr-2">
                        <Filter className="h-3 w-3" /> Filter:
                    </span>
                    {availableYears.length > 0 ? (
                        availableYears.map(year => (
                            <button
                                key={year}
                                onClick={() => toggleYear(year)}
                                className={`px-3 py-1 text-xs font-mono border rounded-sm transition-all ${selectedYears.includes(year)
                                    ? "bg-copper text-bg-primary border-copper"
                                    : "bg-bg-primary border-border-primary hover:border-text-muted text-text-muted"
                                    }`}
                            >
                                {year}
                            </button>
                        ))
                    ) : (
                        <span className="text-[10px] text-text-muted italic">Nessun dato batch</span>
                    )}
                    {selectedYears.length > 0 && (
                        <button
                            onClick={() => setSelectedYears([])}
                            className="p-1 hover:bg-border-primary rounded-full transition-colors text-text-muted ml-2"
                            title="Reset filters"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {!stats ? (
                <div className="py-12 text-center text-text-muted text-sm border border-dashed border-border-primary bg-bg-primary/50">
                    Nessun dato disponibile per i filtri selezionati.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animation-fade-in">

                    {/* LEFT COLUMN: Performance */}
                    <div className="space-y-8">
                        {/* Info Banner */}
                        {stats.isFiltered && (
                            <div className="bg-copper/5 border border-copper/20 p-3 rounded-sm text-center text-xs text-copper mb-6 font-medium">
                                Visualizzando statistiche per batch: <span className="font-mono">{selectedYears.join(", ")}</span>
                            </div>
                        )}

                        {/* Longevity */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs uppercase tracking-widest text-text-secondary flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Longevità
                                </span>
                                <span className="font-mono text-lg font-medium text-gold">{stats.longevity.toFixed(1)}<span className="text-xs text-text-muted">/5</span></span>
                            </div>
                            <div className="h-2 bg-border-primary/50 w-full overflow-hidden rounded-sm">
                                <div
                                    className="h-full bg-gold transition-all duration-1000"
                                    style={{ width: `${(stats.longevity / 5) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-text-muted mt-1.5 uppercase tracking-wider">
                                <span>Debole</span>
                                <span>Moderata</span>
                                <span>Eterna</span>
                            </div>
                        </div>

                        {/* Sillage */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs uppercase tracking-widest text-text-secondary flex items-center gap-2">
                                    <Wind className="h-4 w-4" /> Sillage
                                </span>
                                <span className="font-mono text-lg font-medium text-copper">{stats.sillage.toFixed(1)}<span className="text-xs text-text-muted">/5</span></span>
                            </div>
                            <div className="h-2 bg-border-primary/50 w-full overflow-hidden rounded-sm">
                                <div
                                    className="h-full bg-copper transition-all duration-1000"
                                    style={{ width: `${(stats.sillage / 5) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-text-muted mt-1.5 uppercase tracking-wider">
                                <span>Intimo</span>
                                <span>Moderato</span>
                                <span>Enorme</span>
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs uppercase tracking-widest text-text-secondary flex items-center gap-2">
                                    <User className="h-4 w-4" /> Genere
                                </span>
                                <span className="capitalize font-mono text-sm">{stats.gender}</span>
                            </div>
                            <div className="h-2 bg-border-primary/50 w-full overflow-hidden relative rounded-sm">
                                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-bg-secondary z-10 -ml-[1px]" />
                                <div
                                    className="h-full bg-text-secondary transition-all duration-1000"
                                    style={{
                                        width: stats.gender === "masculine" ? "90%" :
                                            stats.gender === "feminine" ? "10%" : "50%"
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-text-muted mt-1.5 uppercase tracking-wider">
                                <span>Femminile</span>
                                <span>Maschile</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Seasons */}
                    <div>
                        <div className="mb-6">
                            <h4 className="font-serif text-xl mb-2">Stagionalità</h4>
                            <p className="text-xs text-text-muted">Preferenze d&apos;uso della community</p>
                        </div>

                        <div className="space-y-5">
                            {[
                                { season: "spring", label: "Primavera", icon: "🌸", color: "text-rose-gold", bar: "bg-rose-gold" },
                                { season: "summer", label: "Estate", icon: "☀️", color: "text-gold", bar: "bg-gold" },
                                { season: "autumn", label: "Autunno", icon: "🍂", color: "text-copper", bar: "bg-copper" },
                                { season: "winter", label: "Inverno", icon: "❄️", color: "text-text-secondary", bar: "bg-text-secondary" },
                            ].map(({ season, label, icon, color, bar }) => {
                                const percent = stats.seasonPercentages[season] || 0;
                                return (
                                    <div key={season} className="group">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl w-6 text-center">{icon}</span>
                                                <span className="text-xs uppercase tracking-widest text-text-secondary font-medium">{label}</span>
                                            </div>
                                            <span className={`font-mono text-xs font-bold ${color}`}>{Math.round(percent)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-border-primary/50 w-full overflow-hidden rounded-sm">
                                            <div
                                                className={`h-full transition-all duration-1000 ease-out ${bar}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
