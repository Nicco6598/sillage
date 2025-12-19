import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getUniqueNotes, getDatabaseStats } from "@/lib/fragrance-db";

// Olfactory families with icons represented as emojis for simplicity
const olfactoryFamilies = [
    { name: "Legnosi", emoji: "🌳", description: "Caldi, terrosi, avvolgenti", examples: ["Sandalo", "Cedro", "Vetiver"] },
    { name: "Freschi", emoji: "💨", description: "Brezza, pulizia, vitalità", examples: ["Menta", "Eucalipto", "Ozono"] },
    { name: "Orientali", emoji: "🔥", description: "Spezie, resine, profondità", examples: ["Ambra", "Incenso", "Oud"] },
    { name: "Floreali", emoji: "🌸", description: "Romantici, naturali, classici", examples: ["Rosa", "Gelsomino", "Iris"] },
    { name: "Agrumati", emoji: "🍋", description: "Energici, frizzanti, solari", examples: ["Bergamotto", "Limone", "Pompelmo"] },
    { name: "Muschiati", emoji: "🤍", description: "Sensuali, morbidi, pelle", examples: ["Muschio Bianco", "Cashmeran"] },
    { name: "Acquatici", emoji: "💧", description: "Cristallini, puri, marini", examples: ["Note Marine", "Calone"] },
    { name: "Speziati", emoji: "🌶️", description: "Intensi, piccanti, vibranti", examples: ["Pepe", "Cardamomo", "Zafferano"] },
];

const pyramidLevels = [
    {
        number: "01",
        name: "Testa",
        description: "L'impatto immediato. Freschezza effimera che dura minuti.",
        notes: ["Agrumi", "Note Verdi", "Aromatici Leggeri"],
        duration: "5-15 min"
    },
    {
        number: "02",
        name: "Cuore",
        description: "L'anima della fragranza. Si sviluppa dopo pochi minuti.",
        notes: ["Fiori", "Frutta", "Spezie Delicate"],
        duration: "15 min - 3 ore"
    },
    {
        number: "03",
        name: "Fondo",
        description: "La memoria. Persiste per ore o giorni sulla pelle.",
        notes: ["Legni", "Muschi", "Ambra & Resine"],
        duration: "3+ ore"
    },
];

export default async function NotesPage() {
    const [allNotes, stats] = await Promise.all([
        getUniqueNotes(),
        getDatabaseStats()
    ]);

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                    Note<span className="text-copper">.</span>
                                </h1>
                                <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                    L'alfabeto invisibile delle fragranze. Ogni nota racconta una storia.
                                </p>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap gap-8 pt-8 border-t border-border-primary">
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-copper">{stats.notes.toLocaleString()}</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Note</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-gold">8</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Famiglie</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-3xl text-rose-gold">3</span>
                                <span className="text-sm text-text-muted uppercase tracking-wide">Livelli Piramide</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pyramid Section */}
            <div className="container-page mb-24 md:mb-32">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-8 h-px bg-copper" />
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                        Architettura Olfattiva
                    </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {pyramidLevels.map((level) => (
                        <div
                            key={level.number}
                            className="group p-8 border border-border-primary hover:border-copper/50 transition-colors"
                        >
                            <span className="font-serif text-4xl text-copper/30 group-hover:text-copper transition-colors">
                                {level.number}
                            </span>
                            <h3 className="font-serif text-2xl mt-4 mb-2">{level.name}</h3>
                            <p className="text-sm text-text-secondary mb-6">{level.description}</p>

                            <div className="space-y-2 mb-4">
                                {level.notes.map((note) => (
                                    <span
                                        key={note}
                                        className="inline-block mr-2 text-xs font-mono uppercase tracking-wider text-text-muted"
                                    >
                                        {note}
                                    </span>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-border-secondary">
                                <span className="text-[10px] uppercase tracking-widest text-text-muted">
                                    Durata: {level.duration}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Olfactory Families */}
            <div className="bg-bg-secondary border-y border-border-primary">
                <div className="container-page py-24">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-px bg-gold" />
                            <h2 className="font-serif text-3xl md:text-4xl">Famiglie Olfattive</h2>
                        </div>
                        <Link
                            href="/explore"
                            className="hidden md:flex items-center gap-2 text-sm text-text-secondary hover:text-copper transition-colors"
                        >
                            <span>Esplora fragranze</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {olfactoryFamilies.map((family) => (
                            <Link
                                key={family.name}
                                href={`/explore?accord=${family.name.toLowerCase()}`}
                                className="group p-6 bg-bg-primary border border-border-primary hover:border-copper transition-all duration-300"
                            >
                                <span className="text-3xl mb-4 block">{family.emoji}</span>
                                <h3 className="font-serif text-xl mb-1 group-hover:text-copper transition-colors">
                                    {family.name}
                                </h3>
                                <p className="text-sm text-text-muted mb-4">{family.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {family.examples.map((ex) => (
                                        <span
                                            key={ex}
                                            className="text-[10px] uppercase tracking-wider px-2 py-1 bg-bg-tertiary text-text-muted"
                                        >
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Notes List */}
            {allNotes.length > 0 && (
                <div className="container-page py-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-8 h-px bg-rose-gold" />
                        <h2 className="font-serif text-3xl">Tutte le Note</h2>
                        <span className="text-sm text-text-muted">({allNotes.length})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {allNotes.slice(0, 100).map((note) => (
                            <Link
                                key={note}
                                href={`/explore?note=${encodeURIComponent(note)}`}
                                className="px-3 py-1.5 text-sm border border-border-primary hover:border-copper hover:text-copper transition-colors"
                            >
                                {note}
                            </Link>
                        ))}
                        {allNotes.length > 100 && (
                            <span className="px-3 py-1.5 text-sm text-text-muted">
                                +{allNotes.length - 100} altre
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
