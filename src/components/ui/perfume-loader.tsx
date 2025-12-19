"use client";

import { useEffect, useState } from "react";

/**
 * PerfumeLoader - An elegant loading animation featuring a perfume bottle spraying
 * Designed to match the Sillage "Stone & Silk" design system
 */
export function PerfumeLoader() {
    const [isVisible] = useState(true);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            {/* Perfume Bottle SVG with Spray Animation */}
            <div className="relative mb-6">
                <svg
                    width="80"
                    height="120"
                    viewBox="0 0 80 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-pulse"
                >
                    {/* Bottle Cap */}
                    <rect
                        x="30"
                        y="8"
                        width="20"
                        height="12"
                        rx="2"
                        className="fill-accent"
                    />

                    {/* Bottle Neck */}
                    <rect
                        x="34"
                        y="20"
                        width="12"
                        height="15"
                        className="fill-border-secondary dark:fill-border-secondary"
                    />

                    {/* Bottle Body */}
                    <path
                        d="M20 40 C20 35, 60 35, 60 40 L60 100 C60 108, 20 108, 20 100 Z"
                        className="fill-bg-tertiary stroke-accent"
                        strokeWidth="2"
                    />

                    {/* Liquid Inside */}
                    <path
                        d="M24 55 C24 52, 56 52, 56 55 L56 98 C56 104, 24 104, 24 98 Z"
                        className="fill-gold/30"
                    />

                    {/* Highlight on Bottle */}
                    <ellipse
                        cx="35"
                        cy="70"
                        rx="5"
                        ry="20"
                        className="fill-white/20"
                    />

                    {/* Spray Nozzle */}
                    <rect
                        x="36"
                        y="2"
                        width="8"
                        height="8"
                        rx="1"
                        className="fill-accent"
                    />
                </svg>

                {/* Spray Particles Animation */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    {/* Particle 1 */}
                    <div
                        className="absolute w-1.5 h-1.5 rounded-full bg-gold/60 animate-spray-1"
                        style={{ left: "0px", top: "0px" }}
                    />
                    {/* Particle 2 */}
                    <div
                        className="absolute w-1 h-1 rounded-full bg-copper/50 animate-spray-2"
                        style={{ left: "-8px", top: "4px" }}
                    />
                    {/* Particle 3 */}
                    <div
                        className="absolute w-2 h-2 rounded-full bg-rose-gold/40 animate-spray-3"
                        style={{ left: "8px", top: "2px" }}
                    />
                    {/* Particle 4 */}
                    <div
                        className="absolute w-1 h-1 rounded-full bg-gold/70 animate-spray-4"
                        style={{ left: "-4px", top: "-2px" }}
                    />
                    {/* Particle 5 */}
                    <div
                        className="absolute w-1.5 h-1.5 rounded-full bg-accent/50 animate-spray-5"
                        style={{ left: "4px", top: "6px" }}
                    />
                </div>
            </div>

            {/* Brand Text */}
            <p className="font-serif text-xl tracking-[0.3em] text-text-secondary uppercase">
                Sillage
            </p>

            {/* Loading Text */}
            <p className="mt-2 text-xs tracking-[0.2em] text-text-muted uppercase animate-pulse">
                Caricamento...
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
        const handleStart = () => setIsLoading(true);
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
        window.addEventListener("popstate", handleStart);

        return () => {
            document.removeEventListener("click", handleClick);
            window.removeEventListener("load", handleComplete);
            window.removeEventListener("popstate", handleStart);
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
