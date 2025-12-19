"use client";

import Link from "next/link";
import { Users, MessageCircle, Star, ArrowRight } from "lucide-react";

const stats = [
    { label: "Membri", value: "50k" },
    { label: "Recensioni", value: "120k" },
    { label: "Discussioni", value: "8.5k" },
];

const discussions = [
    { title: "Migliori fragranze per l'inverno 2024?", author: "WinterScent", replies: 47 },
    { title: "Aventus: vale ancora il prezzo?", author: "CreedFan", replies: 89 },
    { title: "Collezione Oud - Le vostre preferite", author: "OudLover", replies: 34 },
    { title: "Come costruire una collezione bilanciata", author: "Collector101", replies: 56 },
];

export default function CommunityPage() {
    return (
        <div className="w-full pt-40 pb-24">
            <div className="container-page mb-24">
                <div className="border-b border-border-primary pb-8">
                    <h1 className="font-serif text-5xl md:text-7xl mb-4">Community.</h1>
                    <p className="text-xl text-text-secondary max-w-2xl">
                        Uno spazio per condividere la passione. Senza filtri.
                    </p>
                </div>
            </div>

            {/* Stats Row - Big Numbers */}
            <div className="border-y border-border-primary py-16 mb-24">
                <div className="container-page flex flex-wrap justify-around text-center gap-12">
                    {stats.map(s => (
                        <div key={s.label}>
                            <span className="block font-serif text-6xl sm:text-7xl mb-2">{s.value}</span>
                            <span className="text-xs font-mono uppercase tracking-widest text-text-muted">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discussions List */}
            <div className="container-page max-w-4xl">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="font-serif text-3xl">Discussioni Recenti</h2>
                    <Link href="#" className="text-xs font-mono uppercase tracking-widest underline underline-offset-4">Vedi Tutte</Link>
                </div>

                <div className="divide-y divide-border-primary border-t border-border-primary">
                    {discussions.map((d, i) => (
                        <Link key={i} href="#" className="group block py-8 hover:bg-bg-secondary transition-colors px-4 -mx-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-serif mb-2 group-hover:underline underline-offset-4 decoration-1">{d.title}</h3>
                                    <div className="text-xs font-mono text-text-muted uppercase tracking-widest">
                                        by {d.author}
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-mono text-text-secondary flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4" /> {d.replies}
                                    </span>
                                    <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <Link
                        href="/register"
                        className="inline-block bg-text-primary text-bg-primary px-12 py-4 text-sm uppercase tracking-widest font-medium hover:bg-text-secondary transition-colors"
                    >
                        Unisciti alla Community
                    </Link>
                </div>
            </div>
        </div>
    );
}
