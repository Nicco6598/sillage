'use client';

import { useState, useEffect, useTransition } from 'react';
import { Heart, Share2, Check, Loader2 } from 'lucide-react';
import { getCollectionStatus, addToCollection, toggleFavorite, CollectionStatus } from '@/app/actions/collection';
import { cn } from '@/lib/utils';

interface CollectionActionsProps {
    fragranceId: string;
}

export function CollectionActions({ fragranceId }: CollectionActionsProps) {
    const [status, setStatus] = useState<CollectionStatus>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStatus = async () => {
            const result = await getCollectionStatus(fragranceId);
            setStatus(result.status);
            setIsFavorite(result.isFavorite);
            setIsLoading(false);
        };
        loadStatus();
    }, [fragranceId]);

    const handleStatusChange = (newStatus: CollectionStatus) => {
        startTransition(async () => {
            // Toggle off if same status
            const targetStatus = status === newStatus ? null : newStatus;
            const result = await addToCollection(fragranceId, targetStatus);
            if (result.success) {
                setStatus(result.status ?? null);
            }
        });
    };

    const handleFavoriteToggle = () => {
        startTransition(async () => {
            const result = await toggleFavorite(fragranceId);
            if (result.success) {
                setIsFavorite(result.isFavorite ?? false);
            }
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (_e) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copiato negli appunti!');
        }
    };

    if (isLoading) {
        return (
            <>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="py-4 border border-border-primary flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-6 h-6 bg-bg-tertiary rounded" />
                            <div className="w-12 h-2 bg-bg-tertiary rounded" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 py-3 border border-border-primary animate-pulse" />
                    <div className="flex-1 py-3 border border-border-primary animate-pulse" />
                </div>
            </>
        );
    }

    return (
        <>
            {/* Collection Status Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                    onClick={() => handleStatusChange('owned')}
                    disabled={isPending}
                    className={cn(
                        "py-4 border transition-colors flex flex-col items-center gap-2 group cursor-pointer relative",
                        status === 'owned'
                            ? "border-copper bg-copper/10 text-copper"
                            : "border-border-primary hover:border-copper hover:text-copper"
                    )}
                >
                    {isPending && status === 'owned' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <span className="text-xl">👃</span>
                            {status === 'owned' && (
                                <Check className="absolute top-2 right-2 h-3 w-3 text-copper" />
                            )}
                        </>
                    )}
                    <span className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        status === 'owned' ? "text-copper" : "text-text-muted group-hover:text-copper"
                    )}>
                        Lo ho
                    </span>
                </button>

                <button
                    onClick={() => handleStatusChange('wanted')}
                    disabled={isPending}
                    className={cn(
                        "py-4 border transition-colors flex flex-col items-center gap-2 group cursor-pointer relative",
                        status === 'wanted'
                            ? "border-rose-gold bg-rose-gold/10 text-rose-gold"
                            : "border-border-primary hover:border-rose-gold hover:text-rose-gold"
                    )}
                >
                    {isPending && status === 'wanted' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <span className="text-xl">💖</span>
                            {status === 'wanted' && (
                                <Check className="absolute top-2 right-2 h-3 w-3 text-rose-gold" />
                            )}
                        </>
                    )}
                    <span className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        status === 'wanted' ? "text-rose-gold" : "text-text-muted group-hover:text-rose-gold"
                    )}>
                        Lo voglio
                    </span>
                </button>

                <button
                    onClick={() => handleStatusChange('had')}
                    disabled={isPending}
                    className={cn(
                        "py-4 border transition-colors flex flex-col items-center gap-2 group cursor-pointer relative",
                        status === 'had'
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border-primary hover:border-gold hover:text-gold"
                    )}
                >
                    {isPending && status === 'had' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <span className="text-xl">✅</span>
                            {status === 'had' && (
                                <Check className="absolute top-2 right-2 h-3 w-3 text-gold" />
                            )}
                        </>
                    )}
                    <span className={cn(
                        "text-[10px] font-mono uppercase tracking-widest",
                        status === 'had' ? "text-gold" : "text-text-muted group-hover:text-gold"
                    )}>
                        Lo avevo
                    </span>
                </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleShare}
                    className="flex-1 py-3 border border-border-primary hover:border-copper transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-copper"
                >
                    <Share2 className="h-4 w-4" />
                    Condividi
                </button>
                <button
                    onClick={handleFavoriteToggle}
                    disabled={isPending}
                    className={cn(
                        "flex-1 py-3 border transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm",
                        isFavorite
                            ? "border-copper bg-copper/10 text-copper"
                            : "border-border-primary text-text-secondary hover:border-copper hover:text-copper"
                    )}
                >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-copper")} />
                    {isFavorite ? "Preferito" : "Preferiti"}
                </button>
            </div>
        </>
    );
}
