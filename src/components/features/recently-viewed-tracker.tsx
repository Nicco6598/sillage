
"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface RecentlyViewedTrackerProps {
    slug: string;
    name: string;
    brandName: string;
}

export function RecentlyViewedTracker({ slug, name, brandName }: RecentlyViewedTrackerProps) {
    const { addFragrance } = useRecentlyViewed();

    useEffect(() => {
        if (slug && name && brandName) {
            addFragrance({ slug, name, brandName });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]); // track when slug changes

    return null; // This component renders nothing
}
