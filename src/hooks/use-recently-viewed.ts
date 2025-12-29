
"use client";

import { useState, useEffect } from "react";

export interface RecentFragrance {
    slug: string;
    name: string;
    brandName: string;
    imageUrl: string | null;
    timestamp: number;
}

const STORAGE_KEY = "sillage_recently_viewed";
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
    const [recentFragrances, setRecentFragrances] = useState<RecentFragrance[]>([]);

    useEffect(() => {
        // Load from local storage on mount
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRecentFragrances(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to parse recently viewed:", e);
        }
    }, []);

    const addFragrance = (fragrance: Omit<RecentFragrance, "timestamp">) => {
        try {
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as RecentFragrance[];

            // Remove if already exists to move it to the top
            const filtered = current.filter(item => item.slug !== fragrance.slug);

            // Add new item to the beginning
            const newItem: RecentFragrance = { ...fragrance, timestamp: Date.now() };
            const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setRecentFragrances(updated);
        } catch (e) {
            console.error("Failed to update recently viewed:", e);
        }
    };

    return {
        recentFragrances,
        addFragrance
    };
}
