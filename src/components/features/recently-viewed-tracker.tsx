
"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface RecentlyViewedTrackerProps {
    slug: string;
    name: string;
    brandName: string;
    imageUrl: string | null;
}

export function RecentlyViewedTracker({ slug, name, brandName, imageUrl }: RecentlyViewedTrackerProps) {
    const { addFragrance } = useRecentlyViewed();

    useEffect(() => {
        if (slug && name && brandName) {
            addFragrance({ slug, name, brandName, imageUrl });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, imageUrl]); // track when slug or image changes

    return null; // This component renders nothing
}
