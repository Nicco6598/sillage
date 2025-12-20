import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { getBrandBySlug, getFragrancesByBrand } from "@/lib/fragrance-db";
import type { Fragrance } from "@/types/fragrance";

interface BrandPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);

    if (!brand) {
        notFound();
    }

    const fragrances = await getFragrancesByBrand(slug);

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            <div className="container-page">
                {/* Breadcrumb */}
                <div className="flex items-center gap-3 mb-16">
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 text-sm text-text-muted hover:text-copper transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Esplora
                    </Link>
                    <span className="text-text-muted">/</span>
                    <span className="text-text-secondary">{brand.name}</span>
                </div>

                {/* Brand Header */}
                <div className="mb-24">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                        {/* Left Side: Brand Name & Stats */}
                        <div className="flex-1">
                            {/* Brand Name */}
                            <h1 className="font-serif text-6xl md:text-8xl tracking-tight mb-6">
                                {brand.name}<span className="text-copper">.</span>
                            </h1>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                <div className="px-4 py-2 bg-bg-tertiary border border-border-primary text-xs font-mono uppercase tracking-widest text-text-muted">
                                    {brand.country && <span>{brand.country} • </span>}
                                    {brand.fragranceCount} Fragranze
                                </div>
                            </div>
                            {/* Description & History */}
                            <div className="space-y-8 max-w-2xl">
                                {brand.description && (
                                    <div className="relative border-l-2 border-copper pl-6 py-2">
                                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-serif italic opacity-90">
                                            "{brand.description}"
                                        </p>
                                    </div>
                                )}

                                {brand.history && (
                                    <div className="text-base text-text-muted leading-relaxed font-sans">
                                        <p>{brand.history}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fragrances Grid */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-px bg-copper" />
                        <h2 className="font-serif text-3xl">La Collezione</h2>
                        <span className="text-sm text-text-muted">({fragrances.length})</span>
                    </div>

                    {fragrances.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                            {fragrances.map((fragrance) => (
                                <BrandFragranceCard key={fragrance.id} fragrance={fragrance} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-bg-secondary border border-border-primary">
                            <p className="text-text-muted mb-2">Nessuna fragranza trovata per questo brand.</p>
                            <p className="font-serif text-xl">Torna in esplorazione</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Fragrance Card Component (Matching Explore Page Style)
function BrandFragranceCard({ fragrance }: { fragrance: Fragrance }) {
    return (
        <Link
            href={`/fragrance/${fragrance.slug}`}
            className="group block"
        >
            <div className="relative overflow-hidden bg-bg-tertiary aspect-[3/4] mb-5 group/image ring-1 ring-inset ring-white/10 rounded-sm">
                {fragrance.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={fragrance.imageUrl}
                        alt={fragrance.name}
                        className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-bg-tertiary" />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-bg-primary/90 backdrop-blur-sm text-xs font-mono opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    {fragrance.rating.toFixed(1)}
                </div>

                {/* View Arrow */}
                <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-copper text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* New Badge */}
                {fragrance.isNew && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-gold text-[10px] font-mono uppercase tracking-wider text-white">
                        New
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-1 text-center">
                <h3 className="font-medium text-lg leading-tight line-clamp-1 group-hover:text-copper transition-colors duration-300">
                    {fragrance.name}
                </h3>
                <p className="text-xs text-text-muted uppercase tracking-widest line-clamp-1">
                    {fragrance.concentration}
                    {fragrance.year && <span className="text-text-tertiary"> · {fragrance.year}</span>}
                </p>
            </div>
        </Link>
    );
}
