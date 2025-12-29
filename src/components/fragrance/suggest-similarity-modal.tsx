'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, X, Loader2, Plus, Check } from 'lucide-react';
import Image from 'next/image';
import { quickSearchFragrances, type QuickSearchResult } from '@/app/actions/quick-search';
import { suggestSimilarity } from '@/app/actions/fragrance-similarity';

interface SuggestSimilarityModalProps {
    isOpen: boolean;
    onClose: () => void;
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
}

export function SuggestSimilarityModal({
    isOpen,
    onClose,
    fragranceId,
    fragranceSlug,
    fragranceName
}: SuggestSimilarityModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<QuickSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, startTransition] = useTransition();
    const debouncedQuery = useDebounce(query, 300);
    const [suggestedId, setSuggestedId] = useState<string | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
            setSuggestedId(null);
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        const search = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const searchResults = await quickSearchFragrances(debouncedQuery);
                // Filter out the current fragrance itself
                setResults(searchResults.filter(r => r.id !== fragranceId));
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        search();
    }, [debouncedQuery, fragranceId]);

    const handleSuggest = (similarId: string) => {
        startTransition(async () => {
            const result = await suggestSimilarity(fragranceId, similarId, fragranceSlug);
            if (result.success) {
                setSuggestedId(similarId);
                // Auto close after success? Or just show success state?
                // Let's keep it open for a moment so user sees feedback
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                alert(result.error || 'Errore durante il suggerimento');
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-lg bg-bg-primary border border-border-primary shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-border-primary flex items-center justify-between bg-bg-secondary/50">
                    <div>
                        <h3 className="font-serif text-lg">Suggerisci una somiglianza</h3>
                        <p className="text-xs text-text-muted">Quale profumo ti ricorda {fragranceName}?</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-bg-tertiary rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-text-secondary" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b border-border-primary relative">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Cerca un profumo o brand..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-bg-secondary border border-border-primary pl-10 pr-4 py-3 text-sm outline-none focus:border-copper transition-colors placeholder:text-text-muted/50"
                        autoFocus
                    />
                    {isLoading && (
                        <div className="absolute right-7 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-copper" />
                        </div>
                    )}
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
                    {query.length < 2 ? (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted/50 p-8 text-center">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p className="text-sm">Digita almeno 2 caratteri per cercare</p>
                        </div>
                    ) : results.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted/50 p-8 text-center">
                            <p className="text-sm">Nessun profumo trovato</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {results.map((fragrance) => (
                                <button
                                    key={fragrance.id}
                                    onClick={() => handleSuggest(fragrance.id)}
                                    disabled={isSubmitting || suggestedId !== null}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-bg-secondary transition-colors text-left group border border-transparent hover:border-border-primary rounded-lg"
                                >
                                    <div className="relative w-10 h-10 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={fragrance.imageUrl || '/placeholders/perfume.png'}
                                            alt={fragrance.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="text-xs font-mono uppercase text-text-muted truncate">
                                            {fragrance.brandName}
                                        </div>
                                        <div className="text-sm font-medium truncate text-text-primary group-hover:text-copper transition-colors">
                                            {fragrance.name}
                                        </div>
                                    </div>

                                    {suggestedId === fragrance.id ? (
                                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold px-3 py-1.5 bg-emerald-500/10 rounded-full">
                                            <Check className="w-3 h-3" />
                                            Suggerito!
                                        </div>
                                    ) : (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-bg-tertiary p-1.5 rounded-full text-text-secondary hover:text-copper hover:bg-copper/10">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple debounce hook implementation if not available
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
