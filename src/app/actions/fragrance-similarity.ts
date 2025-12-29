'use server';

import { createClient } from '@/lib/supabase/server';
import { voteSimilarity, addSimilaritySuggestion, getSpecificSimilarityVote, deleteSimilarityVote } from '@/lib/fragrance-db';
import { revalidatePath } from 'next/cache';

export async function voteOnSimilarity(similarityId: string, vote: 1 | -1, fragranceSlug: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Devi essere loggato per votare' };
    }

    try {
        const currentVote = await getSpecificSimilarityVote(similarityId, user.id);

        if (currentVote === vote) {
            // Remove vote (toggle off)
            await deleteSimilarityVote(similarityId, user.id);
            revalidatePath(`/fragrance/${fragranceSlug}`);
            return { success: true, action: 'removed' };
        } else {
            // Update or add vote
            await voteSimilarity(similarityId, user.id, vote);
            revalidatePath(`/fragrance/${fragranceSlug}`);
            return { success: true, action: 'updated' };
        }
    } catch (error) {
        console.error('Error voting on similarity:', error);
        return { error: 'Errore durante il voto' };
    }
}

export async function suggestSimilarity(fragranceId: string, similarId: string, fragranceSlug: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Devi essere loggato per suggerire un profumo' };
    }

    try {
        await addSimilaritySuggestion(fragranceId, similarId);
        revalidatePath(`/fragrance/${fragranceSlug}`);
        return { success: true };
    } catch (error) {
        console.error('Error suggesting similarity:', error);
        return { error: 'Errore durante il suggerimento' };
    }
}
