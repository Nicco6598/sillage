'use client';

import { useState } from 'react';
import { ReviewCard } from './review-card';
import { ReviewModal } from './review-modal';

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

interface ReviewsListProps {
    reviews: Review[];
    currentUserId: string | null;
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
}

export function ReviewsList({ reviews, currentUserId, fragranceId, fragranceSlug, fragranceName }: ReviewsListProps) {
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (review: Review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(null);
    };

    return (
        <>
            <div className="space-y-6">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        currentUserId={currentUserId}
                        fragranceSlug={fragranceSlug}
                        fragranceId={fragranceId}
                        fragranceName={fragranceName}
                        onEdit={handleEdit}
                    />
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <ReviewModal
                    key={editingReview?.id ?? "new"}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    fragranceId={fragranceId}
                    fragranceSlug={fragranceSlug}
                    fragranceName={fragranceName}
                    editingReview={editingReview}
                />
            )}
        </>
    );
}
