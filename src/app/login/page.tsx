"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-24 px-4">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-block mb-8"><Logo size="lg" /></Link>
                    <h1 className="font-serif text-4xl mb-2">Bentornato.</h1>
                    <p className="text-text-secondary">Accedi al tuo account Sillage.</p>
                </div>

                <form className="space-y-8">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-text-primary transition-colors">Email</label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-border-primary py-2 outline-none focus:border-text-primary transition-colors text-lg"
                                placeholder="tu@esempio.com"
                            />
                        </div>

                        <div className="group relative">
                            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-text-primary transition-colors">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-transparent border-b border-border-primary py-2 outline-none focus:border-text-primary transition-colors text-lg pr-8"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-text-muted hover:text-text-primary">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <Link href="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">Password dimenticata?</Link>
                    </div>

                    <button className="w-full bg-text-primary text-bg-primary py-4 text-sm uppercase tracking-widest font-medium hover:bg-text-secondary transition-colors flex items-center justify-center gap-2 group">
                        Accedi <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="mt-12 text-center border-t border-border-primary pt-8">
                    <p className="text-sm text-text-secondary mb-4">Non hai un account?</p>
                    <Link href="/register" className="text-sm uppercase tracking-widest font-medium border-b border-text-primary pb-1 hover:text-text-secondary hover:border-text-secondary transition-colors">
                        Registrati Qui
                    </Link>
                </div>
            </div>
        </div>
    );
}
