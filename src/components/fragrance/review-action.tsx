
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
                className="inline-block border border-text-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-colors cursor-pointer"
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
