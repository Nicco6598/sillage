
"use client";

import { useState } from "react";
import { ReviewModal } from "./review-modal";

interface ReviewActionProps {
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
}

export function ReviewAction({ fragranceId, fragranceSlug, fragranceName }: ReviewActionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto border border-text-primary px-6 py-4 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-text-primary hover:text-bg-primary transition-all duration-300 cursor-pointer text-center"
            >
                Scrivi una recensione
            </button>
            <ReviewModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                fragranceId={fragranceId}
                fragranceSlug={fragranceSlug}
                fragranceName={fragranceName}
            />
        </>
    );
}
