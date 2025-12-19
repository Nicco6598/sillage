"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const requirements = [
        { label: "8+ caratteri", met: formData.password.length >= 8 },
        { label: "Maiuscola", met: /[A-Z]/.test(formData.password) },
        { label: "Numero", met: /\d/.test(formData.password) },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-24 px-4">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-block mb-8"><Logo size="lg" /></Link>
                    <h1 className="font-serif text-4xl mb-2">Nuovo Account.</h1>
                    <p className="text-text-secondary">Entra nel mondo Sillage.</p>
                </div>

                <form className="space-y-8">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-text-primary transition-colors">Nome</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border-b border-border-primary py-2 outline-none focus:border-text-primary transition-colors text-lg"
                                placeholder="Il tuo nome"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-text-primary transition-colors">Email</label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-border-primary py-2 outline-none focus:border-text-primary transition-colors text-lg"
                                placeholder="tu@esempio.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="group relative">
                            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-text-primary transition-colors">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-transparent border-b border-border-primary py-2 outline-none focus:border-text-primary transition-colors text-lg pr-8"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-text-muted hover:text-text-primary">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>

                            {/* Password Requirements */}
                            <div className="mt-4 flex gap-4 flex-wrap">
                                {requirements.map(req => (
                                    <span key={req.label} className={`text-xs flex items-center gap-1 transition-colors ${req.met ? "text-text-primary" : "text-text-muted"}`}>
                                        <div className={`h-1.5 w-1.5 rounded-full transition-colors ${req.met ? "bg-text-primary" : "bg-border-primary"}`} />
                                        {req.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-text-primary text-bg-primary py-4 text-sm uppercase tracking-widest font-medium hover:bg-text-secondary transition-colors flex items-center justify-center gap-2 group">
                        Crea Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="mt-12 text-center border-t border-border-primary pt-8">
                    <p className="text-sm text-text-secondary mb-4">Hai già un account?</p>
                    <Link href="/login" className="text-sm uppercase tracking-widest font-medium border-b border-text-primary pb-1 hover:text-text-secondary hover:border-text-secondary transition-colors">
                        Accedi Qui
                    </Link>
                </div>

                <p className="mt-8 text-center text-xs text-text-muted">
                    Registrandoti accetti i <Link href="#" className="underline underline-offset-2 hover:text-text-primary transition-colors">Termini</Link> e la <Link href="#" className="underline underline-offset-2 hover:text-text-primary transition-colors">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}
