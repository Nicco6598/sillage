'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { Search, X, Plus, Loader2, Package, Check, Minus } from 'lucide-react';
import Image from 'next/image';
import { quickSearchFragrances, QuickSearchResult } from '@/app/actions/quick-search';
import { addToCollection } from '@/app/actions/collection';
import { cn } from '@/lib/utils';

interface QuickAddToCollectionProps {
    onSuccess?: () => void;
}

export function QuickAddToCollection({ onSuccess }: QuickAddToCollectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<QuickSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [actioningId, setActioningId] = useState<string | null>(null);
    // Track local state changes for immediate UI feedback
    const [localOwnership, setLocalOwnership] = useState<Map<string, boolean>>(new Map());

    // Debounced search
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const searchResults = await quickSearchFragrances(searchQuery);
                setResults(searchResults);
                // Reset local ownership when new results come in
                setLocalOwnership(new Map());
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleToggleOwnership = useCallback((fragranceId: string, currentlyOwned: boolean) => {
        setActioningId(fragranceId);
        startTransition(async () => {
            // If owned, remove (pass null). If not owned, add as 'owned'
            const newStatus = currentlyOwned ? null : 'owned';
            const result = await addToCollection(fragranceId, newStatus);
            if (result.success) {
                // Update local state for immediate feedback
                setLocalOwnership(prev => new Map(prev).set(fragranceId, !currentlyOwned));
                onSuccess?.();
            }
            setActioningId(null);
        });
    }, [onSuccess]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearchQuery('');
        setResults([]);
        setLocalOwnership(new Map());
    }, []);

    // Get effective ownership status (local override or from server)
    const getIsOwned = (fragrance: QuickSearchResult) => {
        if (localOwnership.has(fragrance.id)) {
            return localOwnership.get(fragrance.id)!;
        }
        return fragrance.isOwned;
    };

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleClose]);

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-copper transition-colors"
            >
                <Plus className="h-4 w-4" />
                Aggiungi
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg mx-4 bg-bg-primary border border-border-primary shadow-2xl animate-fade-in-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border-primary">
                            <h2 className="font-serif text-xl">Aggiungi all&apos;Armadio</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-bg-secondary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="p-4 border-b border-border-secondary">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cerca fragranza o brand..."
                                    autoFocus
                                    className="w-full bg-bg-tertiary pl-10 pr-4 py-3 text-sm border border-border-primary focus:border-copper outline-none transition-colors"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-text-muted" />
                                )}
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                Digita almeno 2 caratteri per cercare
                            </p>
                        </div>

                        {/* Results */}
                        <div className="max-h-[50vh] overflow-y-auto">
                            {results.length > 0 ? (
                                <div className="divide-y divide-border-secondary">
                                    {results.map((fragrance) => {
                                        const isOwned = getIsOwned(fragrance);
                                        const isActioning = isPending && actioningId === fragrance.id;

                                        return (
                                            <div
                                                key={fragrance.id}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 transition-colors",
                                                    isOwned ? "bg-copper/5" : "hover:bg-bg-secondary/50"
                                                )}
                                            >
                                                {/* Image */}
                                                <div className="w-12 h-12 bg-bg-tertiary shrink-0 overflow-hidden">
                                                    {fragrance.imageUrl ? (
                                                        <Image
                                                            src={fragrance.imageUrl}
                                                            alt={fragrance.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-text-muted" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{fragrance.name}</p>
                                                    <p className="text-sm text-text-muted truncate">{fragrance.brandName}</p>
                                                    {/* Year & Concentration */}
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {fragrance.concentration && (
                                                            <span className="text-xs text-text-tertiary">{fragrance.concentration}</span>
                                                        )}
                                                        {fragrance.year && fragrance.concentration && (
                                                            <span className="text-text-muted">·</span>
                                                        )}
                                                        {fragrance.year && (
                                                            <span className="text-xs text-text-tertiary">{fragrance.year}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div className="flex items-center">
                                                    {isOwned ? (
                                                        <button
                                                            onClick={() => handleToggleOwnership(fragrance.id, true)}
                                                            disabled={isActioning}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors",
                                                                "border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white",
                                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                                            )}
                                                        >
                                                            {isActioning ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Minus className="h-3 w-3" />
                                                                    Non lo ho più
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleOwnership(fragrance.id, false)}
                                                            disabled={isActioning}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors",
                                                                "border-copper text-copper hover:bg-copper hover:text-white",
                                                                "disabled:opacity-50 disabled:cursor-not-allowed"
                                                            )}
                                                        >
                                                            {isActioning ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Check className="h-3 w-3" />
                                                                    Lo ho
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : searchQuery.length >= 2 && !isSearching ? (
                                <div className="p-8 text-center">
                                    <Package className="h-10 w-10 mx-auto mb-3 text-text-muted" />
                                    <p className="text-text-secondary">Nessuna fragranza trovata</p>
                                    <p className="text-sm text-text-muted mt-1">Prova con un altro termine</p>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-text-muted">
                                    <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                    <p>Cerca una fragranza da aggiungere</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
