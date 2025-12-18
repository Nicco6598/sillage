"use client";

import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

/**
 * Custom hook for managing theme state
 * Persists to localStorage and syncs with system preference
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>("system");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    // Get system preference
    const getSystemTheme = useCallback((): "light" | "dark" => {
        if (typeof window === "undefined") return "light";
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }, []);

    // Resolve theme based on current setting
    const resolveTheme = useCallback(
        (themeValue: Theme): "light" | "dark" => {
            if (themeValue === "system") {
                return getSystemTheme();
            }
            return themeValue;
        },
        [getSystemTheme]
    );

    // Apply theme to document
    const applyTheme = useCallback((resolvedValue: "light" | "dark") => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(resolvedValue);
        setResolvedTheme(resolvedValue);
    }, []);

    // Initialize theme from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("sillage-theme") as Theme | null;
        const initialTheme = stored || "system";
        setThemeState(initialTheme);
        applyTheme(resolveTheme(initialTheme));
        setMounted(true);
    }, [applyTheme, resolveTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = () => {
            if (theme === "system") {
                applyTheme(getSystemTheme());
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [mounted, theme, applyTheme, getSystemTheme]);

    // Set theme function
    const setTheme = useCallback(
        (newTheme: Theme) => {
            setThemeState(newTheme);
            localStorage.setItem("sillage-theme", newTheme);
            applyTheme(resolveTheme(newTheme));
        },
        [applyTheme, resolveTheme]
    );

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const newTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
    }, [resolvedTheme, setTheme]);

    return {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        mounted,
    };
}
