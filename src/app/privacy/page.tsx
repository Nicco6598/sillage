import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Sillage",
    description: "Informativa sulla privacy di Sillage. Come raccogliamo, utilizziamo e proteggiamo i tuoi dati.",
};

const sections = [
    {
        title: "1. Titolare del Trattamento",
        content: `Il titolare del trattamento dei dati personali è Sillage S.r.l., con sede legale in Milano, Italia. 
        Per qualsiasi domanda relativa alla privacy, puoi contattarci all'indirizzo privacy@sillage.app.`
    },
    {
        title: "2. Dati Raccolti",
        content: `Raccogliamo i seguenti tipi di dati:
        
        • Dati di registrazione: nome, email, password criptata
        • Dati di navigazione: pagine visitate, fragranze consultate, preferenze salvate
        • Dati tecnici: indirizzo IP, tipo di browser, dispositivo utilizzato
        • Dati delle recensioni: contenuto delle recensioni, valutazioni, date di pubblicazione`
    },
    {
        title: "3. Finalità del Trattamento",
        content: `I tuoi dati vengono utilizzati per:
        
        • Gestire il tuo account e fornire i nostri servizi
        • Personalizzare l'esperienza utente e i suggerimenti di fragranze
        • Inviare comunicazioni relative al servizio
        • Analizzare l'utilizzo della piattaforma per migliorare i nostri servizi
        • Adempiere agli obblighi di legge`
    },
    {
        title: "4. Base Giuridica",
        content: `Il trattamento dei dati si basa su:
        
        • Il tuo consenso esplicito
        • L'esecuzione del contratto di servizio
        • I nostri legittimi interessi commerciali
        • L'adempimento di obblighi legali`
    },
    {
        title: "5. Conservazione dei Dati",
        content: `I dati personali vengono conservati per il tempo necessario al raggiungimento delle finalità per cui sono stati raccolti, 
        e comunque non oltre 5 anni dalla cessazione del rapporto contrattuale, salvo obblighi di legge che richiedano un periodo di conservazione più lungo.`
    },
    {
        title: "6. Condivisione dei Dati",
        content: `I tuoi dati possono essere condivisi con:
        
        • Fornitori di servizi tecnici (hosting, analytics)
        • Autorità competenti, se richiesto dalla legge
        
        Non vendiamo mai i tuoi dati personali a terzi per finalità di marketing.`
    },
    {
        title: "7. I Tuoi Diritti",
        content: `Ai sensi del GDPR, hai diritto di:
        
        • Accedere ai tuoi dati personali
        • Rettificare dati inesatti
        • Cancellare i tuoi dati ("diritto all'oblio")
        • Limitare il trattamento
        • Portabilità dei dati
        • Opporti al trattamento
        • Revocare il consenso in qualsiasi momento
        
        Per esercitare questi diritti, contattaci a privacy@sillage.app.`
    },
    {
        title: "8. Sicurezza",
        content: `Adottiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati personali, 
        inclusa la crittografia dei dati sensibili, l'accesso limitato ai dati e backup regolari.`
    },
    {
        title: "9. Modifiche alla Policy",
        content: `Ci riserviamo il diritto di modificare questa informativa. Le modifiche saranno pubblicate su questa pagina 
        con indicazione della data di ultimo aggiornamento. Ti invitiamo a consultare periodicamente questa pagina.`
    },
];

export default function PrivacyPage() {
    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            {/* Hero Header */}
            <div className="container-page mb-16 md:mb-24">
                <div className="relative">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
                                Privacy<span className="text-copper">.</span>
                            </h1>
                            <p className="max-w-lg text-lg text-text-secondary leading-relaxed">
                                Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.
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
                    <div className="space-y-12">
                        {sections.map((section) => (
                            <div key={section.title} className="group">
                                <h2 className="font-serif text-xl md:text-2xl mb-4">{section.title}</h2>
                                <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="mt-16 pt-8 border-t border-border-primary">
                        <h2 className="font-serif text-xl mb-4">Contatti</h2>
                        <p className="text-text-secondary mb-4">
                            Per domande sulla nostra privacy policy, contattaci:
                        </p>
                        <p className="text-copper">privacy@sillage.app</p>
                    </div>

                    {/* Related Links */}
                    <div className="mt-12 flex flex-wrap gap-4">
                        <Link
                            href="/terms"
                            className="text-sm text-text-muted hover:text-copper transition-colors"
                        >
                            Termini di Servizio →
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
