"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Heart,
    Star,
    Clock,
    Wind,
    Calendar,
    Droplets,
    Share2,
    ThumbsUp,
    MessageCircle,
    ChevronDown,
    Sparkles,
    User
} from "lucide-react";
import { useState } from "react";
import { FragranceCard } from "@/components/fragrance/fragrance-card";
import type { Fragrance } from "@/types/fragrance";
import { cn, formatRating } from "@/lib/utils";

interface FragranceDetailProps {
    fragrance: Fragrance;
    similar: Fragrance[];
}

// Mock reviews for demo
const mockReviews = [
    {
        id: "1",
        userName: "Marco R.",
        rating: 5,
        date: "2 giorni fa",
        content: "Profumo eccezionale! Durata incredibile e sillage perfetto per l'ufficio. Lo uso quotidianamente da 2 anni.",
        likes: 24,
        isVerified: true,
    },
    {
        id: "2",
        userName: "Giulia M.",
        rating: 4,
        date: "1 settimana fa",
        content: "Bellissimo, elegante e versatile. Forse un po' troppo comune ormai, ma la qualità resta altissima.",
        likes: 12,
        isVerified: false,
    },
    {
        id: "3",
        userName: "Alessandro F.",
        rating: 5,
        date: "2 settimane fa",
        content: "Il mio signature scent. Ricevo sempre complimenti. Perfetto per tutte le stagioni tranne l'estate piena.",
        likes: 45,
        isVerified: true,
    },
];

/**
 * Fragrance detail component - Premium version
 */
