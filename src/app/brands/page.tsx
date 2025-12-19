import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const featuredBrands = [
    { name: "Chanel", description: "L'eleganza parigina dal 1910" },
    { name: "Dior", description: "L'arte della haute parfumerie" },
    { name: "Tom Ford", description: "Lusso contemporaneo audace" },
    { name: "Creed", description: "Tradizione niche dal 1760" },
];

const allBrands = [
    { name: "Acqua di Parma", category: "Luxury" },
    { name: "Armani", category: "Designer" },
    { name: "Atelier Cologne", category: "Niche" },
    { name: "Azzaro", category: "Designer" },
    { name: "Balenciaga", category: "Fashion" },
    { name: "Boucheron", category: "Luxury" },
    { name: "Burberry", category: "Fashion" },
    { name: "Bvlgari", category: "Luxury" },
    { name: "Calvin Klein", category: "Designer" },
    { name: "Carolina Herrera", category: "Designer" },
    { name: "Cartier", category: "Luxury" },
    { name: "Chanel", category: "Luxury" },
    { name: "Creed", category: "Niche" },
    { name: "Dior", category: "Luxury" },
    { name: "Dolce & Gabbana", category: "Designer" },
    { name: "Givenchy", category: "Luxury" },
    { name: "Gucci", category: "Fashion" },
    { name: "Guerlain", category: "Luxury" },
    { name: "Hermès", category: "Luxury" },
    { name: "Hugo Boss", category: "Designer" },
    { name: "Jean Paul Gaultier", category: "Designer" },
    { name: "Jo Malone", category: "Niche" },
    { name: "Lancôme", category: "Luxury" },
    { name: "Le Labo", category: "Niche" },
    { name: "Maison Francis Kurkdjian", category: "Niche" },
    { name: "Maison Margiela", category: "Niche" },
    { name: "Prada", category: "Fashion" },
    { name: "Ralph Lauren", category: "Fashion" },
    { name: "Tom Ford", category: "Luxury" },
    { name: "Valentino", category: "Fashion" },
    { name: "Versace", category: "Fashion" },
    { name: "Yves Saint Laurent", category: "Luxury" },
];

const categories = ["Tutti", "Luxury", "Niche", "Designer", "Fashion"];

export default function BrandsPage() {
    return (
        <div className="w-full pt-40 pb-24">
            {/* Header */}
            <div className="container-page mb-24">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-border-primary pb-12">
                    <div>
                        <h1 className="font-serif text-5xl md:text-7xl mb-4">Brands.</h1>
                        <p className="max-w-xl text-lg text-text-secondary leading-relaxed">
                            Una selezione curata delle maison più prestigiose.
                        </p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="CERCA BRAND"
                            className="w-full md:w-64 bg-transparent border-b border-text-primary py-2 text-sm uppercase tracking-widest placeholder:text-text-muted outline-none focus:border-text-secondary transition-colors"
                        />
                        <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Featured */}
            <div className="container-page mb-32">
                <span className="block font-mono text-xs uppercase tracking-widest mb-12 text-text-muted">In Evidenza</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredBrands.map((brand, i) => (
                        <Link key={brand.name} href="#" className="group block h-full min-h-[300px] border border-border-primary p-8 hover:bg-text-primary hover:text-text-inverted transition-colors duration-500 flex flex-col justify-between">
                            <span className="font-mono text-xs">0{i + 1}</span>
                            <div>
                                <h3 className="font-serif text-3xl mb-2">{brand.name}</h3>
                                <p className="text-sm opacity-60 group-hover:opacity-80">{brand.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Directory */}
            <div className="container-page">
                <div className="flex flex-col md:flex-row justify-between mb-16 gap-8">
                    <h2 className="font-serif text-4xl">Directory</h2>
                    <div className="flex flex-wrap gap-4">
                        {categories.map(cat => (
                            <button key={cat} className="text-sm uppercase tracking-widest hover:underline underline-offset-4 decoration-1">{cat}</button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {allBrands.map(brand => (
                        <Link key={brand.name} href="#" className="group flex items-baseline justify-between py-4 border-b border-border-secondary hover:border-text-primary transition-colors">
                            <span className="text-lg group-hover:pl-2 transition-all duration-300">{brand.name}</span>
                            <span className="text-[10px] uppercase text-text-muted">{brand.category}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
