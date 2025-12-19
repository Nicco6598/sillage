"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Heart, User, Menu, X } from "lucide-react";
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
 * Ultra-Minimal Navbar - 2025 Complete Rework
 * Clean, spacious, search in mobile menu
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
                    "fixed left-0 right-0 top-0 z-50 transition-all duration-400",
                    isScrolled
                        ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-primary/50 py-1.5"
                        : "bg-transparent py-2 lg:py-3"
                )}
            >
                <div className="container-page">
                    <div className="flex items-center justify-between">
                        {/* Logo - Smaller on mobile */}
                        <Link href="/" className="z-50">
                            <Logo size="md" className="lg:hidden" />
                            <Logo size="lg" className="hidden lg:block" />
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative group"
                                    >
                                        <span className={cn(
                                            "text-[13px] font-medium tracking-wide transition-colors uppercase",
                                            isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className={cn(
                                            "absolute -bottom-1 left-0 h-[1px] bg-text-primary transition-all duration-300",
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
                                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                                aria-label="Search"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </Link>

                            <Link
                                href="/favorites"
                                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                                aria-label="Favorites"
                            >
                                <Heart className="h-[18px] w-[18px]" />
                            </Link>

                            <div className="mx-1">
                                <ThemeToggle />
                            </div>

                            <Link
                                href="/login"
                                className="ml-2 px-3 py-1.5 text-xs font-medium uppercase tracking-wider border border-border-primary hover:bg-bg-secondary transition-colors"
                            >
                                Accedi
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-text-primary"
                            aria-label="Menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Full Screen */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-bg-primary transition-all duration-500 lg:hidden",
                    isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-primary">
                    <Logo size="md" />
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-text-primary"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search Bar - Mobile Only */}
                <div className="px-6 pt-6 pb-4 border-b border-border-primary">
                    <form onSubmit={handleMobileSearch} className="relative">
                        <input
                            type="text"
                            value={mobileSearchQuery}
                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                            placeholder="CERCA FRAGRANZE..."
                            className="w-full bg-bg-secondary border border-border-primary px-4 py-3 text-sm uppercase tracking-wider outline-none focus:border-text-primary transition-colors placeholder:text-text-muted"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </form>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col px-6 py-8 gap-1 overflow-y-auto">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                            "py-4 text-2xl font-serif transition-colors border-b border-border-primary",
                            pathname === "/" ? "text-text-primary" : "text-text-muted"
                        )}
                    >
                        Home
                    </Link>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "py-4 text-2xl font-serif transition-colors border-b border-border-primary",
                                    isActive ? "text-text-primary" : "text-text-muted"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-border-primary flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/favorites"
                            className="p-2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            <Heart className="h-5 w-5" />
                        </Link>
                    </div>
                    <Link
                        href="/login"
                        className="px-4 py-2 text-xs font-medium uppercase tracking-wider border border-border-primary hover:bg-bg-secondary transition-colors"
                    >
                        Accedi
                    </Link>
                </div>
            </div>
        </>
    );
}
