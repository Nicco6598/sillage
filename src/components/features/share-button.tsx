"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    name: string;
    brand: string;
}

export function ShareButton({ name, brand }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const text = `Scopri ${name} di ${brand} su Sillage.`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${name} - ${brand}`,
                    text: text,
                    url: url,
                });
                return;
            } catch {
                // Ignore abort errors
            }
        }

        // Fallback to clipboard
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy", err);
            }
        } else {
            // Fallback for older browsers
            console.warn("Clipboard API not available");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="p-2 hover:bg-bg-tertiary rounded-full transition-colors cursor-pointer group relative"
            title="Condividi"
            aria-label="Condividi"
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-500 scale-110" />
            ) : (
                <Share2 className="h-4 w-4 text-text-secondary group-hover:text-copper transition-colors" />
            )}

            {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-text-primary text-bg-primary px-2 py-1 rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                    Copiato!
                </span>
            )}
        </button>
    );
}
