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

const genderColors = {
    masculine: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    feminine: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    unisex: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

/**
 * Standard fragrance card with full details
 */
export function FragranceCard({ fragrance }: FragranceCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);

    const hasValidImage = fragrance.imageUrl &&
        !imageError;

    return (
        <Link
            href={`/fragrance/${fragrance.slug}`}
            className={cn(
                "group block overflow-hidden rounded-xl border border-border-primary bg-bg-secondary",
                "transition-all duration-200 hover:border-accent/30 hover:shadow-md"
            )}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-bg-tertiary">
                {/* Gradient Background */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        genderGradients[fragrance.gender]
                    )}
                />

                {/* Real Image or Placeholder */}
                {hasValidImage ? (
                    <Image
                        src={fragrance.imageUrl}
                        alt={`${fragrance.name} by ${fragrance.brand.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl opacity-60">🌸</span>
                    </div>
                )}

                {/* Badges */}
                {fragrance.isNew && (
                    <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-white">
                        New
                    </span>
                )}

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={cn(
                        "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        isLiked
                            ? "bg-error/10 text-error"
                            : "bg-black/20 text-white backdrop-blur-sm hover:bg-error/20 hover:text-error"
                    )}
                >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                    {fragrance.brand.name}
                </p>
                <h3 className="mt-1 font-medium text-text-primary line-clamp-1 group-hover:text-accent">
                    {fragrance.name}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                    {fragrance.concentration} {fragrance.year && `• ${fragrance.year}`}
                </p>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium text-text-primary">
                        {formatRating(fragrance.rating)}
                    </span>
                    <span className="text-xs text-text-muted">
                        ({fragrance.reviewCount.toLocaleString()})
                    </span>
                </div>

                {/* Accords */}
                {fragrance.accords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {fragrance.accords.slice(0, 2).map((accord) => (
                            <span
                                key={accord.name}
                                className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary"
                            >
                                {accord.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

/**
 * Compact fragrance card - smaller with minimal info for grid view
 */
export function FragranceCardCompact({ fragrance }: FragranceCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);

    const hasValidImage = fragrance.imageUrl &&
        !imageError;

    return (
        <Link
            href={`/fragrance/${fragrance.slug}`}
            className={cn(
                "group relative block overflow-hidden rounded-2xl border border-border-primary bg-bg-secondary",
                "transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-bg-tertiary ring-1 ring-inset ring-white/10 rounded-t-2xl">
                {/* Gradient Background */}
                <div
                    className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-60",
                        genderGradients[fragrance.gender]
                    )}
                />

                {/* Mesh Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--text-muted)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--text-muted)/0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Real Image or Placeholder */}
                {hasValidImage ? (
                    <Image
                        src={fragrance.imageUrl}
                        alt={`${fragrance.name} by ${fragrance.brand.name}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl opacity-50 transition-transform duration-300 group-hover:scale-110">
                            🌸
                        </span>
                    </div>
                )}

                {/* New Badge */}
                {fragrance.isNew && (
                    <span className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-accent to-accent-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-accent/30">
                        New
                    </span>
                )}

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={cn(
                        "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                        "opacity-0 group-hover:opacity-100",
                        isLiked
                            ? "bg-error/20 text-error backdrop-blur-sm"
                            : "bg-black/30 text-white backdrop-blur-sm hover:bg-error/30 hover:text-error"
                    )}
                >
                    <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                </button>

                {/* Rating Badge - Bottom Right */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-xs font-semibold text-white">
                        {formatRating(fragrance.rating)}
                    </span>
                </div>

                {/* Gender Indicator */}
                <div
                    className={cn(
                        "absolute bottom-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        genderColors[fragrance.gender]
                    )}
                >
                    {fragrance.gender === "masculine" ? "M" : fragrance.gender === "feminine" ? "F" : "U"}
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Brand */}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent/80 line-clamp-1">
                    {fragrance.brand.name}
                </p>

                {/* Name */}
                <h3 className="mt-0.5 text-sm font-semibold text-text-primary line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {fragrance.name}
                </h3>

                {/* Meta Info */}
                <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="rounded bg-bg-tertiary px-1.5 py-0.5 font-medium">
                        {fragrance.concentration}
                    </span>
                    {fragrance.year && (
                        <span>{fragrance.year}</span>
                    )}
                </div>

                {/* Main Accord */}
                {fragrance.accords.length > 0 && (
                    <div className="mt-2">
                        <span
                            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                                backgroundColor: `${fragrance.accords[0].color}20`,
                                color: fragrance.accords[0].color
                            }}
                        >
                            {fragrance.accords[0].name}
                        </span>
                    </div>
                )}
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none ring-1 ring-inset ring-accent/20" />
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
