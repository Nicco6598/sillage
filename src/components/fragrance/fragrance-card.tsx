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
