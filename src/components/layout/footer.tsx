import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
    Esplora: ["Novità", "Trending", "Nicchia", "Designer", "Note Olfattive"],
    Azienda: ["Chi Siamo", "Carriere", "Stampa", "Contatti"],
    Legale: ["Termini", "Privacy", "Cookie Policy", "GDPR"],
    Social: ["Instagram", "TikTok", "Pinterest", "Spotify"],
};

export function Footer() {
    return (
        <footer className="bg-bg-primary border-t border-border-primary pt-24 pb-8 text-text-primary">
            <div className="container-page grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                {/* Brand Column */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    <Logo size="lg" />
                    <p className="text-lg text-text-secondary leading-relaxed max-w-sm text-balance">
                        Il database definitivo per la cultura olfattiva.
                        Scopri, recensisci e colleziona le fragranze che definiscono il tuo stile.
                    </p>
                </div>

                {/* Links Columns */}
                <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-mono text-xs uppercase tracking-widest mb-6 text-text-muted">{category}</h4>
                            <ul className="space-y-4">
                                {links.map(link => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm hover:text-text-tertiary transition-colors">{link}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter - Minimal Grid */}
            <div className="container-page border-t border-border-primary pt-12">
                <div className="grid md:grid-cols-2 gap-12 items-end">
                    <div>
                        <h3 className="font-serif text-3xl mb-4">Rimani aggiornato.</h3>
                        <p className="text-text-secondary text-sm">Le ultime novità dal mondo della profumeria, direttamente nella tua inbox.</p>
                    </div>
                    <div>
                        <form className="flex item-end border-b border-text-primary pb-2">
                            <input
                                type="email"
                                placeholder="LA TUA EMAIL"
                                className="w-full bg-transparent outline-none uppercase tracking-widest text-sm placeholder:text-text-muted"
                            />
                            <button className="text-xs uppercase font-bold tracking-widest ml-4 hover:opacity-70">Iscriviti</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container-page mt-24 pt-8 text-xs text-text-muted uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
                <span>© 2025 Sillage Inc. Tutti i diritti riservati.</span>
                <span className="text-[10px]">Milano • Paris • New York</span>
            </div>
        </footer>
    );
}
