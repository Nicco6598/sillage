
"use client";

import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function RecentlyViewed() {
    const { recentFragrances } = useRecentlyViewed();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return nothing during SSR or if no items
    if (!mounted || recentFragrances.length === 0) {
        return null;
    }

    return (
        <div className="w-full border-t border-border-primary">
            <div className="container-page py-12">
                <div className="flex items-center gap-3 mb-8">
                    <Clock className="w-5 h-5 text-text-muted" />
                    <h3 className="font-serif text-xl">Visti di Recente</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {recentFragrances.map((fragrance) => (
                        <Link
                            key={fragrance.slug}
                            href={`/fragrance/${fragrance.slug}`}
                            className="group block p-4 border border-transparent hover:border-border-primary hover:bg-bg-secondary transition-all"
                        >
                            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1 truncate">
                                {fragrance.brandName}
                            </p>
                            <p className="font-medium text-sm truncate group-hover:text-text-secondary transition-colors">
                                {fragrance.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
