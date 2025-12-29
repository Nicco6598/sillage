"use client";

import Link from "next/link";
import { Heart, Grid, List, ArrowRight } from "lucide-react";
import { useState } from "react";

const mockFavorites = [
    { id: "1", name: "Bleu de Chanel", brand: "Chanel", rating: 4.8 },
    { id: "2", name: "Sauvage", brand: "Dior", rating: 4.6 },
    { id: "3", name: "Aventus", brand: "Creed", rating: 4.9 },
    { id: "4", name: "Tobacco Vanille", brand: "Tom Ford", rating: 4.7 },
];

export default function FavoritesPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const isLoggedIn = true; // Simulating logged in user for layout check

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <Heart className="h-12 w-12 stroke-[1px] mb-6 text-text-primary" />
                <h1 className="font-serif text-4xl mb-4">Salva i tuoi preferiti.</h1>
                <p className="text-text-secondary mb-8">Accedi per creare la tua wishlist personale.</p>
                <Link href="/login" className="border-b border-text-primary pb-1 uppercase tracking-widest text-sm hover:text-text-primary/70 transition-colors">
                    Accedi all&apos;account
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full pt-40 pb-24">
            <div className="container-page mb-16 flex flex-col md:flex-row justify-between items-end border-b border-border-primary pb-8 gap-8">
                <div>
                    <h1 className="font-serif text-5xl md:text-7xl mb-2">Preferiti.</h1>
                    <p className="text-text-secondary font-mono text-xs uppercase tracking-widest">
                        {mockFavorites.length} Items Saved
                    </p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setViewMode("grid")} className={`p-2 border border-border-primary hover:bg-bg-secondary transition-colors ${viewMode === "grid" ? "bg-bg-secondary" : ""}`}>
                        <Grid className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2 border border-border-primary hover:bg-bg-secondary transition-colors ${viewMode === "list" ? "bg-bg-secondary" : ""}`}>
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="container-page">
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {mockFavorites.map((f) => (
                            <div key={f.id} className="group relative">
                                <div className="aspect-[3/4] bg-bg-tertiary mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 transition-transform duration-700 ease-out group-hover:scale-105" />
                                    <button className="absolute top-4 right-4 text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Heart className="h-5 w-5 fill-current" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-medium group-hover:underline underline-offset-4 decoration-1">{f.name}</h3>
                                <p className="text-sm text-text-muted uppercase tracking-wider mb-2">{f.brand}</p>
                                <Link href={`/fragrance/${f.id}`} className="text-xs font-mono uppercase tracking-widest border-b border-transparent group-hover:border-text-primary transition-colors inline-block pb-0.5">
                                    Visualizza
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-border-primary">
                        {mockFavorites.map((f) => (
                            <div key={f.id} className="py-6 flex justify-between items-center group hover:bg-bg-secondary transition-colors px-4 -mx-4">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 bg-bg-tertiary" /> {/* Tiny thumb */}
                                    <div>
                                        <h3 className="text-xl font-serif">{f.name}</h3>
                                        <p className="text-xs uppercase tracking-widest text-text-muted">{f.brand}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className="font-mono text-sm hidden sm:block">★ {f.rating}</span>
                                    <Link href={`/fragrance/${f.id}`} className="group-hover:translate-x-2 transition-transform duration-300">
                                        <ArrowRight className="h-5 w-5 text-text-primary" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
