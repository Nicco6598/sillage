import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBrandBySlug, getFragrancesByBrand } from "@/lib/fragrance-db";
import { FragranceCard } from "@/components/fragrance/fragrance-card";

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
                                            &quot;{brand.description}&quot;
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
                                <FragranceCard key={fragrance.id} fragrance={fragrance} variant="centered" />
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


