import Link from "next/link";
import { TreeDeciduous, Wind, Flame, Flower2, Citrus, Heart, Droplets } from "lucide-react";

const olfactoryFamilies = [
    { name: "Legnosi", icon: TreeDeciduous, description: "Caldi, terrosi, avvolgenti." },
    { name: "Freschi", icon: Wind, description: "Brezza, pulizia, vitalità." },
    { name: "Orientali", icon: Flame, description: "Spezie, resine, profondità." },
    { name: "Floreali", icon: Flower2, description: "Romantici, naturali, classici." },
    { name: "Agrumati", icon: Citrus, description: "Energici, frizzanti, solari." },
    { name: "Muschiati", icon: Heart, description: "Sensuali, morbidi, seconda pelle." },
    { name: "Acquatici", icon: Droplets, description: "Cristallini, puri, ozonici." },
    { name: "Speziati", icon: Flame, description: "Intensi, piccanti, vibranti." },
];

export default function NotesPage() {
    return (
        <div className="w-full pt-40 pb-24">
            {/* Editorial Header */}
            <div className="container-page mb-32">
                <div className="border-b border-border-primary pb-8">
                    <h1 className="font-serif text-5xl md:text-7xl mb-8">Note.</h1>
                    <p className="max-w-2xl text-xl text-text-secondary font-serif italic">
                        "Il profumo è l'invisibile, indimenticabile, ultimo accessorio della moda."
                    </p>
                </div>
            </div>

            {/* Pyramid - Minimal Typographic */}
            <div className="container-page mb-32">
                <h2 className="font-mono text-xs uppercase tracking-widest mb-16 border-t border-text-primary pt-4 inline-block">Architettura Olfattiva</h2>

                <div className="grid md:grid-cols-3 gap-12 md:gap-0 relative">
                    {/* Connecting line - hidden on mobile */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-[1px] bg-border-primary -z-10" />

                    <div className="bg-bg-primary pt-8 md:pr-8">
                        <span className="text-4xl font-serif block mb-4">01</span>
                        <h3 className="text-xl uppercase tracking-widest font-bold mb-2">Testa</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">L'impatto immediato. Freschezza effimera che dura minuti.</p>
                        <ul className="text-sm font-mono text-text-muted space-y-1">
                            <li>Agrumi</li>
                            <li>Note Verdi</li>
                            <li>Aromatici Leggeri</li>
                        </ul>
                    </div>

                    <div className="bg-bg-primary pt-8 md:px-8 md:border-l border-border-primary">
                        <span className="text-4xl font-serif block mb-4">02</span>
                        <h3 className="text-xl uppercase tracking-widest font-bold mb-2">Cuore</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">L'anima della fragranza. Si sviluppa dopo pochi minuti.</p>
                        <ul className="text-sm font-mono text-text-muted space-y-1">
                            <li>Fiori</li>
                            <li>Frutta</li>
                            <li>Spezie Delicate</li>
                        </ul>
                    </div>

                    <div className="bg-bg-primary pt-8 md:pl-8 md:border-l border-border-primary">
                        <span className="text-4xl font-serif block mb-4">03</span>
                        <h3 className="text-xl uppercase tracking-widest font-bold mb-2">Fondo</h3>
                        <p className="text-text-secondary text-sm leading-relaxed mb-4">La memoria. Persiste per ore o giorni sulla pelle.</p>
                        <ul className="text-sm font-mono text-text-muted space-y-1">
                            <li>Legni</li>
                            <li>Muschi</li>
                            <li>Ambra & Resine</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Families Grid - Very Minimal */}
            <div className="bg-bg-secondary py-24">
                <div className="container-page">
                    <div className="flex justify-between items-end mb-16 px-2">
                        <h2 className="font-serif text-4xl">Famiglie</h2>
                        <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Explore All</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-border-primary">
                        {olfactoryFamilies.map((family) => {
                            const Icon = family.icon;
                            return (
                                <Link
                                    key={family.name}
                                    href={`/explore?family=${family.name.toLowerCase()}`}
                                    className="group p-8 border-r border-b border-border-primary hover:bg-bg-primary transition-colors aspect-square flex flex-col justify-between"
                                >
                                    <Icon className="h-6 w-6 text-text-muted group-hover:text-text-primary transition-colors" />
                                    <div>
                                        <h3 className="font-serif text-2xl mb-2">{family.name}</h3>
                                        <p className="text-xs text-text-muted group-hover:text-text-secondary uppercase tracking-widest">{family.description}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
