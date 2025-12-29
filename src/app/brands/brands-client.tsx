"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, ArrowUpRight, Crown, Gem, Star, Sparkles } from "lucide-react";

interface Brand {
    id: string;
    name: string;
    slug: string;
    country: string | null;
    fragranceCount: number;
}

interface Stats {
    fragrances: number;
    brands: number;
    notes: number;
}

interface BrandsClientPageProps {
    allBrands: Brand[];
    featuredBrands: Brand[];
    stats: Stats;
}

const icons = [Crown, Gem, Star, Sparkles];

export function BrandsClientPage({ allBrands, featuredBrands, stats }: BrandsClientPageProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter brands based on search
    const filteredBrands = useMemo(() => {
        if (!searchQuery) return allBrands;
        return allBrands.filter((brand) =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allBrands]);

    // Group brands by first letter
    const groupedBrands = useMemo(() => {
        const groups: Record<string, Brand[]> = {};
        filteredBrands.forEach((brand) => {
            const letter = brand.name[0].toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(brand);
        });
        return groups;
    }, [filteredBrands]);

    const sortedLetters = Object.keys(groupedBrands).sort();

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                    Brands<span className="text-copper">.</span>
                                </h1>
                                <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                    Una selezione curata delle maison più prestigiose del mondo della profumeria.
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full md:w-80">
                                <div className="absolute inset-0 bg-bg-tertiary/50 backdrop-blur-sm -z-10 border border-border-primary" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cerca brand..."
                                    className="w-full bg-transparent px-4 py-3 text-sm tracking-wide placeholder:text-text-muted outline-none"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap gap-8 pt-8 border-t border-border-primary">
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-copper">{stats.brands}</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Brand</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-gold">{stats.fragrances}</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Fragranze</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-rose-gold">{stats.notes}</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Note</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Brands */}
            {featuredBrands.length > 0 && (
                <div className="container-page mb-24 md:mb-32">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-8 h-px bg-copper" />
                        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                            In Evidenza
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {featuredBrands.map((brand, i) => {
                            const Icon = icons[i % icons.length];
                            return (
                                <Link
                                    key={brand.id}
                                    href={`/brands/${brand.slug}`}
                                    className="group relative overflow-hidden border border-border-primary bg-bg-secondary/30 backdrop-blur-sm hover:border-copper transition-all duration-500"
                                >
                                    {/* Gradient Overlay on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-copper/0 via-copper/0 to-copper/0 group-hover:from-copper/5 group-hover:via-copper/10 group-hover:to-rose-gold/5 transition-all duration-700" />

                                    {/* Index Number */}
                                    <div className="absolute top-4 left-4">
                                        <span className="font-mono text-xs text-text-muted group-hover:text-copper transition-colors">
                                            0{i + 1}
                                        </span>
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute top-4 right-4 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5 text-copper" />
                                    </div>

                                    <div className="relative p-6 pt-16 pb-8 flex flex-col h-full min-h-[280px]">
                                        {/* Icon */}
                                        <div className="mb-auto">
                                            <div className="w-12 h-12 flex items-center justify-center border border-border-secondary group-hover:border-copper/50 group-hover:bg-copper/5 transition-all duration-500">
                                                <Icon className="w-5 h-5 text-text-muted group-hover:text-copper transition-colors duration-300" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-3">
                                            <h3 className="font-serif text-2xl md:text-3xl group-hover:text-copper transition-colors duration-300">
                                                {brand.name}
                                            </h3>
                                            {brand.country && (
                                                <p className="text-sm text-text-tertiary leading-relaxed">
                                                    {brand.country}
                                                </p>
                                            )}
                                            <div className="pt-2">
                                                <span className="text-xs font-mono text-text-muted">
                                                    {brand.fragranceCount} fragranze
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Border Animation */}
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-copper to-rose-gold group-hover:w-full transition-all duration-500" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Directory Section */}
            <div className="container-page">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-px bg-gold" />
                        <h2 className="font-serif text-3xl md:text-4xl">Directory</h2>
                        {searchQuery && (
                            <span className="text-sm text-text-muted">
                                ({filteredBrands.length} risultati)
                            </span>
                        )}
                    </div>
                </div>

                {/* Alphabet Quick Nav */}
                {sortedLetters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-border-primary">
                        {sortedLetters.map((letter) => (
                            <a
                                key={letter}
                                href={`#letter-${letter}`}
                                className="w-8 h-8 flex items-center justify-center text-sm font-mono text-text-muted hover:text-copper hover:bg-copper/5 transition-all duration-200"
                            >
                                {letter}
                            </a>
                        ))}
                    </div>
                )}

                {/* Brands Grid by Letter */}
                {sortedLetters.length > 0 ? (
                    <div className="space-y-12">
                        {sortedLetters.map((letter) => (
                            <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                                {/* Letter Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-serif text-5xl text-copper/30">
                                        {letter}
                                    </span>
                                    <div className="flex-1 h-px bg-border-primary" />
                                    <span className="text-xs font-mono text-text-muted">
                                        {groupedBrands[letter].length} brand
                                    </span>
                                </div>

                                {/* Brands List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-1">
                                    {groupedBrands[letter].map((brand) => (
                                        <Link
                                            key={brand.id}
                                            href={`/brands/${brand.slug}`}
                                            className="group flex items-center justify-between py-4 border-b border-border-secondary/50 hover:border-copper transition-all duration-300"
                                        >
                                            <span className="text-base group-hover:translate-x-2 group-hover:text-copper transition-all duration-300">
                                                {brand.name}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-bg-tertiary/50 text-text-muted group-hover:bg-copper/10 group-hover:text-copper transition-all duration-300">
                                                    {brand.fragranceCount}
                                                </span>
                                                <ArrowUpRight className="w-4 h-4 text-text-muted opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:text-copper transition-all duration-300" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-lg text-text-muted">
                            Nessun brand trovato per &quot;{searchQuery}&quot;
                        </p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 text-sm text-copper hover:underline underline-offset-4"
                        >
                            Resetta ricerca
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
