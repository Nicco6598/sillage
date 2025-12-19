"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import { surpriseMe } from "@/app/actions/discovery";
import { Search, Heart, User, Menu, X, Sparkles } from "lucide-react";
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
                    "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-bg-primary/80 backdrop-blur-md border-b border-border-primary shadow-sm py-2"
                        : "bg-transparent py-4"
                )}
            >
                <div className="container-page px-5 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="z-50 relative">
                            <Logo size="md" className="lg:hidden text-text-primary" />
                            <Logo size="lg" className="hidden lg:block text-text-primary" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative group py-2"
                                    >
                                        <span className={cn(
                                            "text-[13px] font-medium tracking-wide transition-colors uppercase",
                                            isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className={cn(
                                            "absolute bottom-0 left-0 h-[1px] bg-text-primary transition-all duration-300",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/explore"
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
                                aria-label="Search"
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </Link>

                            <Link
                                href="/favorites"
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
                                aria-label="Favorites"
                            >
                                <Heart className="h-[18px] w-[18px]" />
                            </Link>

                            <button
                                onClick={() => surpriseMe()}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all group cursor-pointer"
                                aria-label="Sorprendimi"
                                title="Sorprendimi"
                            >
                                <Sparkles className="h-[18px] w-[18px] group-hover:text-accent transition-colors" />
                            </button>

                            <div className="mx-1 pl-1 border-l border-border-primary">
                                <ThemeToggle />
                            </div>

                            <Link
                                href="/login"
                                className="ml-4 text-xs font-medium uppercase tracking-widest border border-text-primary px-4 py-2 hover:bg-text-primary hover:text-bg-primary transition-colors"
                            >
                                Accedi
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-text-primary hover:bg-bg-secondary rounded-md"
                            aria-label="Menu"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu - Modern Full Screen with Staggered Animation */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-bg-primary/95 backdrop-blur-xl transition-all duration-500 lg:hidden flex flex-col",
                    isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                )}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-primary">
                    <Logo size="md" />
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-text-primary hover:bg-bg-secondary rounded-full transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Search - Prominent */}
                <div className="p-5">
                    <form onSubmit={handleMobileSearch} className="relative group">
                        <input
                            type="text"
                            value={mobileSearchQuery}
                            onChange={(e) => setMobileSearchQuery(e.target.value)}
                            placeholder="Cerca una fragranza..."
                            className="w-full bg-transparent border-b-2 border-border-primary py-4 text-2xl font-serif text-text-primary placeholder:text-text-muted/50 outline-none focus:border-text-primary transition-colors pr-10"
                            autoFocus={isMobileMenuOpen}
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-text-primary transition-colors p-2"
                        >
                            <Search className="h-6 w-6" />
                        </button>
                    </form>
                </div>

                {/* Navigation Links - Large & Animated */}
                <nav className="flex-1 flex flex-col px-5 py-4 gap-6 overflow-y-auto">
                    {[
                        { label: "Home", href: "/" },
                        ...navItems
                    ].map((item, index) => {
                        const isActive = pathname === item.href;
                        const number = (index + 1).toString().padStart(2, '0');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "group flex items-baseline gap-4 text-4xl sm:text-5xl font-serif tracking-tight transition-all duration-300 transform translate-y-0 hover:translate-x-4",
                                    isActive ? "text-text-primary italic" : "text-text-secondary hover:text-text-primary",
                                    isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                )}
                                style={{ transitionDelay: `${100 + index * 50}ms` }}
                            >
                                <span className={cn(
                                    "text-sm font-mono tracking-widest -mb-2",
                                    isActive ? "text-accent" : "text-text-muted group-hover:text-accent transition-colors"
                                )}>
                                    {number}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Footer Gradient Overlay */}
                <div className="p-5 border-t border-border-primary bg-gradient-to-t from-bg-secondary/50 to-transparent backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-start gap-6">
                            <ThemeToggle />

                            <Link
                                href="/favorites"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex flex-col items-center gap-1"
                            >
                                <div className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors">
                                    <Heart className="h-4 w-4 text-text-secondary group-hover:text-text-primary transition-colors" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-text-primary absolute -bottom-4">Saved</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    surpriseMe();
                                }}
                                className="group flex flex-col items-center gap-1 cursor-pointer"
                            >
                                <div className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors">
                                    <Sparkles className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-text-primary absolute -bottom-4">Random</span>
                            </button>
                        </div>
                    </div>

                    <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-3 py-4 border border-text-primary text-sm font-medium uppercase tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all"
                    >
                        Accedi al Profilo
                    </Link>
                </div>
            </div>
        </>
    );
}