export function FragranceDetail({ fragrance, similar }: FragranceDetailProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState<"notes" | "reviews" | "similar">("notes");

    const genderLabels = {
        masculine: "Maschile",
        feminine: "Femminile",
        unisex: "Unisex",
    };

    const genderColors = {
        masculine: "from-blue-500/20 to-indigo-500/20",
        feminine: "from-pink-500/20 to-rose-500/20",
        unisex: "from-violet-500/20 to-purple-500/20",
    };

    const genderEmoji = {
        masculine: "🧔",
        feminine: "👩",
        unisex: "✨",
    };

    return (
        <div className="container-page">
            {/* Back Button */}
            <Link
                href="/explore"
                className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
            >
                <ArrowLeft className="h-4 w-4" />
                Torna alla ricerca
            </Link>

            {/* Hero Section */}
            <div className="grid gap-8 lg:grid-cols-5">
                {/* Left: Image - 2 cols */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24">
                        <div
                            className={cn(
                                "aspect-square overflow-hidden rounded-3xl bg-gradient-to-br shadow-2xl",
                                genderColors[fragrance.gender]
                            )}
                        >
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <span className="text-8xl">{genderEmoji[fragrance.gender]}</span>
                                    <p className="mt-4 text-sm text-text-muted">{fragrance.concentration}</p>
                                </div>
                            </div>

                            {/* Badges */}
                            {fragrance.isNew && (
                                <span className="absolute left-4 top-4 rounded-lg bg-accent px-3 py-1 text-sm font-medium text-white shadow-lg">
                                    🆕 Nuovo
                                </span>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={cn(
                                    "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition-all",
                                    isLiked
                                        ? "bg-error/10 text-error"
                                        : "bg-bg-secondary text-text-secondary hover:bg-error/10 hover:text-error"
                                )}
                            >
                                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                                {isLiked ? "Salvato" : "Salva"}
                            </button>
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-bg-secondary py-3 font-medium text-text-secondary transition-colors hover:bg-bg-tertiary">
                                <Share2 className="h-5 w-5" />
                                Condividi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Info - 3 cols */}
                <div className="space-y-6 lg:col-span-3">
                    {/* Brand */}
                    <Link
                        href={`/brands/${fragrance.brand.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-accent hover:underline"
                    >
                        <Sparkles className="h-4 w-4" />
                        {fragrance.brand.name}
                    </Link>

                    {/* Name */}
                    <h1 className="text-4xl font-bold text-text-primary sm:text-5xl">
                        {fragrance.name}
                    </h1>

                    {/* Meta Pills */}
                    <div className="flex flex-wrap gap-2">
                        {fragrance.year && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary">
                                <Calendar className="h-4 w-4" />
                                {fragrance.year}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary">
                            <Droplets className="h-4 w-4" />
                            {fragrance.concentration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary">
                            {genderLabels[fragrance.gender]}
                        </span>
                        {fragrance.brand.country && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1.5 text-sm text-text-secondary">
                                📍 {fragrance.brand.country}
                            </span>
                        )}
                    </div>

                    {/* Rating Card */}
                    <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-text-primary">
                                        {formatRating(fragrance.rating)}
                                    </span>
                                    <span className="text-lg text-text-muted">/ 5</span>
                                </div>
                                <div className="mt-1 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "h-5 w-5",
                                                star <= Math.round(fragrance.rating)
                                                    ? "fill-warning text-warning"
                                                    : "text-border-secondary"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-semibold text-text-primary">
                                    {fragrance.reviewCount.toLocaleString()}
                                </p>
                                <p className="text-sm text-text-muted">recensioni</p>
                            </div>
                        </div>

                        {/* Stats Bars */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5 text-text-muted">
                                        <Wind className="h-4 w-4" />
                                        Sillage
                                    </span>
                                    <span className="font-medium text-text-primary">{fragrance.sillage}/5</span>
                                </div>
                                <div className="mt-2 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={cn(
                                                "h-2 flex-1 rounded-full transition-colors",
                                                level <= fragrance.sillage ? "bg-accent" : "bg-border-primary"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5 text-text-muted">
                                        <Clock className="h-4 w-4" />
                                        Durata
                                    </span>
                                    <span className="font-medium text-text-primary">{fragrance.longevity}/5</span>
                                </div>
                                <div className="mt-2 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={cn(
                                                "h-2 flex-1 rounded-full transition-colors",
                                                level <= fragrance.longevity ? "bg-accent" : "bg-border-primary"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Accords */}
                    {fragrance.accords.length > 0 && (
                        <div className="rounded-2xl border border-border-primary bg-bg-secondary p-5">
                            <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-text-muted">
                                Main Accords
                            </h3>
                            <div className="space-y-3">
                                {fragrance.accords.map((accord) => (
                                    <div key={accord.name}>
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span className="font-medium text-text-primary">{accord.name}</span>
                                            <span className="text-text-muted">{accord.percentage}%</span>
                                        </div>
                                        <div className="h-3 overflow-hidden rounded-full bg-bg-tertiary">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${accord.percentage}%`,
                                                    backgroundColor: accord.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-12">
                {/* Tab Headers */}
                <div className="flex gap-1 rounded-xl border border-border-primary bg-bg-secondary p-1">
                    {[
                        { id: "notes", label: "Piramide Olfattiva", icon: "🌸" },
                        { id: "reviews", label: `Recensioni (${fragrance.reviewCount})`, icon: "💬" },
                        { id: "similar", label: "Mi Ricorda / Simili", icon: "✨" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={cn(
                                "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-accent text-white shadow-lg"
                                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                            )}
                        >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {/* Notes Pyramid Tab */}
                    {activeTab === "notes" && (
                        <div className="rounded-2xl border border-border-primary bg-bg-secondary p-6 sm:p-8">
                            <h3 className="mb-8 text-center text-xl font-semibold text-text-primary">
                                🌸 Piramide Olfattiva
                            </h3>

                            {/* True Pyramid Visualization */}
                            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
                                {/* Top Notes - Narrowest */}
                                <div className="w-full max-w-xs">
                                    <div className="rounded-2xl border-2 border-accent bg-accent/10 p-5 text-center">
                                        <span className="text-3xl">☀️</span>
                                        <h4 className="mt-2 text-sm font-bold uppercase tracking-wider text-accent">
                                            Note di Testa
                                        </h4>
                                        <p className="mt-1 text-xs text-text-muted">Prime impressioni • 15-30 min</p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {fragrance.notes.top.length > 0 ? (
                                                fragrance.notes.top.map((note) => (
                                                    <Link
                                                        key={note.id}
                                                        href={`/notes/${note.id}`}
                                                        className="rounded-full bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
                                                    >
                                                        {note.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-sm text-text-muted">Non disponibili</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Heart Notes - Medium */}
                                <div className="w-full max-w-md">
                                    <div className="rounded-2xl border-2 border-accent-secondary bg-accent-secondary/10 p-5 text-center">
                                        <span className="text-3xl">❤️</span>
                                        <h4 className="mt-2 text-sm font-bold uppercase tracking-wider text-accent-secondary">
                                            Note di Cuore
                                        </h4>
                                        <p className="mt-1 text-xs text-text-muted">Il carattere • 30 min - 3 ore</p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {fragrance.notes.heart.length > 0 ? (
                                                fragrance.notes.heart.map((note) => (
                                                    <Link
                                                        key={note.id}
                                                        href={`/notes/${note.id}`}
                                                        className="rounded-full bg-accent-secondary/20 px-3 py-1.5 text-sm font-medium text-accent-secondary transition-colors hover:bg-accent-secondary hover:text-white"
                                                    >
                                                        {note.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-sm text-text-muted">Non disponibili</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Base Notes - Widest */}
                                <div className="w-full max-w-xl">
                                    <div className="rounded-2xl border-2 border-accent-tertiary bg-accent-tertiary/10 p-5 text-center">
                                        <span className="text-3xl">🌙</span>
                                        <h4 className="mt-2 text-sm font-bold uppercase tracking-wider text-accent-tertiary">
                                            Note di Fondo
                                        </h4>
                                        <p className="mt-1 text-xs text-text-muted">La firma • 3+ ore</p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {fragrance.notes.base.length > 0 ? (
                                                fragrance.notes.base.map((note) => (
                                                    <Link
                                                        key={note.id}
                                                        href={`/notes/${note.id}`}
                                                        className="rounded-full bg-accent-tertiary/20 px-3 py-1.5 text-sm font-medium text-accent-tertiary transition-colors hover:bg-accent-tertiary hover:text-white"
                                                    >
                                                        {note.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-sm text-text-muted">Non disponibili</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === "reviews" && (
                        <div className="space-y-4">
                            {/* Write Review CTA */}
                            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
                                <MessageCircle className="mx-auto h-8 w-8 text-accent" />
                                <h3 className="mt-3 text-lg font-semibold text-text-primary">
                                    Hai provato questo profumo?
                                </h3>
                                <p className="mt-1 text-sm text-text-muted">
                                    Condividi la tua esperienza con la community
                                </p>
                                <button className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
                                    Scrivi una recensione
                                </button>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-4">
                                {mockReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-2xl border border-border-primary bg-bg-secondary p-5"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-text-primary">
                                                            {review.userName}
                                                        </span>
                                                        {review.isVerified && (
                                                            <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                                                ✓ Verificato
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-text-muted">{review.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "h-4 w-4",
                                                            star <= review.rating
                                                                ? "fill-warning text-warning"
                                                                : "text-border-secondary"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-4 text-text-secondary">{review.content}</p>
                                        <div className="mt-4 flex items-center gap-4">
                                            <button className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent">
                                                <ThumbsUp className="h-4 w-4" />
                                                {review.likes}
                                            </button>
                                            <button className="text-sm text-text-muted transition-colors hover:text-text-primary">
                                                Rispondi
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load More */}
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-secondary">
                                <ChevronDown className="h-4 w-4" />
                                Carica altre recensioni
                            </button>
                        </div>
                    )}

                    {/* Similar / Dupes Tab */}
                    {activeTab === "similar" && (
                        <div className="space-y-8">
                            {/* "Mi Ricorda" - Dupes */}
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🔄</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">
                                            Mi Ricorda / Equivalenti
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            Profumi con DNA olfattivo simile
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {similar.slice(0, 4).map((f) => (
                                        <FragranceCard key={f.id} fragrance={f} />
                                    ))}
                                </div>
                            </div>

                            {/* Same Brand */}
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🏷️</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">
                                            Altro da {fragrance.brand.name}
                                        </h3>
                                        <p className="text-sm text-text-muted">
                                            Esplora altri profumi del brand
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {similar.slice(0, 4).map((f) => (
                                        <FragranceCard key={`brand-${f.id}`} fragrance={f} />
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <Link
                                        href={`/brands/${fragrance.brand.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                                    >
                                        Vedi tutti i profumi {fragrance.brand.name}
                                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </Link>
                                </div>
                            </div>

                            {/* Same Accords */}
                            {fragrance.accords.length > 0 && (
                                <div>
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="text-2xl">🎨</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-primary">
                                                Stesso stile: {fragrance.accords[0]?.name}
                                            </h3>
                                            <p className="text-sm text-text-muted">
                                                Altri profumi con accordi simili
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {similar.slice(0, 4).map((f) => (
                                            <FragranceCard key={`accord-${f.id}`} fragrance={f} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
