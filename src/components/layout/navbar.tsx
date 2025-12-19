"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { surpriseMe } from "@/app/actions/discovery";
import { Search, Heart, Menu, X, Sparkles, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Esplora", href: "/explore" },
    { label: "Brands", href: "/brands" },
    { label: "Note", href: "/notes" },
    { label: "Community", href: "/community" },
];

/**
 * Navbar - 2025 Design aligned with Stone & Silk aesthetic
 */
export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

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
                        ? "bg-bg-primary/90 backdrop-blur-md border-b border-border-primary"
                        : "bg-transparent"
                )}
            >
                <div className="container-page">
                    <div className={cn(
                        "flex items-center justify-between transition-all duration-300",
                        isScrolled ? "h-16" : "h-20"
                    )}>
                        {/* Logo */}
                        <Link href="/" className="relative z-50">
                            <Logo size="md" className="text-text-primary" />
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative group py-2"
                                    >
                                        <span className={cn(
                                            "text-sm tracking-wide transition-colors",
                                            isActive ? "text-copper" : "text-text-secondary hover:text-text-primary"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className={cn(
                                            "absolute bottom-0 left-0 h-px bg-copper transition-all duration-300",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Link
                                href="/explore"
                                className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                aria-label="Cerca"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </Link>

                            <Link
                                href="/favorites"
                                className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                                aria-label="Preferiti"
                            >
                                <Heart className="h-[18px] w-[18px]" />
                            </Link>

                            <button
                                onClick={() => surpriseMe()}
                                className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-gold hover:bg-bg-tertiary transition-colors cursor-pointer"
                                aria-label="Sorprendimi"
                            >
                                <Sparkles className="h-[18px] w-[18px]" />
                            </button>

                            <div className="w-px h-5 bg-border-primary mx-2" />

                            <ThemeToggle />

                            <Link
                                href="/login"
                                className="ml-4 px-5 py-2 text-xs uppercase tracking-widest border border-text-primary text-text-primary hover:bg-text-primary hover:text-text-inverted transition-colors"
                            >
                                Accedi
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center text-text-primary"
                            aria-label="Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Full Screen Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-bg-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Content */}
                <div className={cn(
                    "relative h-full flex flex-col bg-bg-primary transition-transform duration-500",
                    isMobileMenuOpen ? "translate-y-0" : "-translate-y-8"
                )}>
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between px-6 h-16 border-b border-border-primary">
                        <Logo size="md" className="text-text-primary" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-bg-tertiary transition-colors"
                            aria-label="Chiudi"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <div className="px-6 py-6 border-b border-border-primary">
                        <form onSubmit={handleMobileSearch} className="relative">
                            <div className="absolute inset-0 bg-bg-tertiary/50 -z-10 border border-border-primary" />
                            <input
                                type="text"
                                value={mobileSearchQuery}
                                onChange={(e) => setMobileSearchQuery(e.target.value)}
                                placeholder="Cerca fragranze..."
                                className="w-full bg-transparent px-4 py-3 pr-12 text-base placeholder:text-text-muted outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-text-muted"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="space-y-2">
                            {[{ label: "Home", href: "/" }, ...navItems].map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "group flex items-center justify-between py-4 border-b border-border-secondary/50 transition-colors",
                                            isActive ? "border-copper" : "hover:border-copper"
                                        )}
                                    >
                                        <div className="flex items-baseline gap-4">
                                            <span className={cn(
                                                "text-xs font-mono",
                                                isActive ? "text-copper" : "text-text-muted"
                                            )}>
                                                0{index + 1}
                                            </span>
                                            <span className={cn(
                                                "font-serif text-2xl transition-colors",
                                                isActive ? "text-copper" : "text-text-primary group-hover:text-copper"
                                            )}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <ArrowUpRight className={cn(
                                            "h-4 w-4 transition-all",
                                            isActive
                                                ? "text-copper opacity-100"
                                                : "text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-copper"
                                        )} />
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="px-6 py-6 border-t border-border-primary bg-bg-secondary/30">
                        {/* Actions Row */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/favorites"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 border border-border-primary text-sm hover:border-copper hover:text-copper transition-colors"
                            >
                                <Heart className="h-4 w-4" />
                                <span>Preferiti</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    surpriseMe();
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-3 border border-border-primary text-sm hover:border-gold hover:text-gold transition-colors cursor-pointer"
                            >
                                <Sparkles className="h-4 w-4" />
                                <span>Random</span>
                            </button>

                            <ThemeToggle />
                        </div>

                        {/* Login Button */}
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex w-full items-center justify-center py-4 bg-text-primary text-text-inverted text-sm uppercase tracking-widest hover:bg-copper transition-colors"
                        >
                            Accedi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
