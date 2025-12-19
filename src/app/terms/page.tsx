import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termini di Servizio | Sillage",
    description: "Termini e condizioni d'uso della piattaforma Sillage.",
};

const sections = [
    {
        title: "1. Accettazione dei Termini",
        content: `Utilizzando Sillage, accetti di essere vincolato da questi Termini di Servizio. 
        Se non accetti questi termini, ti preghiamo di non utilizzare il nostro servizio.
        
        Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive 
        dal momento della pubblicazione su questa pagina.`
    },
    {
        title: "2. Descrizione del Servizio",
        content: `Sillage è una piattaforma dedicata al mondo delle fragranze che offre:
        
        • Database completo di fragranze con informazioni dettagliate
        • Sistema di recensioni e valutazioni
        • Community per discussioni e condivisione
        • Strumenti di ricerca e scoperta personalizzati
        • Gestione della propria collezione di fragranze`
    },
    {
        title: "3. Account Utente",
        content: `Per accedere a determinate funzionalità, è necessario creare un account. Sei responsabile di:
        
        • Fornire informazioni accurate e complete
        • Mantenere la sicurezza delle tue credenziali
        • Tutte le attività che avvengono tramite il tuo account
        • Notificarci immediatamente di qualsiasi uso non autorizzato
        
        Ci riserviamo il diritto di sospendere o terminare account che violano questi termini.`
    },
    {
        title: "4. Contenuti degli Utenti",
        content: `Pubblicando contenuti su Sillage (recensioni, commenti, immagini):
        
        • Mantieni la proprietà dei tuoi contenuti originali
        • Ci concedi una licenza non esclusiva per utilizzare, modificare e distribuire tali contenuti
        • Garantisci che i contenuti non violino diritti di terzi
        • Accetti che i contenuti siano pubblicamente visibili
        
        Ci riserviamo il diritto di rimuovere contenuti che violano questi termini o le nostre linee guida.`
    },
    {
        title: "5. Comportamento Accettabile",
        content: `Gli utenti si impegnano a:
        
        • Rispettare gli altri membri della community
        • Non pubblicare contenuti offensivi, diffamatori o illegali
        • Non utilizzare il servizio per spam o attività fraudolente
        • Non tentare di accedere a dati o funzionalità non autorizzate
        • Non interferire con il funzionamento della piattaforma`
    },
    {
        title: "6. Proprietà Intellettuale",
        content: `Tutti i contenuti di Sillage (design, logo, testi, codice) sono di nostra proprietà o concessi in licenza.
        
        Non è consentito:
        • Copiare o riprodurre i nostri contenuti senza autorizzazione
        • Utilizzare il nostro marchio senza permesso
        • Effettuare scraping o raccolta automatica di dati`
    },
    {
        title: "7. Limitazione di Responsabilità",
        content: `Sillage viene fornito "così com'è" senza garanzie di alcun tipo.
        
        Non siamo responsabili per:
        • Interruzioni o malfunzionamenti del servizio
        • Perdita di dati
        • Danni derivanti dall'utilizzo della piattaforma
        • Contenuti pubblicati dagli utenti
        • Accuratezza delle informazioni sulle fragranze`
    },
    {
        title: "8. Modifiche al Servizio",
        content: `Ci riserviamo il diritto di:
        
        • Modificare o interrompere qualsiasi funzionalità
        • Aggiornare questi termini
        • Modificare i prezzi dei servizi premium (con preavviso)
        
        Ti informeremo di cambiamenti significativi tramite email o notifica in-app.`
    },
    {
        title: "9. Legge Applicabile",
        content: `Questi termini sono regolati dalla legge italiana. 
        Per qualsiasi controversia sarà competente il Foro di Milano.`
    },
];

export default function TermsPage() {
    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                Termini<span className="text-copper">.</span>
                            </h1>
                            <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                Termini e condizioni d'uso della piattaforma Sillage.
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

            {/* Content */}
            <div className="container-page">
                <div className="max-w-3xl">
                    {/* Quick Summary */}
                    <div className="p-6 bg-bg-secondary border border-border-primary mb-12">
                        <h2 className="font-serif text-lg mb-3">In Breve</h2>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="text-copper">•</span>
                                Rispetta la community e gli altri utenti
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-copper">•</span>
                                Sei responsabile del tuo account e dei tuoi contenuti
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-copper">•</span>
                                Non pubblicare contenuti offensivi o illegali
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-copper">•</span>
                                Rispetta la proprietà intellettuale altrui
                            </li>
                        </ul>
                    </div>

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

                    {/* Contact */}
                    <div className="mt-16 pt-8 border-t border-border-primary">
                        <h2 className="font-serif text-xl mb-4">Domande?</h2>
                        <p className="text-text-secondary mb-4">
                            Per domande sui nostri termini di servizio, contattaci:
                        </p>
                        <p className="text-copper">legal@sillage.app</p>
                    </div>

                    {/* Related Links */}
                    <div className="mt-12 flex flex-wrap gap-4">
                        <Link
                            href="/privacy"
                            className="text-sm text-text-muted hover:text-copper transition-colors"
                        >
                            Privacy Policy →
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-sm text-text-muted hover:text-copper transition-colors"
                        >
                            Cookie Policy →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
