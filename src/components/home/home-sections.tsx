"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FragranceCard } from "@/components/fragrance/fragrance-card";
import type { Fragrance } from "@/types/fragrance";
import { cn } from "@/lib/utils";

interface FeaturedFragrancesProps {
    fragrances: Fragrance[];
}

/**
 * Featured fragrances grid section
 */
export function FeaturedFragrances({ fragrances }: FeaturedFragrancesProps) {
    return (
        <section className="py-20">
            <div className="container-page">
                {/* Header */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-text-primary">
                            In evidenza
                        </h2>
                        <p className="mt-1 text-sm text-text-muted">
                            Le fragranze più amate
                        </p>
                    </div>

                    <Link
                        href="/explore"
                        className="group flex items-center gap-1 text-sm font-medium text-copper"
                    >
                        Vedi tutte
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {fragrances.map((fragrance) => (
                        <FragranceCard key={fragrance.id} fragrance={fragrance} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * Categories grid section
 */
export function CategoriesSection() {
    const categories = [
        { name: "Maschili", icon: "👔", count: 5234, href: "/explore?gender=masculine" },
        { name: "Femminili", icon: "💐", count: 6891, href: "/explore?gender=feminine" },
        { name: "Unisex", icon: "✨", count: 2456, href: "/explore?gender=unisex" },
        { name: "Niche", icon: "💎", count: 1234, href: "/explore?type=niche" },
    ];

    return (
        <section className="border-y border-border-primary bg-bg-secondary py-16">
            <div className="container-page">
                <h2 className="mb-8 text-center text-xl font-semibold text-text-primary">
                    Esplora per categoria
                </h2>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className={cn(
                                "group flex flex-col items-center gap-2 rounded-xl border border-border-primary bg-bg-primary p-6 text-center",
                                "transition-all duration-200 hover:border-copper hover:shadow-sm"
                            )}
                        >
                            <span className="text-3xl">{cat.icon}</span>
                            <span className="font-medium text-text-primary group-hover:text-copper">
                                {cat.name}
                            </span>
                            <span className="text-xs text-text-muted">{cat.count.toLocaleString()}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * Top brands section
 */
export function TopBrandsSection() {
    const brands = [
        { name: "Chanel", emoji: "🇫🇷" },
        { name: "Dior", emoji: "🇫🇷" },
        { name: "Tom Ford", emoji: "🇺🇸" },
        { name: "Creed", emoji: "🇬🇧" },
        { name: "Giorgio Armani", emoji: "🇮🇹" },
        { name: "Guerlain", emoji: "🇫🇷" },
    ];

    return (
        <section className="py-20">
            <div className="container-page">
                <div className="mb-8 flex items-end justify-between">
                    <h2 className="text-2xl font-semibold text-text-primary">Top brand</h2>
                    <Link
                        href="/brands"
                        className="group flex items-center gap-1 text-sm font-medium text-copper"
                    >
                        Tutti
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand.name}
                            href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border border-border-primary p-4",
                                "transition-all duration-200 hover:border-copper hover:shadow-sm"
                            )}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-tertiary text-lg font-semibold text-text-secondary">
                                {brand.name[0]}
                            </div>
                            <span className="text-sm font-medium text-text-primary">{brand.name}</span>
                            <span className="text-xs text-text-muted">{brand.emoji}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * Popular notes section
 */
export function PopularNotesSection() {
    const notes = [
        "Bergamotto", "Lavanda", "Vaniglia", "Sandalo", "Rosa",
        "Oud", "Ambra", "Muschio", "Patchouli", "Cedro"
    ];

    return (
        <section className="border-t border-border-primary bg-bg-secondary py-16">
            <div className="container-page">
                <h2 className="mb-6 text-center text-xl font-semibold text-text-primary">
                    Note popolari
                </h2>

                <div className="flex flex-wrap justify-center gap-2">
                    {notes.map((note) => (
                        <Link
                            key={note}
                            href={`/notes/${note.toLowerCase()}`}
                            className="rounded-full border border-border-primary bg-bg-primary px-4 py-2 text-sm text-text-secondary transition-colors hover:border-copper hover:text-copper"
                        >
                            {note}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/**
 * Simple CTA section
 */
export function CTASection() {
    return (
        <section className="py-20">
            <div className="container-page">
                <div className="rounded-2xl bg-gradient-to-r from-copper to-rose-gold p-8 text-center md:p-12">
                    <h2 className="text-2xl font-semibold text-white md:text-3xl">
                        Unisciti alla community
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
                        Ricevi consigli personalizzati e scopri nuove fragranze.
                    </p>

                    <form className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
                        <input
                            type="email"
                            placeholder="La tua email"
                            className="h-11 flex-1 rounded-lg bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        <button
                            type="submit"
                            className="h-11 rounded-lg bg-white px-6 text-sm font-medium text-copper transition-colors hover:bg-white/90"
                        >
                            Iscriviti
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
