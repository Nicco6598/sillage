'use client';

import { useState, useTransition } from 'react';
import { Star, Package, Calendar, Edit2, Trash2, Loader2 } from 'lucide-react';
import { deleteReview } from '@/app/actions/submit-review';
import { cn } from '@/lib/utils';

interface Review {
    id: string;
    userName: string;
    userId: string | null;
    rating: string | null;
    comment: string | null;
    sillage: string | null;
    longevity: string | null;
    genderVote: string | null;
    seasonVote: string | null;
    batchCode: string | null;
    productionDate: string | null;
    createdAt: Date | null;
    updatedAt?: Date | null;
}

interface ReviewCardProps {
    review: Review;
    currentUserId: string | null;
    fragranceSlug: string;
    fragranceId: string;
    fragranceName: string;
    onEdit?: (review: Review) => void;
}

export function ReviewCard({ review, currentUserId, fragranceSlug, onEdit }: ReviewCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isOwner = currentUserId && review.userId === currentUserId;
    const wasEdited = review.updatedAt && review.createdAt &&
        new Date(review.updatedAt).getTime() > new Date(review.createdAt).getTime();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteReview(review.id, fragranceSlug);
            setShowDeleteConfirm(false);
        });
    };

    return (
        <div className="border border-border-primary p-6 hover:border-copper/30 transition-colors">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-bg-primary border border-border-primary p-6 max-w-sm w-full">
                        <h3 className="font-serif text-xl mb-4">Eliminare la recensione?</h3>
                        <p className="text-text-secondary text-sm mb-6">
                            Questa azione non può essere annullata.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isPending}
                                className="flex-1 py-3 border border-border-primary hover:border-text-primary transition-colors text-sm"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Eliminando...
                                    </>
                                ) : (
                                    'Elimina'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-bg-tertiary border border-border-primary flex items-center justify-center text-xl uppercase font-serif">
                        {review.userName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium flex items-center gap-2 flex-wrap">
                            {review.userName}
                            {isOwner && (
                                <span className="text-[10px] px-2 py-0.5 bg-copper/10 text-copper border border-copper/20 uppercase tracking-wider">
                                    Tu
                                </span>
                            )}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-text-muted font-mono">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }) : ""}
                            </p>
                            {wasEdited && (
                                <span className="text-[10px] text-text-muted italic">
                                    (modificata)
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-serif text-xl text-copper mr-2">{Number(review.rating).toFixed(1)}</span>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={cn(
                                "h-4 w-4",
                                i <= Math.round(Number(review.rating) || 0)
                                    ? "fill-copper text-copper"
                                    : "text-border-primary"
                            )}
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
                                Anno: <span className="text-text-primary">{review.productionDate}</span>
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Comment */}
            {review.comment && (
                <p className="text-text-secondary leading-relaxed mb-6">
                    &quot;{review.comment}&quot;
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

            {/* Owner Actions - Bottom Bar */}
            {isOwner && (
                <div className="mt-6 pt-4 border-t border-border-primary flex items-center justify-end gap-3">
                    <button
                        onClick={() => onEdit?.(review)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-copper border border-border-primary hover:border-copper transition-colors"
                    >
                        <Edit2 className="h-4 w-4" />
                        Modifica
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-red-500 border border-border-primary hover:border-red-500 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        Elimina
                    </button>
                </div>
            )}
        </div>
    );
}
