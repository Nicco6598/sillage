"use client";

import Link from "next/link";
import { MessageCircle, ArrowUpRight, Users, Star, TrendingUp } from "lucide-react";

const stats = [
    { label: "Membri", value: "50k+", color: "text-copper" },
    { label: "Recensioni", value: "120k+", color: "text-gold" },
    { label: "Discussioni", value: "8.5k", color: "text-rose-gold" },
];

const discussions = [
    { title: "Migliori fragranze per l'inverno 2024?", author: "WinterScent", replies: 47, hot: true },
    { title: "Aventus: vale ancora il prezzo?", author: "CreedFan", replies: 89, hot: true },
    { title: "Collezione Oud - Le vostre preferite", author: "OudLover", replies: 34 },
    { title: "Come costruire una collezione bilanciata", author: "Collector101", replies: 56 },
    { title: "Fragranze da ufficio - Consigli", author: "ProScent", replies: 28 },
];

const topContributors = [
    { name: "FragranceGuru", reviews: 234, badge: "Expert" },
    { name: "NicheLover", reviews: 189, badge: "Collector" },
    { name: "ScentMaster", reviews: 156, badge: "Expert" },
];

export default function CommunityPage() {
    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                    Community<span className="text-copper">.</span>
                                </h1>
                                <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                    Uno spazio per condividere la passione olfattiva. Senza filtri.
                                </p>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap gap-8 pt-8 border-t border-border-primary">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-2">
                                    <span className={`font-serif text-3xl ${stat.color}`}>{stat.value}</span>
                                    <span className="text-sm text-text-muted uppercase tracking-wide">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container-page">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Discussions Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-8 h-px bg-copper" />
                            <h2 className="font-serif text-2xl md:text-3xl">Discussioni Recenti</h2>
                        </div>

                        <div className="space-y-0">
                            {discussions.map((d, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="group flex items-center justify-between py-6 border-b border-border-secondary/50 hover:border-copper transition-colors"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            {d.hot && (
                                                <span className="px-2 py-0.5 bg-copper/10 text-copper text-[10px] uppercase tracking-wider font-mono">
                                                    Hot
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-medium group-hover:text-copper transition-colors line-clamp-1">
                                            {d.title}
                                        </h3>
                                        <span className="text-xs text-text-muted font-mono uppercase tracking-wider">
                                            by {d.author}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-sm text-text-tertiary font-mono">
                                            <MessageCircle className="h-4 w-4" />
                                            {d.replies}
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-copper transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-copper transition-colors"
                            >
                                <span>Vedi tutte le discussioni</span>
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-12">
                        {/* Top Contributors */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-px bg-gold" />
                                <h3 className="font-serif text-xl">Top Contributors</h3>
                            </div>
                            <div className="space-y-4">
                                {topContributors.map((user, i) => (
                                    <div
                                        key={user.name}
                                        className="flex items-center justify-between p-4 border border-border-primary hover:border-gold/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-text-muted">{user.reviews} recensioni</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-gold/10 text-gold font-mono">
                                            {user.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="p-8 bg-bg-tertiary border border-border-primary">
                            <Users className="h-8 w-8 text-copper mb-4" />
                            <h3 className="font-serif text-xl mb-2">Unisciti a noi</h3>
                            <p className="text-sm text-text-secondary mb-6">
                                Condividi le tue recensioni e scopri nuove fragranze insieme alla community.
                            </p>
                            <Link
                                href="/register"
                                className="block w-full py-3 text-center text-sm uppercase tracking-widest bg-text-primary text-text-inverted hover:bg-copper transition-colors"
                            >
                                Registrati
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
