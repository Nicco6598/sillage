"use client";

import { useMemo } from "react";

interface Review {
    id: string;
    seasonVote?: string | null;
}

interface SeasonVotesProps {
    reviews: Review[];
}

const SEASONS = [
    { key: "spring", label: "Primavera", icon: "🌸", color: "bg-green-500" },
    { key: "summer", label: "Estate", icon: "☀️", color: "bg-amber-500" },
    { key: "autumn", label: "Autunno", icon: "🍂", color: "bg-orange-900" },
    { key: "winter", label: "Inverno", icon: "❄️", color: "bg-blue-500" },
];

export function SeasonVotes({ reviews }: SeasonVotesProps) {
    const seasonCounts = useMemo(() => {
        const counts: Record<string, number> = {
            spring: 0,
            summer: 0,
            autumn: 0,
            winter: 0,
        };

        // Count votes from reviews (seasonVote can be comma-separated like "summer,autumn")
        reviews.forEach(review => {
            if (review.seasonVote) {
                const seasons = review.seasonVote.toLowerCase().split(",").map(s => s.trim());
                seasons.forEach(season => {
                    if (counts[season] !== undefined) {
                        counts[season]++;
                    }
                });
            }
        });

        return counts;
    }, [reviews]);

    const totalVotes = useMemo(() => {
        return Math.max(1, reviews.filter(r => r.seasonVote).length);
    }, [reviews]);

    const maxVotes = useMemo(() => {
        return Math.max(1, ...Object.values(seasonCounts));
    }, [seasonCounts]);

    return (
        <div className="p-6 bg-bg-secondary border border-border-primary">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                    Stagioni Consigliate
                </span>
                <span className="text-xs text-text-muted">
                    {totalVotes} voti
                </span>
            </div>

            <div className="space-y-4">
                {SEASONS.map(({ key, label, icon, color }) => {
                    const count = seasonCounts[key];
                    const percentage = totalVotes > 0 ? (count / maxVotes) * 100 : 0;

                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{icon}</span>
                                    <span className="text-sm">{label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-text-muted">
                                        {count} voti
                                    </span>
                                    <span className="text-xs font-mono text-text-secondary">
                                        ({totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0}%)
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-bg-tertiary overflow-hidden">
                                <div
                                    className={`h-full ${color} transition-all duration-700`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalVotes === 1 && reviews.filter(r => r.seasonVote).length === 0 && (
                <p className="mt-4 text-xs text-text-muted text-center">
                    Nessun voto ancora. Sii il primo a indicare le stagioni ideali!
                </p>
            )}
        </div>
    );
}
