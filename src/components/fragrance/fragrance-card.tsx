"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { Fragrance } from "@/types/fragrance";
import { cn, formatRating } from "@/lib/utils";

interface FragranceCardProps {
    fragrance: Fragrance;
}

/**
 * Gender gradient mappings for visual distinction
 */
const genderGradients = {
    masculine: "from-blue-500/10 to-indigo-500/10",
    feminine: "from-pink-500/10 to-rose-500/10",
    unisex: "from-violet-500/10 to-purple-500/10",
};

/**
 * Premium Fragrance Card - Stone & Silk Design System
 * Used across Explore, Home, and Brand pages for a consistent aesthetic.
 */
export function FragranceCard({
    fragrance,
    variant = "default"
}: {
    fragrance: Fragrance;
    variant?: "default" | "centered";
}) {
    return (
        <Link
            href={`/fragrance/${fragrance.slug}`}
            className="group block"
        >
            <div className="relative overflow-hidden bg-bg-tertiary aspect-[3/4] mb-4 group/image ring-1 ring-inset ring-white/10 dark:ring-white/5 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                {/* Visual Depth Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/[0.03] pointer-events-none z-10" />

                {fragrance.imageUrl ? (
                    <Image
                        src={fragrance.imageUrl}
                        alt={fragrance.name}
                        fill
                        className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center">
                        <span className="text-4xl opacity-20">🌸</span>
                    </div>
                )}

                {/* Hover Tint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500 z-20" />

                {/* Info Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-bg-primary/90 backdrop-blur-md text-[10px] font-mono opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-subtle z-30">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    {fragrance.rating.toFixed(1)}
                </div>

                {/* New Indicator */}
                {fragrance.isNew && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-gold text-[9px] font-mono uppercase tracking-widest text-white shadow-subtle z-30">
                        New
                    </div>
                )}
            </div>

            {/* Typography Section */}
            <div className={cn(
                "space-y-1 transition-colors duration-300",
                variant === "centered" ? "text-center" : "text-left"
            )}>
                <h3 className="font-medium text-text-primary leading-tight line-clamp-1 group-hover:text-copper transition-colors duration-300">
                    {fragrance.name}
                </h3>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] text-text-muted uppercase tracking-[0.15em] font-medium truncate">
                        {fragrance.brand.name}
                    </p>
                    <div className={cn(
                        "flex items-center gap-2 pt-1 opacity-70",
                        variant === "centered" ? "justify-center" : "justify-start"
                    )}>
                        <span className="text-[10px] text-text-tertiary font-mono">{fragrance.concentration}</span>
                        {fragrance.year && (
                            <>
                                <span className="text-text-muted/30">|</span>
                                <span className="text-[10px] text-text-tertiary font-mono">{fragrance.year}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}



interface SkeletonProps {
    variant?: "default" | "compact";
}

/**
 * Skeleton loader
 */
export function FragranceCardSkeleton({ variant = "default" }: SkeletonProps) {
    if (variant === "compact") {
        return (
            <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary">
                <div className="skeleton aspect-square" />
                <div className="space-y-2 p-3">
                    <div className="skeleton h-2.5 w-12 rounded" />
                    <div className="skeleton h-4 w-4/5 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border-primary bg-bg-secondary">
            <div className="skeleton aspect-square" />
            <div className="space-y-2 p-4">
                <div className="skeleton h-3 w-12 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
            </div>
        </div>
    );
}
