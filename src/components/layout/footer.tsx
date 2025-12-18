import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
    discover: {
        title: "Scopri",
        links: [
            { label: "Esplora fragranze", href: "/explore" },
            { label: "Top fragranze", href: "/explore?sort=rating" },
            { label: "Nuove uscite", href: "/explore?sort=new" },
            { label: "Brand", href: "/brands" },
        ],
    },
    categories: {
        title: "Categorie",
        links: [
            { label: "Maschili", href: "/explore?gender=masculine" },
            { label: "Femminili", href: "/explore?gender=feminine" },
            { label: "Unisex", href: "/explore?gender=unisex" },
            { label: "Niche", href: "/explore?type=niche" },
        ],
    },
    resources: {
        title: "Risorse",
        links: [
            { label: "Note olfattive", href: "/notes" },
            { label: "Guida alle fragranze", href: "/guide" },
            { label: "Blog", href: "/blog" },
            { label: "Community", href: "/community" },
        ],
    },
    legal: {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Termini di servizio", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Contatti", href: "/contact" },
        ],
    },
};

const socialLinks = [
    { label: "Twitter", href: "https://twitter.com", icon: Twitter },
    { label: "Instagram", href: "https://instagram.com", icon: Instagram },
    { label: "GitHub", href: "https://github.com", icon: Github },
];

/**
 * Modern footer with multiple columns and social links
 */
export function Footer() {
    return (
        <footer className="border-t border-border-primary bg-bg-secondary">
            {/* Main Footer */}
            <div className="container-page py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-6">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex text-text-primary transition-colors hover:text-accent">
                            <Logo size="lg" />
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
                            Il database italiano delle fragranze. Scopri, esplora e trova
                            il tuo profumo perfetto tra oltre 24.000 fragranze.
                        </p>
                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-primary text-text-muted transition-all hover:border-accent hover:text-accent"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key}>
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-primary">
                                {section.title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-text-muted transition-colors hover:text-accent"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border-primary">
                <div className="container-page flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                    <p className="text-sm text-text-muted">
                        © {new Date().getFullYear()} Sillage. Tutti i diritti riservati.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-text-muted">
                        <Link href="/privacy" className="transition-colors hover:text-text-primary">
                            Privacy
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-text-primary">
                            Termini
                        </Link>
                        <Link href="/cookies" className="transition-colors hover:text-text-primary">
                            Cookie
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
