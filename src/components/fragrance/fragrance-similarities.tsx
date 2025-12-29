'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Plus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { voteOnSimilarity } from '@/app/actions/fragrance-similarity';
import type { Fragrance } from '@/types/fragrance';
import { cn } from '@/lib/utils';
import { SuggestSimilarityModal } from './suggest-similarity-modal';

interface Similarity {
    similarityId: string;
    fragrance: Fragrance;
    score: number;
    upvotes: number;
    downvotes: number;
    userVote?: number; // 1 for upvote, -1 for downvote, undefined/null/0 for none
}

interface FragranceSimilaritiesProps {
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
    initialSimilarities: Similarity[]; // These should have userVote merged in if possible, or passed separately
    userId?: string | null;
}

// Low score threshold to hide spam/bad suggestions
const MIN_SCORE_THRESHOLD = -3;
const INITIAL_VISIBLE_COUNT = 6;

export function FragranceSimilarities({
    fragranceId,
    fragranceSlug,
    fragranceName,
    initialSimilarities,
    userId
}: FragranceSimilaritiesProps) {
    const [similarities, setSimilarities] = useState<Similarity[]>(initialSimilarities);
    const [isVoting, setIsVoting] = useState<string | null>(null);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Filter out items with very low score (community rejection)
    const validSimilarities = similarities.filter(s => s.score >= MIN_SCORE_THRESHOLD);

    // Determine visible items
    const visibleSimilarities = showAll
        ? validSimilarities
        : validSimilarities.slice(0, INITIAL_VISIBLE_COUNT);

    const hasHiddenItems = validSimilarities.length > INITIAL_VISIBLE_COUNT;

    const handleVote = async (similarityId: string, vote: 1 | -1) => {
        if (!userId) {
            alert('Devi essere loggato per votare');
            return;
        }

        setIsVoting(similarityId);

        // Optimistic update
        setSimilarities(prev => prev.map(s => {
            if (s.similarityId === similarityId) {
                // If clicking same vote -> remove it
                if (s.userVote === vote) {
                    const diff = vote === 1 ? -1 : 1; // reverse the effect
                    return {
                        ...s,
                        score: s.score + diff,
                        upvotes: vote === 1 ? s.upvotes - 1 : s.upvotes,
                        downvotes: vote === -1 ? s.downvotes - 1 : s.downvotes,
                        userVote: undefined
                    };
                }
                // If changing vote (e.g. up -> down)
                else if (s.userVote && s.userVote !== vote) {
                    // Reverse old vote AND add new vote
                    // old was 1, new is -1: score -1 (remove old) -1 (add new) = -2
                    const diff = vote === 1 ? 2 : -2;
                    return {
                        ...s,
                        score: s.score + diff,
                        upvotes: vote === 1 ? s.upvotes + 1 : s.upvotes - 1,
                        downvotes: vote === -1 ? s.downvotes + 1 : s.downvotes - 1,
                        userVote: vote
                    };
                }
                // New vote
                else {
                    const diff = vote === 1 ? 1 : -1;
                    return {
                        ...s,
                        score: s.score + diff,
                        upvotes: vote === 1 ? s.upvotes + 1 : s.upvotes,
                        downvotes: vote === -1 ? s.downvotes + 1 : s.downvotes,
                        userVote: vote
                    };
                }
            }
            return s;
        }).sort((a, b) => b.score - a.score));

        const result = await voteOnSimilarity(similarityId, vote, fragranceSlug);
        setIsVoting(null);

        if (result.error) {
            // Revert on error? For now just alert
            alert(result.error);
            // Ideally we should revert state here, but revalidatePath will fix it on next refresh mostly
        }
    };

    const handleOpenSuggestModal = () => {
        if (!userId) {
            alert('Devi essere loggato per suggerire una somiglianza');
            return;
        }
        setIsSuggestModalOpen(true);
    };

    return (
        <section className="py-16 border-t border-border-primary">
            <SuggestSimilarityModal
                isOpen={isSuggestModalOpen}
                onClose={() => setIsSuggestModalOpen(false)}
                fragranceId={fragranceId}
                fragranceSlug={fragranceSlug}
                fragranceName={fragranceName}
            />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border-primary">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-px bg-copper" />
                        <h2 className="font-serif text-3xl md:text-4xl">Questo profumo ricorda</h2>
                    </div>
                    <p className="text-sm text-text-muted max-w-xl">
                        La nostra community suggerisce che questa fragranza condivida note o carattere con i profumi elencati di seguito. Vota quelli che ritieni più simili.
                    </p>
                </div>

                <button
                    onClick={handleOpenSuggestModal}
                    className="flex items-center gap-2 px-6 py-3 bg-bg-secondary border border-border-primary hover:border-copper hover:text-copper transition-all duration-300 group"
                >
                    <div className="bg-bg-tertiary p-1 rounded-full group-hover:bg-copper/10 transition-colors">
                        <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest">Suggerisci</span>
                </button>
            </div>

            {validSimilarities.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-border-primary bg-bg-secondary/50">
                    <h3 className="text-xl font-serif mb-4">Nessun suggerimento ancora</h3>
                    <p className="text-text-muted mb-6">Sii il primo a suggerire un profumo simile a {fragranceName}!</p>
                    <button
                        onClick={handleOpenSuggestModal}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-text-primary text-bg-primary hover:bg-text-secondary transition-colors font-medium tracking-wide uppercase text-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Suggerisci Profumo
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visibleSimilarities.map((item) => (
                                <motion.div
                                    key={item.similarityId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative flex items-center gap-6 p-6 bg-bg-secondary border border-border-primary hover:border-copper/30 transition-all duration-500 shadow-soft hover:shadow-elevated"
                                >
                                    {/* Inner glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />

                                    <Link href={`/fragrance/${item.fragrance.slug}`} className="relative h-24 w-24 flex-shrink-0 bg-white/5 overflow-hidden group-hover:bg-white/10 transition-colors">
                                        <Image
                                            src={item.fragrance.imageUrl || '/placeholders/perfume.png'}
                                            alt={item.fragrance.name}
                                            fill
                                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
                                        />
                                    </Link>

                                    <div className="flex-grow min-w-0 pr-4 relative z-10">
                                        <Link href={`/brands/${item.fragrance.brand.slug}`} className="inline-block text-[10px] font-mono uppercase tracking-widest text-copper hover:text-copper/80 transition-colors mb-1">
                                            {item.fragrance.brand.name}
                                        </Link>
                                        <Link href={`/fragrance/${item.fragrance.slug}`} className="block">
                                            <h4 className="text-xl font-serif text-text-primary truncate transition-colors group-hover:text-copper">
                                                {item.fragrance.name}
                                            </h4>
                                        </Link>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-mono px-2 py-0.5 border border-border-primary text-text-muted uppercase">
                                                {item.fragrance.concentration}
                                            </span>
                                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                                                {item.fragrance.gender}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2 pl-6 border-l border-border-primary relative z-10">
                                        <button
                                            onClick={() => handleVote(item.similarityId, 1)}
                                            disabled={isVoting === item.similarityId}
                                            className={cn(
                                                "p-2.5 rounded-full border border-border-primary transition-all duration-300",
                                                item.userVote === 1
                                                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20"
                                                    : "text-text-muted hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5",
                                                isVoting === item.similarityId && "opacity-50 cursor-not-allowed"
                                            )}
                                            title={item.userVote === 1 ? "Rimuovi voto" : "Mi ricorda questo"}
                                        >
                                            <ThumbsUp className={cn("w-4 h-4", item.userVote === 1 && "fill-emerald-500/20")} />
                                        </button>

                                        <div className="flex flex-col items-center">
                                            <span className={cn(
                                                "text-base font-serif font-medium min-w-[3ch] text-center",
                                                item.score > 0 ? "text-emerald-500" : item.score < 0 ? "text-rose-500" : "text-text-muted"
                                            )}>
                                                {item.score > 0 ? `+${item.score}` : item.score}
                                            </span>
                                            <span className="text-[8px] font-mono uppercase tracking-tighter text-text-muted">Consenso</span>
                                        </div>

                                        <button
                                            onClick={() => handleVote(item.similarityId, -1)}
                                            disabled={isVoting === item.similarityId}
                                            className={cn(
                                                "p-2.5 rounded-full border border-border-primary transition-all duration-300",
                                                item.userVote === -1
                                                    ? "bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500/20"
                                                    : "text-text-muted hover:border-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5",
                                                isVoting === item.similarityId && "opacity-50 cursor-not-allowed"
                                            )}
                                            title={item.userVote === -1 ? "Rimuovi voto" : "Non mi ricorda questo"}
                                        >
                                            <ThumbsDown className={cn("w-4 h-4", item.userVote === -1 && "fill-rose-500/20")} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {hasHiddenItems && !showAll && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setShowAll(true)}
                                className="flex items-center gap-2 px-6 py-2 border border-border-primary hover:bg-bg-secondary transition-colors text-xs uppercase tracking-widest text-text-muted hover:text-text-primary"
                            >
                                Vedi altri ({validSimilarities.length - INITIAL_VISIBLE_COUNT})
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
