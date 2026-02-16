import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { getFragranceBySlug, getFragranceReviews, getManualSimilarities, getUserSimilarityVotes } from "@/lib/fragrance-db";
import { notFound } from "next/navigation";
import { ReviewAction } from "@/components/fragrance/review-action";
import { DynamicPerformance } from "@/components/fragrance/dynamic-performance";
import { SeasonVotes } from "@/components/fragrance/season-votes";
import { RecentlyViewedTracker } from "@/components/features/recently-viewed-tracker";
import { RecentlyViewed } from "@/components/features/recently-viewed";
import { CollectionActions } from "@/components/fragrance/collection-actions";
import { ReviewsList } from "@/components/fragrance/reviews-list";
import { createClient } from "@/lib/supabase/server";
import { FragranceSimilarities } from "@/components/fragrance/fragrance-similarities";

interface FragrancePageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function FragrancePage({ params }: FragrancePageProps) {
    const { slug } = await params;
    const fragrance = await getFragranceBySlug(slug);

    if (!fragrance) {
        notFound();
    }

    const reviews = await getFragranceReviews(fragrance.id);

    // Get current user for review ownership
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || null;

    const manualSimilarities = await getManualSimilarities(fragrance.id);
    let similaritiesWithUserVotes = manualSimilarities;

    if (currentUserId) {
        const userVotes = await getUserSimilarityVotes(fragrance.id, currentUserId);
        similaritiesWithUserVotes = manualSimilarities.map(s => ({
            ...s,
            userVote: userVotes[s.similarityId] || undefined
        }));
    }

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
                        <div className="aspect-[3/4] bg-bg-secondary border border-border-primary relative overflow-hidden mb-6 group shadow-soft hover:shadow-elevated transition-all duration-300">
                            {/* Depth gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none z-10" />

                            {fragrance.imageUrl ? (
                                <Image
                                    src={fragrance.imageUrl}
                                    alt={fragrance.name}
                                    fill
                                    priority
                                    className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1/2 h-2/3 bg-gradient-to-br from-bg-tertiary to-bg-secondary opacity-50" />
                                </div>
                            )}

                            {fragrance.isNew && (
                                <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-copper text-white shadow-subtle z-20">
                                    Novità
                                </span>
                            )}
                        </div>

                        {/* Collection Actions - Interactive Component */}
                        <CollectionActions fragranceId={fragrance.id} />
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
                        <div className="p-6 bg-bg-secondary border border-border-primary mb-10 shadow-soft relative overflow-hidden">
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />

                            <div className="flex items-center gap-8 relative z-10">
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

                        {/* Notes Pyramid - Enhanced Visual */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-px bg-rose-gold" />
                                <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted">Piramide Olfattiva</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Top Notes */}
                                <div className="p-5 border border-border-primary shadow-soft relative overflow-hidden bg-bg-secondary">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-primary relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-copper/10 border border-copper/30 flex items-center justify-center">
                                            <span className="text-[10px] font-mono text-copper font-bold">T</span>
                                        </div>
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-copper">
                                            Testa
                                        </h4>
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        {fragrance.notes.top.length > 0 ? (
                                            fragrance.notes.top.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-bg-tertiary border border-border-primary group-hover:border-copper group-hover:bg-copper/10 transition-all duration-300 flex items-center justify-center flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-copper/50 group-hover:bg-copper transition-colors" />
                                                    </div>
                                                    <span className="text-sm text-text-secondary group-hover:text-copper transition-colors capitalize">
                                                        {n.name}
                                                    </span>
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm text-text-muted">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Heart Notes */}
                                <div className="p-5 border border-border-primary shadow-soft relative overflow-hidden bg-bg-secondary">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-primary relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                            <span className="text-[10px] font-mono text-gold font-bold">C</span>
                                        </div>
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-gold">
                                            Cuore
                                        </h4>
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        {fragrance.notes.heart.length > 0 ? (
                                            fragrance.notes.heart.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-bg-tertiary border border-border-primary group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300 flex items-center justify-center flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" />
                                                    </div>
                                                    <span className="text-sm text-text-secondary group-hover:text-gold transition-colors capitalize">
                                                        {n.name}
                                                    </span>
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-sm text-text-muted">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Base Notes */}
                                <div className="p-5 border border-border-primary shadow-soft relative overflow-hidden bg-bg-secondary">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border-primary relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-rose-gold/10 border border-rose-gold/30 flex items-center justify-center">
                                            <span className="text-[10px] font-mono text-rose-gold font-bold">F</span>
                                        </div>
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-rose-gold">
                                            Fondo
                                        </h4>
                                    </div>
                                    <div className="space-y-3 relative z-10">
                                        {fragrance.notes.base.length > 0 ? (
                                            fragrance.notes.base.map(n => (
                                                <Link
                                                    key={n.id}
                                                    href={`/explore?note=${n.name}`}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-bg-tertiary border border-border-primary group-hover:border-rose-gold group-hover:bg-rose-gold/10 transition-all duration-300 flex items-center justify-center flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-rose-gold/50 group-hover:bg-rose-gold transition-colors" />
                                                    </div>
                                                    <span className="text-sm text-text-secondary group-hover:text-rose-gold transition-colors capitalize">
                                                        {n.name}
                                                    </span>
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

                {/* Fragrance Similarities Section */}
                <div className="mt-16">
                    <FragranceSimilarities
                        fragranceId={fragrance.id}
                        fragranceSlug={fragrance.slug}
                        fragranceName={fragrance.name}
                        initialSimilarities={similaritiesWithUserVotes}
                        userId={currentUserId}
                    />
                </div>

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
                        <ReviewsList
                            reviews={reviews}
                            currentUserId={currentUserId}
                            fragranceId={fragrance.id}
                            fragranceSlug={fragrance.slug}
                            fragranceName={fragrance.name}
                        />
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
