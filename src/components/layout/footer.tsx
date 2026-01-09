"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";

const footerLinks = {
    Esplora: [
        { label: "Tutte le Fragranze", href: "/explore" },
        { label: "Brands", href: "/brands" },
        { label: "Novità", href: "/explore?sort=newest" },
    ],
    Risorse: [
        { label: "Chi Siamo", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contatti", href: "/contact" },
        { label: "Blog", href: "/blog" },
    ],
    Legal: [
        { label: "Privacy", href: "/privacy" },
        { label: "Termini", href: "/terms" },
        { label: "Cookie", href: "/cookies" },
    ],
};

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="relative bg-bg-secondary border-t border-border-primary">
            <div className="container-page">
                {/* Main Footer Content */}
                <div className="py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <Logo size="lg" className="text-text-primary" />
                            <p className="font-serif text-2xl md:text-3xl leading-tight max-w-md">
                                Il profumo è l&apos;arte <br />
                                <span className="text-text-tertiary">della memoria.</span>
                            </p>

                            {/* Newsletter */}
                            <div className="pt-4">
                                <p className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">
                                    Newsletter
                                </p>
                                <form className="group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="email"
                                            placeholder="La tua email..."
                                            className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 text-sm placeholder:text-text-muted outline-none focus:border-copper transition-colors"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-0 h-full px-4 bg-text-primary text-text-inverted hover:bg-copper transition-colors"
                                        >
                                            <Mail className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                                {Object.entries(footerLinks).map(([category, links]) => (
                                    <div key={category}>
                                        <h4 className="font-serif text-lg mb-6">{category}</h4>
                                        <ul className="space-y-3">
                                            {links.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className="group inline-flex items-center gap-1 text-sm text-text-secondary hover:text-copper transition-colors"
                                                    >
                                                        <span>{link.label}</span>
                                                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-border-primary" />

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-xs text-text-muted">
                        <span className="font-mono uppercase tracking-widest">© 2025 Sillage</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline">Crafted with passion</span>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-copper transition-colors"
                    >
                        <span>Torna su</span>
                        <div className="w-8 h-8 flex items-center justify-center border border-border-primary group-hover:border-copper group-hover:bg-copper/5 transition-all duration-300 group-hover:-translate-y-0.5">
                            <ArrowUp className="h-3 w-3" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}
