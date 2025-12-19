import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy | Sillage",
    description: "Informativa sui cookie di Sillage. Come utilizziamo i cookie e le tue opzioni.",
};

const cookieTypes = [
    {
        name: "Cookie Tecnici",
        description: "Essenziali per il funzionamento del sito",
        examples: ["Sessione utente", "Preferenze lingua", "Carrello"],
        required: true,
    },
    {
        name: "Cookie Analitici",
        description: "Ci aiutano a capire come utilizzi il sito",
        examples: ["Google Analytics", "Statistiche di navigazione"],
        required: false,
    },
    {
        name: "Cookie di Preferenza",
        description: "Memorizzano le tue preferenze",
        examples: ["Tema chiaro/scuro", "Fragranze preferite", "Filtri salvati"],
        required: false,
    },
];

const sections = [
    {
        title: "Cosa sono i Cookie",
        content: `I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. 
        Servono a ricordare le tue preferenze, migliorare l'esperienza di navigazione e raccogliere informazioni anonime sull'utilizzo del sito.`
    },
    {
        title: "Come Utilizziamo i Cookie",
        content: `Utilizziamo i cookie per:
        
        • Mantenere la tua sessione attiva mentre navighi
        • Ricordare le tue preferenze (tema, lingua)
        • Analizzare come viene utilizzato il nostro sito
        • Migliorare le prestazioni e l'esperienza utente
        • Personalizzare i contenuti in base ai tuoi interessi`
    },
    {
        title: "Cookie di Terze Parti",
        content: `Il nostro sito può utilizzare servizi di terze parti che impostano i propri cookie:
        
        • Google Analytics: per analisi statistiche anonime
        • Supabase: per l'autenticazione e la gestione dei dati
        
        Questi servizi hanno le proprie informative sulla privacy che ti invitiamo a consultare.`
    },
    {
        title: "Gestione dei Cookie",
        content: `Puoi gestire le tue preferenze sui cookie in diversi modi:
        
        • Dalle impostazioni del tuo browser
        • Dal banner dei cookie mostrato alla prima visita
        • Dalla sezione "Preferenze Cookie" nelle impostazioni del tuo profilo
        
        Nota: disabilitare alcuni cookie potrebbe influire sulla funzionalità del sito.`
    },
    {
        title: "Durata dei Cookie",
        content: `I cookie utilizzati hanno diverse durate:
        
        • Cookie di sessione: vengono eliminati alla chiusura del browser
        • Cookie persistenti: rimangono per un periodo definito (es. 30 giorni, 1 anno)
        • Cookie tecnici: durata necessaria per la funzionalità richiesta`
    },
];

export default function CookiesPage() {
    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                Cookie<span className="text-copper">.</span>
                            </h1>
                            <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                Come utilizziamo i cookie per migliorare la tua esperienza.
                            </p>
                        </div>

                        {/* Last Update */}
                        <div className="flex items-center gap-4 pt-8 border-t border-border-primary">
                            <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
                                Ultimo aggiornamento
                            </span>
                            <span className="text-sm text-text-secondary">19 Dicembre 2024</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cookie Types Grid */}
            <div className="container-page mb-16 md:mb-24">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-px bg-copper" />
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                        Tipi di Cookie
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cookieTypes.map((cookie) => (
                        <div
                            key={cookie.name}
                            className="p-6 border border-border-primary hover:border-copper/50 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-serif text-xl">{cookie.name}</h3>
                                {cookie.required && (
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-copper/10 text-copper font-mono">
                                        Richiesto
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary mb-4">{cookie.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {cookie.examples.map((ex) => (
                                    <span
                                        key={ex}
                                        className="text-[10px] uppercase tracking-wider px-2 py-1 bg-bg-tertiary text-text-muted"
                                    >
                                        {ex}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="container-page">
                <div className="max-w-3xl">
                    <div className="space-y-12">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h2 className="font-serif text-xl md:text-2xl mb-4">{section.title}</h2>
                                <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Related Links */}
                    <div className="mt-16 pt-8 border-t border-border-primary flex flex-wrap gap-4">
                        <Link
                            href="/privacy"
                            className="text-sm text-text-muted hover:text-copper transition-colors"
                        >
                            Privacy Policy →
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-text-muted hover:text-copper transition-colors"
                        >
                            Termini di Servizio →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
