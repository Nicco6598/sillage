"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

/**
 * Minimal theme toggle button
 */
export function ThemeToggle() {
    const { resolvedTheme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-tertiary"
                aria-label="Toggle theme"
            >
                <div className="h-4 w-4 animate-pulse rounded bg-text-muted" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "text-text-tertiary transition-colors duration-200",
                "hover:bg-bg-tertiary hover:text-text-primary"
            )}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
        >
            <Sun
                className={cn(
                    "absolute h-4 w-4 transition-all duration-300",
                    resolvedTheme === "dark"
                        ? "rotate-0 scale-100 opacity-100"
                        : "rotate-90 scale-0 opacity-0"
                )}
            />
            <Moon
                className={cn(
                    "absolute h-4 w-4 transition-all duration-300",
                    resolvedTheme === "light"
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                )}
            />
        </button>
    );
}
