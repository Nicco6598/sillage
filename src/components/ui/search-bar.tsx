"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn, debounce } from "@/lib/utils";

interface SearchSuggestion {
    id: string;
    name: string;
    brand: string;
    slug: string;
    imageUrl?: string;
}

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
}

/**
 * Search bar with autocomplete suggestions
 */
export function SearchBar({
    placeholder = "Cerca fragranze, brand, note...",
    onSearch,
    className,
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions
    const fetchSuggestions = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();

                if (data.success) {
                    setSuggestions(data.suggestions);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Handle query change
    useEffect(() => {
        fetchSuggestions(query);
    }, [query, fetchSuggestions]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
            setShowSuggestions(false);
            // Navigate to search results
            window.location.href = `/explore?q=${encodeURIComponent(query)}`;
        }
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
        inputRef.current?.focus();
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <form onSubmit={handleSubmit}>
                <div
                    className={cn(
                        "flex items-center rounded-xl border bg-bg-secondary transition-all duration-200",
                        isFocused
                            ? "border-accent shadow-sm shadow-accent/10"
                            : "border-border-primary"
                    )}
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center text-text-muted">
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={handleFocus}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="h-12 flex-1 bg-transparent pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                        autoComplete="off"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-bg-tertiary text-text-muted transition-colors hover:text-text-primary"
                            aria-label="Clear"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border-primary bg-bg-secondary shadow-lg">
                    <ul className="py-2">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.id}>
                                <Link
                                    href={`/fragrance/${suggestion.slug}`}
                                    onClick={() => setShowSuggestions(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-bg-tertiary"
                                >
                                    {/* Placeholder Image */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-lg">
                                        🌸
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-text-primary">
                                            {suggestion.name}
                                        </p>
                                        <p className="truncate text-sm text-text-muted">
                                            {suggestion.brand}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* View All Results */}
                    <div className="border-t border-border-primary p-2">
                        <button
                            onClick={() => {
                                setShowSuggestions(false);
                                window.location.href = `/explore?q=${encodeURIComponent(query)}`;
                            }}
                            className="w-full rounded-lg py-2 text-center text-sm font-medium text-accent transition-colors hover:bg-accent/5"
                        >
                            Vedi tutti i risultati per &quot;{query}&quot;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
