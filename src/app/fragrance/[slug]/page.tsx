import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getFragranceBySlug, getSimilarFragrances } from "@/lib/fragrance-service";
import { FragranceDetail } from "./fragrance-detail";

interface FragrancePageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: FragrancePageProps): Promise<Metadata> {
    const { slug } = await params;
    const fragrance = await getFragranceBySlug(slug);

    if (!fragrance) {
        return {
            title: "Fragranza non trovata",
        };
    }

    return {
        title: `${fragrance.name} by ${fragrance.brand.name}`,
        description: `Scopri ${fragrance.name} di ${fragrance.brand.name}. Rating: ${fragrance.rating}/5. Note: ${fragrance.notes.top.map(n => n.name).join(", ")}.`,
        openGraph: {
            title: `${fragrance.name} - ${fragrance.brand.name}`,
            description: `${fragrance.accords.map(a => a.name).join(", ")}`,
        },
    };
}

/**
 * Fragrance detail page
 */
export default async function FragrancePage({ params }: FragrancePageProps) {
    const { slug } = await params;
    const fragrance = await getFragranceBySlug(slug);

    if (!fragrance) {
        notFound();
    }

    const similarFragrances = await getSimilarFragrances(fragrance, 4);

    return (
        <section className="py-8">
            <FragranceDetail fragrance={fragrance} similar={similarFragrances} />
        </section>
    );
}
