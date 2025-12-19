"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12">
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/" className="inline-block mb-10">
                            <Logo size="lg" />
                        </Link>
                        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">
                            Bentornato<span className="text-copper">.</span>
                        </h1>
                        <p className="text-text-secondary">
                            Accedi al tuo account Sillage.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                        placeholder="tu@esempio.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 pr-12 outline-none focus:border-copper transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-xs text-text-muted hover:text-copper transition-colors"
                            >
                                Password dimenticata?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-text-primary text-text-inverted py-4 text-sm uppercase tracking-widest font-medium hover:bg-copper disabled:opacity-50 transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <span>Caricamento...</span>
                            ) : (
                                <>
                                    Accedi
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-px bg-border-primary" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-bg-primary px-4 text-xs text-text-muted uppercase tracking-widest">
                                Oppure
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-3">Non hai un account?</p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-text-primary hover:text-copper transition-colors group"
                        >
                            <span className="border-b border-current pb-0.5">Registrati Ora</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Decorative (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 bg-bg-secondary border-l border-border-primary items-center justify-center">
                <div className="text-center px-12">
                    <p className="font-serif text-3xl xl:text-4xl leading-relaxed text-text-secondary max-w-md">
                        "Il profumo è la forma più <br />
                        <span className="text-copper italic">intensa</span> della memoria."
                    </p>
                    <p className="mt-6 text-xs font-mono uppercase tracking-widest text-text-muted">
                        — Jean-Paul Guerlain
                    </p>
                </div>
            </div>
        </div>
    );
}
