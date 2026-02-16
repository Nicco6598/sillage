"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

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
    const [pendingKey, setPendingKey] = useState<string | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentKey = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const lastKeyRef = useRef(currentKey);

    useEffect(() => {
        lastKeyRef.current = currentKey;
    }, [currentKey]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href) {
                const url = new URL(anchor.href, window.location.origin);
                const destination = `${url.pathname}${url.search}`;
                const current = `${window.location.pathname}${window.location.search}`;

                if (
                    url.origin === window.location.origin &&
                    destination !== current &&
                    !anchor.target &&
                    !anchor.download &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    !e.shiftKey
                ) {
                    setPendingKey(current);
                    setIsLoading(true);
                }
            }
        };

        const handlePopState = () => {
            setPendingKey(lastKeyRef.current);
            setIsLoading(true);
        };

        document.addEventListener("click", handleClick);
        window.addEventListener("popstate", handlePopState);

        return () => {
            document.removeEventListener("click", handleClick);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    useEffect(() => {
        if (!isLoading || !pendingKey) return;
        if (currentKey === pendingKey) return;
        const timer = setTimeout(() => {
            setIsLoading(false);
            setPendingKey(null);
        }, 250);
        return () => clearTimeout(timer);
    }, [currentKey, isLoading, pendingKey]);

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => {
            setIsLoading(false);
            setPendingKey(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (!isLoading) return null;

    return <PerfumeLoader />;
}
