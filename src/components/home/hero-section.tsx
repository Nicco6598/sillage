"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/search-bar";
import { cn } from "@/lib/utils";

/**
 * Minimal hero section with clean design
 */
export function HeroSection() {
    return (
        <section className="relative min-h-[80vh] overflow-hidden bg-bg-primary pt-24">
            {/* Subtle Background Gradient */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-gold/10 blur-3xl" />
            </div>

            {/* Content */}
            <div className="container-page relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-copper/20 bg-copper/5 px-3 py-1 text-sm text-copper">
                    <span className="h-1.5 w-1.5 rounded-full bg-copper" />
                    15,000+ fragranze
                </div>

                {/* Heading */}
                <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl">
                    Trova il tuo{" "}
                    <span className="text-copper italic font-serif">profumo</span>
                </h1>

                {/* Subheading */}
                <p className="mt-6 max-w-lg text-lg text-text-secondary">
                    Esplora migliaia di fragranze, leggi recensioni e scopri la tua signature scent.
                </p>

                <div className="mt-10 w-full max-w-xl">
                    <SearchBar />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <span className="text-sm text-text-muted">Popolari:</span>
                    {["Bleu de Chanel", "Sauvage", "Aventus"].map((name) => (
                        <Link
                            key={name}
                            href={`/search?q=${encodeURIComponent(name)}`}
                            className="rounded-full border border-border-primary px-3 py-1 text-sm text-text-secondary transition-colors hover:border-copper hover:text-copper"
                        >
                            {name}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 flex gap-4">
                    <Link
                        href="/explore"
                        className={cn(
                            "group inline-flex h-11 items-center gap-2 rounded-xl px-6",
                            "bg-copper text-sm font-medium text-white",
                            "transition-all hover:bg-copper/90 hover:scale-105"
                        )}
                    >
                        Esplora
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
