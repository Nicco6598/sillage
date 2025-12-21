import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, Heart, Star, Edit3, Calendar, Mail, ArrowRight, Clock, Package, Camera } from "lucide-react";
import { QuickAddToCollection } from "@/components/profile/quick-add-to-collection";
import { db } from "@/lib/db";
import { reviews, userCollection, userFavorites, fragrances, brands } from "@/lib/db-schema";
import { eq, desc, sql, and } from "drizzle-orm";

async function getUserStats(userId: string) {
    const [reviewCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(reviews)
        .where(eq(reviews.userId, userId));

    const [favoriteCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userFavorites)
        .where(eq(userFavorites.userId, userId));

    const [collectionCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(userCollection)
        .where(and(
            eq(userCollection.userId, userId),
            eq(userCollection.notes, 'owned') // Only count "Lo ho" items
        ));

    return {
        reviews: Number(reviewCount?.count || 0),
        favorites: Number(favoriteCount?.count || 0),
        collection: Number(collectionCount?.count || 0),
    };
}

async function getUserRecentActivity(userId: string) {
    // Get recent reviews (new)
    const recentReviews = await db
        .select({
            id: reviews.id,
            fragranceId: reviews.fragranceId,
            fragranceSlug: fragrances.slug,
            fragranceName: fragrances.name,
            brandName: brands.name,
            rating: reviews.rating,
            createdAt: reviews.createdAt,
            updatedAt: reviews.updatedAt,
        })
        .from(reviews)
        .leftJoin(fragrances, eq(reviews.fragranceId, fragrances.id))
        .leftJoin(brands, eq(fragrances.brandId, brands.id))
        .where(eq(reviews.userId, userId))
        .orderBy(desc(reviews.createdAt))
        .limit(5);

    // Get recent favorites
    const recentFavorites = await db
        .select({
            id: userFavorites.id,
            fragranceId: userFavorites.fragranceId,
            fragranceSlug: fragrances.slug,
            fragranceName: fragrances.name,
            brandName: brands.name,
            createdAt: userFavorites.createdAt,
        })
        .from(userFavorites)
        .leftJoin(fragrances, eq(userFavorites.fragranceId, fragrances.id))
        .leftJoin(brands, eq(fragrances.brandId, brands.id))
        .where(eq(userFavorites.userId, userId))
        .orderBy(desc(userFavorites.createdAt))
        .limit(3);

    // Build activities list
    type ActivityType = 'review' | 'review_edit' | 'favorite';
    const activities: {
        type: ActivityType;
        id: string;
        fragranceName: string;
        fragranceSlug: string | null;
        brandName: string;
        rating?: number;
        createdAt: Date | null;
    }[] = [];

    // Add reviews (both new and edited)
    for (const r of recentReviews) {
        // Add original review
        activities.push({
            type: 'review',
            id: r.id,
            fragranceName: r.fragranceName || 'Fragranza',
            fragranceSlug: r.fragranceSlug,
            brandName: r.brandName || '',
            rating: r.rating ? Number(r.rating) : undefined,
            createdAt: r.createdAt,
        });

        // If edited, add an edit activity too
        if (r.updatedAt && r.createdAt && new Date(r.updatedAt).getTime() > new Date(r.createdAt).getTime()) {
            activities.push({
                type: 'review_edit',
                id: `${r.id}-edit`,
                fragranceName: r.fragranceName || 'Fragranza',
                fragranceSlug: r.fragranceSlug,
                brandName: r.brandName || '',
                rating: r.rating ? Number(r.rating) : undefined,
                createdAt: r.updatedAt,
            });
        }
    }

    // Add favorites
    for (const f of recentFavorites) {
        activities.push({
            type: 'favorite',
            id: f.id,
            fragranceName: f.fragranceName || 'Fragranza',
            fragranceSlug: f.fragranceSlug,
            brandName: f.brandName || '',
            createdAt: f.createdAt,
        });
    }

    // Sort by date and take top 5
    activities.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    return activities.slice(0, 5);
}

async function getUserCollection(userId: string) {
    const collection = await db
        .select({
            id: userCollection.id,
            fragranceId: userCollection.fragranceId,
            fragranceName: fragrances.name,
            brandName: brands.name,
            imageUrl: fragrances.imageUrl,
            slug: fragrances.slug,
            size: userCollection.size,
            quantity: userCollection.quantity,
            status: userCollection.notes, // 'owned', 'wanted', 'had'
        })
        .from(userCollection)
        .leftJoin(fragrances, eq(userCollection.fragranceId, fragrances.id))
        .leftJoin(brands, eq(fragrances.brandId, brands.id))
        .where(and(
            eq(userCollection.userId, userId),
            eq(userCollection.notes, 'owned') // Only show "Lo ho" in armadio
        ))
        .orderBy(desc(userCollection.createdAt))
        .limit(6);

    return collection;
}

function formatRelativeDate(date: Date | null): string {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Oggi';
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mesi fa`;
    return `${Math.floor(diffDays / 365)} anni fa`;
}

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const username = user.user_metadata?.username || user.email?.split("@")[0] || "Utente";
    const fullName = user.user_metadata?.full_name || username;
    const avatarUrl = user.user_metadata?.avatar_url;
    const createdAt = new Date(user.created_at);
    const memberSince = createdAt.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

    // Fetch real data
    const [stats, recentActivity, collection] = await Promise.all([
        getUserStats(user.id),
        getUserRecentActivity(user.id),
        getUserCollection(user.id),
    ]);

    return (
        <div className="w-full pt-32 pb-24">
            {/* Header Section */}
            <div className="container-page">
                <div className="border-b border-border-primary pb-12 mb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar - Clickable to change */}
                        <Link
                            href="/settings"
                            className="group relative w-24 h-24 md:w-32 md:h-32 border border-copper bg-copper/10 flex items-center justify-center text-copper shrink-0 cursor-pointer overflow-hidden"
                            title="Cambia foto profilo"
                        >
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={username} fill className="object-cover" />
                            ) : (
                                <User className="h-12 w-12 md:h-16 md:w-16" />
                            )}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-6 w-6 text-white mb-1" />
                                <span className="text-white text-[10px] uppercase tracking-wider">Cambia</span>
                            </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="font-serif text-5xl md:text-7xl mb-2">
                                {username}<span className="text-copper">.</span>
                            </h1>
                            {fullName !== username && (
                                <p className="text-lg text-text-secondary mb-4">{fullName}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Membro da {memberSince}
                                </span>
                            </div>
                        </div>

                        {/* Actions - Single button */}
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 px-5 py-3 border border-border-primary text-sm hover:border-copper hover:text-copper transition-colors"
                        >
                            <Settings className="h-4 w-4" />
                            Impostazioni
                        </Link>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
                    <div className="group p-6 md:p-8 border border-border-primary hover:border-copper transition-colors">
                        <span className="block font-serif text-4xl md:text-5xl text-copper mb-2">{stats.reviews}</span>
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted group-hover:text-copper transition-colors">Recensioni</span>
                    </div>
                    <Link href="/favorites" className="group p-6 md:p-8 border border-border-primary hover:border-gold transition-colors">
                        <span className="block font-serif text-4xl md:text-5xl text-gold mb-2">{stats.favorites}</span>
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted group-hover:text-gold transition-colors">Preferiti</span>
                    </Link>
                    <div className="group p-6 md:p-8 border border-border-primary hover:border-rose-gold transition-colors">
                        <span className="block font-serif text-4xl md:text-5xl text-rose-gold mb-2">{stats.collection}</span>
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted group-hover:text-rose-gold transition-colors">In Armadio</span>
                    </div>
                </div>

                {/* Collection / Armadio Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-px bg-rose-gold" />
                            <h2 className="font-serif text-3xl">Il Mio Armadio</h2>
                        </div>
                        <QuickAddToCollection />
                    </div>

                    {collection.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {collection.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/fragrance/${item.slug}`}
                                    className="group border border-border-primary hover:border-copper transition-colors"
                                >
                                    <div className="aspect-square bg-bg-tertiary relative overflow-hidden">
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.fragranceName || ''}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 50vw, 20vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="h-8 w-8 text-text-muted" />
                                            </div>
                                        )}
                                        {item.size && (
                                            <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-bg-primary/80 px-2 py-1">
                                                {item.size}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium truncate group-hover:text-copper transition-colors">
                                            {item.fragranceName}
                                        </p>
                                        <p className="text-xs text-text-muted truncate">{item.brandName}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed border-border-primary p-12 text-center">
                            <Package className="h-10 w-10 mx-auto mb-4 text-text-muted" />
                            <p className="text-text-secondary mb-4">Il tuo armadio è vuoto</p>
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 text-sm text-copper hover:underline"
                            >
                                Esplora fragranze <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}
                </section>

                {/* Recent Activity */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-px bg-copper" />
                        <h2 className="font-serif text-3xl">Attività Recente</h2>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="space-y-0">
                            {recentActivity.map((activity) => (
                                <Link
                                    key={activity.id}
                                    href={activity.fragranceSlug ? `/fragrance/${activity.fragranceSlug}` : '#'}
                                    className="group flex items-center justify-between py-6 border-b border-border-secondary/50 hover:border-copper transition-colors"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-10 h-10 border border-border-primary flex items-center justify-center text-text-muted group-hover:border-copper group-hover:text-copper transition-colors">
                                            {activity.type === "review" ? (
                                                <Star className="h-4 w-4" />
                                            ) : activity.type === "review_edit" ? (
                                                <Edit3 className="h-4 w-4" />
                                            ) : (
                                                <Heart className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-serif text-xl group-hover:text-copper transition-colors">
                                                {activity.fragranceName}
                                            </p>
                                            <p className="text-sm text-text-muted">
                                                {activity.type === "review"
                                                    ? "Recensito"
                                                    : activity.type === "review_edit"
                                                        ? "Recensione modificata"
                                                        : "Aggiunto ai preferiti"} · {activity.brandName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {(activity.type === 'review' || activity.type === 'review_edit') && activity.rating && (
                                            <span className="text-sm font-mono text-gold">★ {activity.rating}</span>
                                        )}
                                        <span className="text-xs text-text-muted flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatRelativeDate(activity.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed border-border-primary p-8 text-center">
                            <p className="text-text-muted">Nessuna attività recente</p>
                            <p className="text-sm text-text-muted mt-2">
                                Inizia a recensire fragranze o aggiungerle ai preferiti!
                            </p>
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section className="mt-16 pt-16 border-t border-border-primary">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-px bg-gold" />
                        <h2 className="font-serif text-3xl">Azioni Rapide</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/explore"
                            className="group p-6 border border-border-primary hover:border-copper transition-colors flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-serif text-xl mb-1 group-hover:text-copper transition-colors">Esplora Fragranze</h3>
                                <p className="text-sm text-text-muted">Scopri nuove fragranze da aggiungere alla collezione</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-copper group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link
                            href="/favorites"
                            className="group p-6 border border-border-primary hover:border-gold transition-colors flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-serif text-xl mb-1 group-hover:text-gold transition-colors">I Tuoi Preferiti</h3>
                                <p className="text-sm text-text-muted">Visualizza e gestisci la tua wishlist</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
