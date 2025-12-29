"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { surpriseMe } from "@/app/actions/discovery";
import { Search, Heart, Menu, X, Sparkles, ArrowUpRight, ArrowRight, User as UserIcon, LogOut, Settings } from "lucide-react";

interface User {
    id: string;
    email?: string;
    user_metadata: {
        username?: string;
        full_name?: string;
    };
}
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/actions/auth";

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
 * Navbar - Stone & Silk Design System
 */
export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");

    // Auth state
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("");
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.user_metadata?.username) {
                setUsername(user.user_metadata.username);
            } else if (user?.email) {
                setUsername(user.email.split('@')[0]);
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user?.user_metadata?.username) {
                setUsername(session.user.user_metadata.username);
            } else if (session?.user?.email) {
                setUsername(session.user.email.split('@')[0]);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, pathname]);

    const handleMobileSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileSearchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setMobileSearchQuery("");
        }
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

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
                        <Link href="/" className="relative z-50">
                            <Logo size="md" className="text-text-primary" />
                        </Link>

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

                            {user ? (
                                <DesktopUserDropdown user={user} username={username} />
                            ) : (
                                <Link
                                    href="/login"
                                    className="ml-4 px-5 py-2 text-xs uppercase tracking-widest border border-text-primary text-text-primary hover:bg-text-primary hover:text-text-inverted transition-colors"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>

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

            {/* Mobile Menu - Stone & Silk Style */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <div
                    className="absolute inset-0 bg-bg-primary"
                    onClick={closeMenu}
                />

                <div className={cn(
                    "relative h-full flex flex-col bg-bg-primary transition-transform duration-500",
                    isMobileMenuOpen ? "translate-y-0" : "-translate-y-8"
                )}>
                    {/* Header - Compact */}
                    <div className="flex items-center justify-between px-6 h-14 border-b border-border-primary">
                        <Logo size="md" className="text-text-primary" />
                        <button
                            onClick={closeMenu}
                            className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                            aria-label="Chiudi"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Main Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {/* HERO: User Section - PROMINENT */}
                        {user ? (
                            <div className="px-6 py-8 border-b border-border-primary">
                                <Link
                                    href="/profile"
                                    onClick={closeMenu}
                                    className="group flex items-center gap-5 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-16 h-16 border border-copper bg-copper/10 flex items-center justify-center text-copper">
                                        <UserIcon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-serif text-3xl group-hover:text-copper transition-colors">{username}</p>
                                        <p className="text-sm text-text-muted mt-1">Vai al tuo profilo →</p>
                                    </div>
                                </Link>
                                {/* User Quick Actions */}
                                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border-secondary/30">
                                    <Link
                                        href="/settings"
                                        onClick={closeMenu}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest text-text-muted hover:text-copper border border-border-secondary/50 hover:border-copper transition-colors"
                                    >
                                        <Settings className="h-3.5 w-3.5" />
                                        Impostazioni
                                    </Link>
                                    <form action={signout} className="flex-1">
                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase tracking-widest text-red-500/70 hover:text-red-500 border border-red-500/20 hover:border-red-500/50 transition-colors"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Esci
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 py-8 border-b border-border-primary">
                                <h2 className="font-serif text-3xl mb-3">
                                    Benvenuto<span className="text-copper">.</span>
                                </h2>
                                <p className="text-text-secondary mb-6">Accedi per esplorare la tua collezione.</p>
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="group inline-flex items-center gap-3 px-6 py-4 bg-text-primary text-text-inverted hover:bg-copper transition-colors"
                                >
                                    <span className="text-xs font-medium uppercase tracking-widest">Accedi</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        )}

                        {/* NAVIGATION - PROMINENT */}
                        <nav className="px-6 py-6">
                            <div className="space-y-0">
                                {[{ label: "Home", href: "/" }, ...navItems].map((item, index) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={cn(
                                                "group flex items-center justify-between py-5 border-b border-border-secondary/30 transition-colors",
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
                                                    "font-serif text-3xl transition-colors",
                                                    isActive ? "text-copper" : "text-text-primary group-hover:text-copper"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ArrowUpRight className={cn(
                                                "h-5 w-5 transition-all",
                                                isActive
                                                    ? "text-copper opacity-100"
                                                    : "text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-copper"
                                            )} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>

                    {/* Footer - MINIMAL */}
                    <div className="border-t border-border-primary bg-bg-secondary/20">
                        {/* Search - Compact */}
                        <div className="px-6 py-3 border-b border-border-secondary/30">
                            <form onSubmit={handleMobileSearch} className="relative">
                                <input
                                    type="text"
                                    value={mobileSearchQuery}
                                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                                    placeholder="Cerca..."
                                    className="w-full bg-transparent border-none px-0 py-2 text-sm placeholder:text-text-muted outline-none"
                                />
                                <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                            </form>
                        </div>

                        {/* Quick Actions - Very Small */}
                        <div className="px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/favorites"
                                    onClick={closeMenu}
                                    className="text-text-muted hover:text-copper transition-colors"
                                    aria-label="Preferiti"
                                >
                                    <Heart className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => { closeMenu(); surpriseMe(); }}
                                    className="text-text-muted hover:text-gold transition-colors"
                                    aria-label="Random"
                                >
                                    <Sparkles className="h-4 w-4" />
                                </button>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function DesktopUserDropdown({ user, username }: { user: User; username: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative ml-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-transparent hover:bg-bg-tertiary transition-colors"
            >
                <div className="w-8 h-8 border border-copper/30 bg-copper/5 flex items-center justify-center text-copper">
                    <UserIcon className="h-4 w-4" />
                </div>
                <span className="text-sm hidden md:block">{username}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-bg-primary border border-border-primary surface-elevated z-50 overflow-hidden">
                        <div className="p-3 border-b border-border-primary bg-bg-secondary/30">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">Account</p>
                            <p className="text-sm truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg-tertiary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <UserIcon className="h-4 w-4 text-text-secondary" />
                                Profilo
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg-tertiary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="h-4 w-4 text-text-secondary" />
                                Impostazioni
                            </Link>
                        </div>

                        <div className="border-t border-border-primary py-1">
                            <form action={signout}>
                                <button
                                    type="submit"
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Esci
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
