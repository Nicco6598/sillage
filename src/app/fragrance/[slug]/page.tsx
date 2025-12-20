import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star, Heart, Share2, Package, Calendar } from "lucide-react";
import { getFragranceBySlug, getFragranceReviews } from "@/lib/fragrance-db";
import { notFound } from "next/navigation";
import { ReviewAction } from "@/components/fragrance/review-action";
import { DynamicPerformance } from "@/components/fragrance/dynamic-performance";
import { SeasonVotes } from "@/components/fragrance/season-votes";
import { RecentlyViewedTracker } from "@/components/features/recently-viewed-tracker";
import { RecentlyViewed } from "@/components/features/recently-viewed";

interface FragrancePageProps {
    params: Promise<{ slug: string }>;
}

export default async function FragrancePage({ params }: FragrancePageProps) {
    const { slug } = await params;
    const fragrance = await getFragranceBySlug(slug);

    if (!fragrance) {
        notFound();
    }

    const reviews = await getFragranceReviews(fragrance.id);

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            <div className="container-page">
                {/* Breadcrumb */}
                <div className="flex items-center gap-3 mb-12">
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 text-sm text-text-muted hover:text-copper transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Esplora
                    </Link>
                    <span className="text-text-muted">/</span>
                    <Link
                        href={`/brands/${fragrance.brand.slug}`}
                        className="text-sm text-text-muted hover:text-copper transition-colors"
                    >
                        {fragrance.brand.name}
                    </Link>
                </div>

                {/* MAIN GRID */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* LEFT COLUMN: Image & Actions */}
                    <div className="lg:col-span-5">
                        {/* Bottle Image */}
                        <div className="aspect-[3/4] bg-bg-secondary border border-border-primary relative overflow-hidden mb-6 group rounded-sm ring-1 ring-inset ring-white/5">
                            {fragrance.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={fragrance.imageUrl}
                                    alt={fragrance.name}
                                    className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1/2 h-2/3 bg-gradient-to-br from-bg-tertiary to-bg-secondary opacity-50" />
                                </div>
                            )}

                            {fragrance.isNew && (
                                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-copper text-white">
                                    Novità
                                </span>
                            )}
                        </div>

                        {/* Collection Actions */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button className="py-4 border border-border-primary hover:border-copper hover:text-copper transition-colors flex flex-col items-center gap-2 group cursor-pointer">
                                <span className="text-xl">👃</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted group-hover:text-copper">
                                    Lo ho
                                </span>
                            </button>
                            <button className="py-4 border border-border-primary hover:border-rose-gold hover:text-rose-gold transition-colors flex flex-col items-center gap-2 group cursor-pointer">
                                <span className="text-xl">💖</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted group-hover:text-rose-gold">
                                    Lo voglio
                                </span>
                            </button>
                            <button className="py-4 border border-border-primary hover:border-gold hover:text-gold transition-colors flex flex-col items-center gap-2 group cursor-pointer">
                                <span className="text-xl">✅</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted group-hover:text-gold">
                                    Lo avevo
                                </span>
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 border border-border-primary hover:border-copper transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-copper">
                                <Share2 className="h-4 w-4" />
                                Condividi
                            </button>
                            <button className="flex-1 py-3 border border-border-primary hover:border-copper transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-copper">
                                <Heart className="h-4 w-4" />
                                Preferiti
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Info */}
                    <div className="lg:col-span-7">
                        {/* Header */}
                        <div className="mb-10">
                            <Link
                                href={`/brands/${fragrance.brand.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-text-muted hover:text-copper transition-colors mb-3"
                            >
                                {fragrance.brand.name}
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>
                            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4">
                                {fragrance.name}<span className="text-copper">.</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="px-3 py-1.5 bg-bg-tertiary border border-border-primary">
                                    {fragrance.concentration}
                                </span>
                                {fragrance.year && (
                                    <span className="px-3 py-1.5 bg-bg-tertiary border border-border-primary">
                                        {fragrance.year}
                                    </span>
                                )}
                                <span className="px-3 py-1.5 bg-bg-tertiary border border-border-primary capitalize">
                                    {fragrance.gender}
                                </span>
                            </div>
                        </div>

                        {/* Rating Card */}
                        <div className="p-6 bg-bg-secondary border border-border-primary mb-10">
                            <div className="flex items-center gap-8">
                                <div>
                                    <span className="block font-serif text-5xl text-copper">
                                        {fragrance.rating.toFixed(1)}
                                    </span>
                                    <div className="flex gap-0.5 mt-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i <= Math.round(fragrance.rating) ? 'text-copper fill-copper' : 'text-border-primary'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="pl-8 border-l border-border-primary">
                                    <span className="block text-3xl font-serif">{fragrance.reviewCount.toLocaleString()}</span>
                                    <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Voti</span>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Performance Stats */}
                        <DynamicPerformance
                            reviews={reviews}
                            defaultSillage={fragrance.sillage}
                            defaultLongevity={fragrance.longevity}
                            defaultPriceValue={fragrance.priceValue}
                        />

                        {/* Accords */}
                        {fragrance.accords.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-px bg-gold" />
                                    <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted">Accordi Principali</h3>
                                </div>
                                <div className="space-y-4">
                                    {fragrance.accords.slice(0, 5).map((accord) => (
                                        <div key={accord.name}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-serif italic capitalize text-lg">{accord.name}</span>
                                                <span className="text-xs font-mono text-text-muted">{accord.percentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-bg-tertiary overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-700"
                                                    style={{
                                                        width: `${accord.percentage}%`,
                                                        backgroundColor: accord.color
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes Pyramid */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-px bg-rose-gold" />
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted">Piramide Olfattiva</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Top Notes */}
                                <div className="p-5 border border-border-primary">
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-copper mb-4 pb-3 border-b border-border-primary">
                                        Testa
                                    </h4>
                                    <div className="space-y-2">
                                        {fragrance.notes.top.length > 0 ? (
                                            fragrance.notes.top.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="block text-sm text-text-secondary hover:text-copper transition-colors capitalize"
                                                >
                                                    {n.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm text-text-muted">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Heart Notes */}
                                <div className="p-5 border border-border-primary">
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-gold mb-4 pb-3 border-b border-border-primary">
                                        Cuore
                                    </h4>
                                    <div className="space-y-2">
                                        {fragrance.notes.heart.length > 0 ? (
                                            fragrance.notes.heart.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="block text-sm text-text-secondary hover:text-copper transition-colors capitalize"
                                                >
                                                    {n.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm text-text-muted">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Base Notes */}
                                <div className="p-5 border border-border-primary">
                                    <h4 className="text-xs font-mono uppercase tracking-widest text-rose-gold mb-4 pb-3 border-b border-border-primary">
                                        Fondo
                                    </h4>
                                    <div className="space-y-2">
                                        {fragrance.notes.base.length > 0 ? (
                                            fragrance.notes.base.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="block text-sm text-text-secondary hover:text-copper transition-colors capitalize"
                                                >
                                                    {n.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm text-text-muted">—</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Season Votes */}
                        <SeasonVotes reviews={reviews} />
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-24 mb-32">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-border-primary">
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block w-8 h-px bg-copper" />
                            <h2 className="font-serif text-3xl md:text-4xl">Recensioni</h2>
                            <span className="text-sm text-text-muted">({reviews.length})</span>
                        </div>
                        <ReviewAction
                            fragranceId={fragrance.id}
                            fragranceSlug={fragrance.slug}
                            fragranceName={fragrance.name}
                        />
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-16 bg-bg-secondary border border-border-primary">
                            <p className="text-text-secondary mb-4">Nessuna recensione ancora.</p>
                            <p className="font-serif text-2xl">Sii il primo a recensire {fragrance.name}!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border border-border-primary p-6 hover:border-copper/30 transition-colors">
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-bg-tertiary border border-border-primary flex items-center justify-center text-xl uppercase font-serif">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{review.userName}</p>
                                                <p className="text-xs text-text-muted font-mono">
                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('it-IT', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-serif text-xl text-copper mr-2">{Number(review.rating).toFixed(1)}</span>
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i <= Math.round(Number(review.rating) || 0)
                                                        ? "fill-copper text-copper"
                                                        : "text-border-primary"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Batch Info */}
                                    {(review.batchCode || review.productionDate) && (
                                        <div className="flex items-center gap-4 mb-4 p-3 bg-bg-tertiary/50 border border-border-primary">
                                            {review.batchCode && (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gold" />
                                                    <span className="text-xs font-mono uppercase tracking-wider">
                                                        Batch: <span className="text-text-primary">{review.batchCode}</span>
                                                    </span>
                                                </div>
                                            )}
                                            {review.productionDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-rose-gold" />
                                                    <span className="text-xs font-mono uppercase tracking-wider">
                                                        Prod: <span className="text-text-primary">{review.productionDate}</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Comment */}
                                    {review.comment && (
                                        <p className="text-text-secondary leading-relaxed mb-6">
                                            "{review.comment}"
                                        </p>
                                    )}

                                    {/* Detailed Ratings */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {review.sillage && (
                                            <div className="p-3 bg-bg-secondary text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Sillage</p>
                                                <p className="text-lg font-mono text-copper">{review.sillage}<span className="text-text-muted text-sm">/5</span></p>
                                            </div>
                                        )}
                                        {review.longevity && (
                                            <div className="p-3 bg-bg-secondary text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Longevità</p>
                                                <p className="text-lg font-mono text-gold">{review.longevity}<span className="text-text-muted text-sm">/5</span></p>
                                            </div>
                                        )}
                                        {review.genderVote && (
                                            <div className="p-3 bg-bg-secondary text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Genere</p>
                                                <p className="text-sm capitalize">{review.genderVote}</p>
                                            </div>
                                        )}
                                        {review.seasonVote && (
                                            <div className="p-3 bg-bg-secondary text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Stagione</p>
                                                <p className="text-sm capitalize">{review.seasonVote.replace(/,/g, ', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <RecentlyViewedTracker
                slug={fragrance.slug}
                name={fragrance.name}
                brandName={fragrance.brand.name}
                imageUrl={fragrance.imageUrl}
            />

            <RecentlyViewed />
        </div>
    );
}
