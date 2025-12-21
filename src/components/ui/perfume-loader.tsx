"use client";

import { useEffect, useState } from "react";

/**
 * PerfumeLoader - An elegant loading animation matching the Sillage "Stone & Silk" design
 * Minimal, refined, and luxurious
 */
export function PerfumeLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary">
            {/* Logo */}
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-text-primary uppercase mb-10">
                SILLAGE<span className="text-copper">.</span>
            </h1>

            {/* Elegant spinner - double ring */}
            <div className="relative mb-8">
                <div className="w-14 h-14 border border-border-secondary rounded-full" />
                <div className="absolute inset-0 w-14 h-14 border-2 border-copper border-t-transparent rounded-full animate-spin" />
            </div>

            {/* Loading Text */}
            <p className="text-xs tracking-[0.25em] text-text-muted uppercase">
                Caricamento
            </p>
        </div>
    );
}

/**
 * InlineLoader - A compact loading indicator for inline use (login, logout, etc.)
 * Uses consistent styling with the main loader
 */
interface InlineLoaderProps {
    message?: string;
}

export function InlineLoader({ message = "Caricamento" }: InlineLoaderProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
            {/* Logo */}
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-text-primary uppercase mb-10">
                SILLAGE<span className="text-copper">.</span>
            </h1>

            {/* Elegant spinner */}
            <div className="relative mb-8">
                <div className="w-14 h-14 border border-border-secondary rounded-full" />
                <div className="absolute inset-0 w-14 h-14 border-2 border-copper border-t-transparent rounded-full animate-spin" />
            </div>

            {/* Message */}
            <p className="text-xs tracking-[0.25em] text-text-muted uppercase">
                {message}
            </p>
        </div>
    );
}

/**
 * RouteChangeLoader - Handles showing the loader on route changes
 * Uses Next.js navigation events
 */
export function RouteChangeLoader() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Listen for route change start
        const handleComplete = () => {
            // Small delay for smooth transition
            setTimeout(() => setIsLoading(false), 300);
        };

        // For Next.js App Router, we need to intercept link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                const url = new URL(anchor.href, window.location.origin);

                // Only show loader for internal navigation
                if (
                    url.origin === window.location.origin &&
                    url.pathname !== window.location.pathname &&
                    !anchor.target &&
                    !anchor.download &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !e.shiftKey
                ) {
                    setIsLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick);

        // Hide loader when page loads
        window.addEventListener("load", handleComplete);

        // Also listen for popstate (back/forward navigation)
        window.addEventListener("popstate", () => setIsLoading(true));

        return () => {
            document.removeEventListener("click", handleClick);
            window.removeEventListener("load", handleComplete);
        };
    }, []);

    // Hide loader after navigation completes
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000); // Fallback timeout

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isLoading) return null;

    return <PerfumeLoader />;
}
