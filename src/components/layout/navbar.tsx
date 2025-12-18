"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Heart, User, Menu, X, Mail, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
    description?: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/", description: "Torna alla home" },
    { label: "Esplora", href: "/explore", description: "24k+ fragranze" },
    { label: "Brands", href: "/brands", description: "I migliori marchi" },
    { label: "Note", href: "/notes", description: "Piramide olfattiva" },
    { label: "Community", href: "/community", description: "Unisciti a noi" },
];

/**
 * Modern 2025 navbar with ultra-minimal fullscreen mobile menu
 */
export function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileSearchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            // Focus search on menu open
            setTimeout(() => mobileSearchRef.current?.focus(), 300);
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleMobileSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileSearchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setMobileSearchQuery("");
        }
    };

    return (
        <>
            <header
                className={cn(
                    "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "border-b border-border-primary bg-bg-secondary/95 backdrop-blur-md shadow-sm"
                        : "bg-bg-secondary border-b border-border-primary"
                )}
            >
                {/* Row 1 */}
                <div className="border-b border-border-primary">
                    <div className="container-page">
                        <div className="flex h-16 items-center justify-between">
                            {/* Left: Contact (desktop) / Logo (mobile) */}
                            <div className="hidden items-center gap-4 text-sm text-text-muted lg:flex">
                                <a
                                    href="mailto:info@sillage.com"
                                    className="flex items-center gap-2 transition-colors hover:text-text-primary"
                                >
                                    <Mail className="h-4 w-4" />
                                    info@sillage.com
                                </a>
                            </div>

                            {/* Center: Logo */}
                            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center text-text-primary transition-colors hover:text-accent">
                                <Logo size="lg" />
                            </Link>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-3">
                                {/* Desktop: Expandable Search */}
                                <div className="relative hidden sm:block">
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <div
                                            className={cn(
                                                "flex items-center overflow-hidden rounded-full border transition-all duration-300",
                                                isSearchOpen
                                                    ? "w-64 border-accent bg-bg-tertiary"
                                                    : "w-10 border-transparent"
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                                className="flex h-10 w-10 shrink-0 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
                                                aria-label="Cerca"
                                            >
                                                <Search className="h-5 w-5" />
                                            </button>
                                            {isSearchOpen && (
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Cerca fragranze..."
                                                    className="h-10 w-full bg-transparent pr-4 text-sm text-text-primary outline-none placeholder:text-text-muted"
                                                    onBlur={() => {
                                                        if (!searchQuery) setTimeout(() => setIsSearchOpen(false), 200);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Escape") {
                                                            setIsSearchOpen(false);
                                                            setSearchQuery("");
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Desktop: Favorites */}
                                <Link
                                    href="/favorites"
                                    className="hidden h-10 w-10 items-center justify-center rounded-full border border-border-primary text-text-tertiary transition-all hover:border-accent hover:text-accent sm:flex"
                                    aria-label="Preferiti"
                                >
                                    <Heart className="h-5 w-5" />
                                </Link>

                                {/* Desktop: Theme Toggle */}
                                <div className="hidden sm:block">
                                    <ThemeToggle />
                                </div>

                                {/* Desktop: Login */}
                                <Link
                                    href="/login"
                                    className="hidden h-10 items-center gap-2 rounded-full bg-text-primary px-5 text-sm font-medium text-text-inverted transition-all hover:opacity-90 sm:flex"
                                >
                                    <User className="h-4 w-4" />
                                    Accedi
                                </Link>

                                {/* Mobile: Menu Toggle (rightmost) */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border-primary text-text-primary transition-colors hover:border-accent md:hidden"
                                    aria-label="Apri menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Desktop Navigation */}
                <div className="hidden md:block">
                    <div className="container-page">
                        <nav className="flex h-12 items-center justify-center gap-10">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Ultra Minimal 2025 */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] flex flex-col bg-bg-primary transition-all duration-500 ease-out md:hidden",
                    isMobileMenuOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                )}
            >
                {/* Top Bar */}
                <div className="flex h-16 shrink-0 items-center justify-between px-6">
                    <span className="text-sm font-medium uppercase tracking-widest text-text-muted">
                        Menu
                    </span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-tertiary text-text-primary"
                        aria-label="Chiudi"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="shrink-0 px-6 pb-6">
                    <form onSubmit={handleMobileSearch}>
                        <div className="flex items-center gap-3 rounded-2xl bg-bg-tertiary px-4">
                            <Search className="h-5 w-5 shrink-0 text-text-muted" />
                            <input
                                ref={mobileSearchRef}
                                type="text"
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                placeholder="Cerca tra 24k+ fragranze..."
                                className="h-14 w-full bg-transparent text-lg text-text-primary outline-none placeholder:text-text-muted"
                            />
                        </div>
                    </form>
                </div>

                {/* Navigation - Minimal with numbers */}
                <nav className="flex-1 overflow-auto px-6">
                    <div className="space-y-0">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex items-center justify-between border-t border-border-primary py-6 first:border-t-0"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-mono text-text-muted">
                                        0{index + 1}
                                    </span>
                                    <div>
                                        <span className="text-2xl font-semibold text-text-primary transition-colors group-hover:text-accent">
                                            {item.label}
                                        </span>
                                        {item.description && (
                                            <p className="mt-0.5 text-sm text-text-muted">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Bottom Bar */}
                <div className="shrink-0 border-t border-border-primary px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/favorites"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-primary text-text-secondary transition-colors hover:border-accent hover:text-accent"
                            >
                                <Heart className="h-5 w-5" />
                            </Link>
                            <ThemeToggle />
                        </div>
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white"
                        >
                            <User className="h-4 w-4" />
                            Accedi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
