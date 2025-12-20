/**
 * Content Moderation using Google Gemini
 * Accurate multilingual moderation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export type ModerationCategory =
    | 'sexual'
    | 'hate'
    | 'harassment'
    | 'self-harm'
    | 'violence'
    | 'profanity'
    | 'spam';

export type ModerationResult = {
    flagged: boolean;
    categories: Partial<Record<ModerationCategory, boolean>>;
    flaggedCategories: ModerationCategory[];
    reason?: string;
};

/**
 * Check if content is appropriate using Google Gemini
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
    if (!content || content.trim().length === 0) {
        return { flagged: false, categories: {}, flaggedCategories: [] };
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('GOOGLE_API_KEY not set, skipping moderation');
        return { flagged: false, categories: {}, flaggedCategories: [] };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.0-flash as confirmed available
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Sei un moderatore di contenuti severo per recensioni di profumi. Analizza il seguente testo in italiano.
        
        Testo: "${content}"
        
        Rispondi ESCLUSIVAMENTE con un oggetto JSON valido.
        
        {
            "flagged": boolean,
            "categories": {
                "sexual": boolean,
                "hate": boolean,
                "harassment": boolean,
                "self-harm": boolean,
                "violence": boolean,
                "profanity": boolean,
                "spam": boolean
            },
            "reason": "spiegazione"
        }

        Linee guida MODERAZIONE:
        1. ODIO e DISCRIMINAZIONE: Riferimenti razzisti, omofobi, sessisti -> FLAGGED: TRUE.
        2. VOLGARITÀ (Profanity): Parole pesanti ("merda", "cazzo") vietate anche verso oggetti -> FLAGGED: TRUE. Slang leggero ("fa schifo") OK.
        3. SPAM/PERTINENZA (CRUCIALE): 
           - Il testo DEVE essere una recensione o opinione (anche breve) su un profumo, odore o esperienza sensoriale.
           - Testo senza senso logico, codici, stringhe random -> FLAGGED: TRUE (spam).
           - Testo completamente fuori tema (es. ricette, politica, vendita crypto) -> FLAGGED: TRUE (spam).
        
        Obiettivo: Community pulita e SOLO a tema profumi.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean response if it contains markdown code blocks
        let jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();
        // Remove typing if present (sometimes returns ```json ... ```) 
        jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");

        const data = JSON.parse(jsonString);

        const flaggedCategories: ModerationCategory[] = [];
        if (data.flagged) {
            for (const [category, isFlagged] of Object.entries(data.categories)) {
                if (isFlagged) {
                    flaggedCategories.push(category as ModerationCategory);
                }
            }
        }

        return {
            flagged: data.flagged,
            categories: data.categories,
            flaggedCategories,
            reason: data.reason
        };

    } catch (error) {
        console.error('Gemini Moderation error:', error);
        // Fail open
        return { flagged: false, categories: {}, flaggedCategories: [] };
    }
}

/**
 * Get a user-friendly message for flagged content
 */
export function getModerationMessage(flaggedCategories: ModerationCategory[]): string {
    if (flaggedCategories.length === 0) {
        return "Il contenuto non è appropriato.";
    }

    // Check for spam/relevance
    if (flaggedCategories.includes('spam')) {
        return "Il contenuto non sembra pertinente ai profumi o non ha senso compiuto.";
    }

    // Check for profanity
    if (flaggedCategories.includes('profanity')) {
        return "Il contenuto contiene linguaggio volgare o offensivo.";
    }

    const categoryMessages: Record<string, string> = {
        'sexual': 'contenuti sessualmente espliciti',
        'hate': 'linguaggio d\'odio',
        'harassment': 'molestie o minacce',
        'violence': 'contenuti violenti',
        'self-harm': 'riferimenti ad autolesionismo',
    };

    const reasons = flaggedCategories
        .map(cat => categoryMessages[cat] || cat)
        .slice(0, 2)
        .join(' e ');

    return `Il contenuto non può essere pubblicato perché contiene ${reasons}.`;
}
