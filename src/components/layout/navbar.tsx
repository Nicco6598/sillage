"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { surpriseMe } from "@/app/actions/discovery";
import { Search, Heart, Menu, X, Sparkles, ArrowRight, User as UserIcon, LogOut, Settings, Home, Compass, Building2, Users } from "lucide-react";

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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signout } from "@/app/actions/auth";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Esplora", href: "/explore" },
    { label: "Brand", href: "/brands" },
    { label: "Community", href: "/community" },
];

/**
 * Navbar - Stone & Silk Design System
 */
export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileMenuKey, setMobileMenuKey] = useState<string | null>(null);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");

    // Auth state
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("");
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const isMenuVisible = isMobileMenuOpen && mobileMenuKey === `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
        if (isMenuVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen, mobileMenuKey, pathname, searchParams]);

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

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen(false);
                setMobileMenuKey(null);
                setMobileSearchQuery("");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileMenuOpen]);

    const handleMobileSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobileSearchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setMobileMenuKey(null);
            setMobileSearchQuery("");
        }
    };

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileMenuKey(null);
        setMobileSearchQuery("");
    };
    const menuKey = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const isMobileMenuVisible = isMobileMenuOpen && mobileMenuKey === menuKey;

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
                            onClick={() => {
                                setMobileMenuKey(menuKey);
                                setIsMobileMenuOpen(true);
                            }}
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
                    isMobileMenuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-sm" onClick={closeMenu} />

                <div
                    className={cn(
                        "absolute inset-0 bg-bg-primary transition-transform duration-500",
                        isMobileMenuVisible ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between px-6 h-14 border-b border-border-primary">
                        <Logo size="md" className="text-text-primary" />
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button
                                onClick={closeMenu}
                                className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                aria-label="Chiudi"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="h-[calc(100vh-56px)] overflow-y-auto">
                        <div className="px-6 pt-6 pb-4 border-b border-border-primary">
                            <form onSubmit={handleMobileSearch} className="relative border border-border-secondary/50 focus-within:border-copper transition-colors">
                                <input
                                    type="text"
                                    value={mobileSearchQuery}
                                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                                    placeholder="Cerca fragranze, brand, note…"
                                    className="w-full bg-transparent px-4 py-3 pr-12 text-sm placeholder:text-text-muted outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-text-muted hover:text-copper transition-colors"
                                    aria-label="Cerca"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                        <nav className="px-6 py-6 border-b border-border-primary">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">Navigazione</p>
                            <div className="space-y-2">
                                {[
                                    { label: "Home", href: "/", icon: Home },
                                    { label: "Esplora", href: "/explore", icon: Compass },
                                    { label: "Brand", href: "/brands", icon: Building2 },
                                    { label: "Community", href: "/community", icon: Users },
                                ].map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={cn(
                                                "flex items-center justify-between border border-border-secondary/40 px-4 py-4 transition-colors",
                                                isActive
                                                    ? "border-copper bg-copper/5"
                                                    : "hover:border-copper"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-copper" : "text-text-muted")} />
                                                <span className={cn("font-serif text-2xl truncate", isActive ? "text-copper" : "text-text-primary")}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ArrowRight className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-copper" : "text-text-muted")} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        <div className="px-6 py-6 border-b border-border-primary">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">Azioni</p>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/favorites"
                                    onClick={closeMenu}
                                    className="border border-border-secondary/40 px-4 py-4 hover:border-copper transition-colors"
                                >
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Heart className="h-4 w-4" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest">Preferiti</span>
                                    </div>
                                    <p className="mt-3 font-serif text-xl">Salvati</p>
                                </Link>

                                <button
                                    onClick={() => {
                                        closeMenu();
                                        surpriseMe();
                                    }}
                                    className="border border-border-secondary/40 px-4 py-4 hover:border-gold transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2 text-text-muted">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest">Sorprendimi</span>
                                    </div>
                                    <p className="mt-3 font-serif text-xl">Random</p>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-4">Account</p>
                            {user ? (
                                <div className="space-y-3">
                                    <Link
                                        href="/profile"
                                        onClick={closeMenu}
                                        className="border border-border-secondary/40 px-4 py-4 hover:border-copper transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-serif text-2xl truncate">{username}</p>
                                                <p className="mt-1 text-sm text-text-muted truncate">{user.email}</p>
                                            </div>
                                            <UserIcon className="h-4 w-4 text-text-muted shrink-0 mt-1" />
                                        </div>
                                    </Link>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/settings"
                                            onClick={closeMenu}
                                            className="border border-border-secondary/40 px-4 py-4 hover:border-copper transition-colors"
                                        >
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <Settings className="h-4 w-4" />
                                                <span className="text-[10px] font-mono uppercase tracking-widest">Impostazioni</span>
                                            </div>
                                        </Link>
                                        <form action={signout}>
                                            <button
                                                type="submit"
                                                className="w-full border border-red-500/20 px-4 py-4 hover:border-red-500/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-2 text-red-500/80">
                                                    <LogOut className="h-4 w-4" />
                                                    <span className="text-[10px] font-mono uppercase tracking-widest">Esci</span>
                                                </div>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="border border-border-secondary/40 px-4 py-4 bg-bg-secondary/20">
                                        <p className="font-serif text-2xl">Benvenuto<span className="text-copper">.</span></p>
                                        <p className="mt-1 text-sm text-text-secondary">Accedi per salvare e recensire.</p>
                                    </div>
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="w-full inline-flex items-center justify-between px-5 py-4 bg-text-primary text-text-inverted hover:bg-copper transition-colors"
                                    >
                                        <span className="text-xs font-medium uppercase tracking-widest">Accedi</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
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
