
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function RecentlyViewed() {
    const { recentFragrances } = useRecentlyViewed();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Return nothing during SSR or if no items
    if (!mounted || recentFragrances.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-bg-secondary/30 border-t border-border-primary overflow-hidden">
            <div className="container-page py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 flex items-center justify-center bg-bg-tertiary border border-border-primary text-copper rotate-3 transition-transform group-hover:rotate-0">
                            <Clock className="w-6 h-6 -rotate-3" />
                        </div>
                        <div>
                            <h3 className="font-serif text-3xl md:text-4xl">Visti di Recente</h3>
                            <p className="text-xs font-mono uppercase tracking-[0.2em] text-text-muted mt-2">Le tue ultime esplorazioni olfattive</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
                    {recentFragrances.map((fragrance) => (
                        <Link
                            key={fragrance.slug}
                            href={`/fragrance/${fragrance.slug}`}
                            className="group relative flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] bg-bg-tertiary border border-border-primary overflow-hidden transition-all duration-700 group-hover:border-copper/40 group-hover:shadow-2xl group-hover:shadow-copper/5 ring-1 ring-inset ring-white/5 rounded-sm">
                                {fragrance.imageUrl ? (
                                    <Image
                                        src={fragrance.imageUrl}
                                        alt={fragrance.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                        className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary opacity-40">
                                        <span className="text-3xl filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">🌸</span>
                                    </div>
                                )}

                                {/* Refined Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

                                {/* View Action Button */}
                                <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-copper text-white opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-5 space-y-1.5 px-0.5">
                                <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em] line-clamp-1 transition-colors group-hover:text-copper">
                                    {fragrance.brandName}
                                </p>
                                <h4 className="font-serif text-base line-clamp-1 group-hover:translate-x-1 transition-transform duration-500">
                                    {fragrance.name}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
