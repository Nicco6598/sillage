
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { signout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function UserMenu() {
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState<string>("");
    const supabase = createClient();
    const pathname = usePathname();

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
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, pathname]);

    if (!user) {
        return (
            <Link
                href="/login"
                className="ml-4 px-5 py-2 text-xs uppercase tracking-widest border border-text-primary text-text-primary hover:bg-text-primary hover:text-text-inverted transition-colors"
            >
                Accedi
            </Link>
        );
    }

    return (
        <div className="relative ml-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-transparent hover:bg-bg-tertiary transition-colors rounded-md"
            >
                <div className="w-8 h-8 rounded-full bg-copper/10 flex items-center justify-center text-copper border border-copper/20">
                    <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium hidden md:block">{username}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-bg-primary border border-border-primary shadow-xl z-50 rounded-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-border-primary bg-bg-secondary/30">
                            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Account</p>
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg-tertiary transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard className="h-4 w-4 text-text-secondary" />
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

export function MobileUserMenu({ onClose }: { onClose: () => void }) {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState<string>("");
    const supabase = createClient();
    const pathname = usePathname();

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
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, pathname]);

    if (!user) {
        return (
            <Link
                href="/login"
                onClick={onClose}
                className="flex w-full items-center justify-center py-4 bg-text-primary text-text-inverted text-sm uppercase tracking-widest hover:bg-copper transition-colors"
            >
                Accedi
            </Link>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 p-4 bg-bg-tertiary/50 border border-border-primary rounded-lg mb-2">
                <div className="w-10 h-10 rounded-full bg-copper/10 flex items-center justify-center text-copper border border-copper/20 shrink-0">
                    <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{username}</span>
                    <span className="text-xs text-text-muted truncate">{user.email}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-3 border border-border-primary bg-bg-primary text-sm hover:border-copper hover:text-copper transition-colors"
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Profilo</span>
                </Link>
                <Link
                    href="/settings"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-3 border border-border-primary bg-bg-primary text-sm hover:border-copper hover:text-copper transition-colors"
                >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </Link>
            </div>

            <form action={signout}>
                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 py-3 border border-red-500/30 text-red-500 text-sm hover:bg-red-500/5 transition-colors mt-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Esci</span>
                </button>
            </form>
        </div>
    );
}
