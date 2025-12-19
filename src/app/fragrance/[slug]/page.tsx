import Link from "next/link";
import { ArrowRight, Star, Share2, Heart, Clock, Wind, User } from "lucide-react";
import { getFragranceBySlug, getFragranceReviews } from "@/lib/fragrance-db";
import { notFound } from "next/navigation";
import { ReviewAction } from "@/components/fragrance/review-action";
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
        <div className="w-full min-h-screen pt-40 pb-24">
            <div className="container-page">
                {/* HEADER */}
                <div className="flex flex-col items-center text-center mb-16">
                    <Link
                        href={`/brands/${fragrance.brand.slug}`}
                        className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors mb-4"
                    >
                        {fragrance.brand.name}
                    </Link>
                    <h1 className="font-serif text-5xl md:text-7xl mb-4">{fragrance.name}</h1>
                    <span className="text-lg text-text-secondary font-medium tracking-wide">
                        {fragrance.concentration}
                        {fragrance.year && ` • ${fragrance.year}`}
                    </span>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
                    {/* LEFT: VISUAL & ACTIONS */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        {/* Bottle Image */}
                        <div className="aspect-[3/4] bg-bg-tertiary relative overflow-hidden flex items-center justify-center">
                            <div className="text-9xl opacity-10 font-serif absolute">img</div>
                            <div className="w-2/3 h-3/4 bg-gradient-to-br from-stone-100 to-stone-300 dark:from-stone-800 dark:to-stone-900 shadow-2xl z-10" />
                        </div>

                        {/* Collection Actions */}
                        <div className="grid grid-cols-3 gap-2">
                            <button className="py-3 px-2 border border-border-primary hover:bg-bg-secondary text-xs uppercase tracking-widest font-medium transition-colors flex flex-col items-center gap-1 cursor-pointer">
                                <span className="text-lg">👃</span>
                                <span>Lo ho</span>
                            </button>
                            <button className="py-3 px-2 border border-border-primary hover:bg-bg-secondary text-xs uppercase tracking-widest font-medium transition-colors flex flex-col items-center gap-1 cursor-pointer">
                                <span className="text-lg">💖</span>
                                <span>Lo voglio</span>
                            </button>
                            <button className="py-3 px-2 border border-border-primary hover:bg-bg-secondary text-xs uppercase tracking-widest font-medium transition-colors flex flex-col items-center gap-1 cursor-pointer">
                                <span className="text-lg">✅</span>
                                <span>Lo avevo</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: DATA & COMMUNITY */}
                    <div className="lg:col-span-7">
                        {/* Rating Bar */}
                        <div className="flex items-center gap-6 mb-12 p-6 bg-bg-secondary border border-border-primary">
                            <div className="text-center px-4 border-r border-border-primary">
                                <span className="block text-4xl font-serif">{fragrance.rating.toFixed(1)}</span>
                                <div className="flex text-accent text-xs mt-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                                    Basato su {fragrance.reviewCount.toLocaleString()} voti
                                </p>
                                <div className="text-sm text-text-primary font-medium">
                                    Genere: <span className="text-text-secondary capitalize">{fragrance.gender}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-bg-tertiary rounded-full transition-colors cursor-pointer group">
                                    <Share2 className="h-5 w-5 text-text-secondary group-hover:text-text-primary" />
                                </button>
                                <button className="p-2 hover:bg-bg-tertiary rounded-full transition-colors cursor-pointer group">
                                    <Heart className="h-5 w-5 text-text-secondary group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        </div>

                        {/* Accords */}
                        {fragrance.accords.length > 0 && (
                            <div className="mb-12">
                                <h3 className="font-serif text-2xl mb-6 border-b border-border-primary pb-2">Accordi Principali</h3>
                                <div className="space-y-3">
                                    {fragrance.accords.map((accord) => (
                                        <div key={accord.name} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium">{accord.name}</span>
                                                    <span className="text-xs text-text-muted">{accord.percentage}%</span>
                                                </div>
                                                <div className="h-2 bg-bg-tertiary overflow-hidden">
                                                    <div
                                                        className="h-full transition-all duration-1000"
                                                        style={{
                                                            width: `${accord.percentage}%`,
                                                            backgroundColor: accord.color
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes Pyramid */}
                        <div className="mb-16">
                            <h3 className="font-serif text-2xl mb-8 border-b border-border-primary pb-2">Piramide Olfattiva</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                                <div>
                                    <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-3">Testa</h4>
                                    <ul className="space-y-1">
                                        {fragrance.notes.top.map(n => (
                                            <li key={n.id} className="text-sm bg-bg-secondary inline-block px-2 py-1 mr-2 mb-2 md:block md:w-full md:mr-0 md:bg-transparent md:px-0 md:py-0">
                                                {n.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-3">Cuore</h4>
                                    <ul className="space-y-1">
                                        {fragrance.notes.heart.map(n => (
                                            <li key={n.id} className="text-sm bg-bg-secondary inline-block px-2 py-1 mr-2 mb-2 md:block md:w-full md:mr-0 md:bg-transparent md:px-0 md:py-0">
                                                {n.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-mono text-xs uppercase tracking-widest text-text-muted mb-3">Fondo</h4>
                                    <ul className="space-y-1">
                                        {fragrance.notes.base.map(n => (
                                            <li key={n.id} className="text-sm bg-bg-secondary inline-block px-2 py-1 mr-2 mb-2 md:block md:w-full md:mr-0 md:bg-transparent md:px-0 md:py-0">
                                                {n.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Community Stats */}
                        <div className="bg-bg-secondary p-8 border border-border-primary">
                            <h3 className="font-serif text-2xl mb-8">Statistiche Community</h3>

                            <div className="space-y-8">
                                {/* Longevity */}
                                <div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" /> Longevità
                                        </span>
                                        <span>{fragrance.longevity}/5</span>
                                    </div>
                                    <div className="h-2 bg-text-muted/20 w-full overflow-hidden">
                                        <div
                                            className="h-full bg-text-primary transition-all duration-1000"
                                            style={{ width: `${(fragrance.longevity / 5) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                                        <span>Debole</span>
                                        <span>Eterna</span>
                                    </div>
                                </div>

                                {/* Sillage */}
                                <div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
                                        <span className="flex items-center gap-2">
                                            <Wind className="h-4 w-4" /> Sillage
                                        </span>
                                        <span>{fragrance.sillage}/5</span>
                                    </div>
                                    <div className="h-2 bg-text-muted/20 w-full overflow-hidden">
                                        <div
                                            className="h-full bg-text-primary transition-all duration-1000"
                                            style={{ width: `${(fragrance.sillage / 5) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                                        <span>Intimo</span>
                                        <span>Enorme</span>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest mb-2">
                                        <span className="flex items-center gap-2">
                                            <User className="h-4 w-4" /> Genere
                                        </span>
                                        <span className="capitalize">{fragrance.gender}</span>
                                    </div>
                                    <div className="h-2 bg-text-muted/20 w-full overflow-hidden relative">
                                        {/* Center marker */}
                                        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-bg-primary z-10" />
                                        <div
                                            className="h-full bg-text-primary transition-all duration-1000"
                                            style={{
                                                width: fragrance.gender === "masculine" ? "90%" :
                                                    fragrance.gender === "feminine" ? "10%" : "50%"
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                                        <span>Femminile</span>
                                        <span>Unisex</span>
                                        <span>Maschile</span>
                                    </div>
                                </div>

                                {/* Seasons */}
                                <div>
                                    <div className="flex justify-between text-xs uppercase tracking-widest mb-4">
                                        <span>Stagioni Consigliate</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { season: "spring", label: "Primavera", icon: "🌸" },
                                            { season: "summer", label: "Estate", icon: "☀️" },
                                            { season: "autumn", label: "Autunno", icon: "🍂" },
                                            { season: "winter", label: "Inverno", icon: "❄️" },
                                        ].map(({ season, label, icon }) => {
                                            const isActive = fragrance.seasons.includes(season as any);
                                            return (
                                                <div
                                                    key={season}
                                                    className={`flex flex-col items-center gap-1 p-3 border transition-all ${isActive
                                                        ? "border-text-primary bg-bg-primary"
                                                        : "border-border-primary opacity-30"
                                                        }`}
                                                >
                                                    <span className="text-2xl">{icon}</span>
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-center">
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <div className="mt-24 border-t border-border-primary pt-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <h2 className="font-serif text-4xl">Recensioni ({reviews.length})</h2>
                        <ReviewAction
                            fragranceId={fragrance.id}
                            fragranceSlug={fragrance.slug}
                            fragranceName={fragrance.name}
                        />
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-bg-secondary border border-border-primary">
                            <p className="text-text-secondary mb-4">Nessuna recensione ancora.</p>
                            <p className="font-serif text-xl">Sii il primo a dire la tua su {fragrance.name}!</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-border-primary pb-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-xl uppercase font-serif">
                                                {review.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{review.userName}</p>
                                                <p className="text-xs text-text-muted font-mono">
                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i <= (review.rating || 0)
                                                        ? "fill-current text-accent"
                                                        : "text-border-primary"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <p className="text-text-secondary leading-relaxed mb-4">
                                            {review.comment}
                                        </p>
                                    )}

                                    {/* Detailed Ratings */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-bg-secondary">
                                        {review.sillage && (
                                            <div className="text-center">
                                                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Sillage</p>
                                                <p className="text-lg font-mono">{review.sillage}/5</p>
                                            </div>
                                        )}
                                        {review.longevity && (
                                            <div className="text-center">
                                                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Longevità</p>
                                                <p className="text-lg font-mono">{review.longevity}/5</p>
                                            </div>
                                        )}
                                        {review.genderVote && (
                                            <div className="text-center">
                                                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Genere</p>
                                                <p className="text-sm capitalize">{review.genderVote}</p>
                                            </div>
                                        )}
                                        {review.seasonVote && (
                                            <div className="text-center">
                                                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Stagione</p>
                                                <p className="text-sm capitalize">{review.seasonVote}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                    <button className="group flex items-center gap-4 text-sm uppercase tracking-widest border-b border-text-primary pb-1 hover:text-text-secondary transition-colors mx-auto cursor-pointer">
                        Carica altre recensioni
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            <RecentlyViewedTracker
                slug={fragrance.slug}
                name={fragrance.name}
                brandName={fragrance.brand.name}
            />

            <RecentlyViewed />
        </div>
    );
}
