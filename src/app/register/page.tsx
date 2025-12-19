"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const requirements = [
        { label: "8+ caratteri", met: formData.password.length >= 8 },
        { label: "Maiuscola", met: /[A-Z]/.test(formData.password) },
        { label: "Numero", met: /\d/.test(formData.password) },
    ];

    const allRequirementsMet = requirements.every(r => r.met);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!allRequirementsMet) return;
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 bg-bg-secondary border-r border-border-primary items-center justify-center">
                <div className="text-center px-12">
                    <p className="font-serif text-3xl xl:text-4xl leading-relaxed text-text-secondary max-w-md">
                        "Un profumo è come un <br />
                        <span className="text-gold italic">vestito invisibile</span>."
                    </p>
                    <p className="mt-6 text-xs font-mono uppercase tracking-widest text-text-muted">
                        — Coco Chanel
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12">
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/" className="inline-block mb-10">
                            <Logo size="lg" />
                        </Link>
                        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">
                            Crea Account<span className="text-copper">.</span>
                        </h1>
                        <p className="text-text-secondary">
                            Entra nel mondo Sillage.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                    placeholder="Il tuo nome"
                                />
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                    placeholder="tu@esempio.com"
                                />
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
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                                {/* Password Requirements */}
                                <div className="mt-4 flex gap-4 flex-wrap">
                                    {requirements.map(req => (
                                        <span
                                            key={req.label}
                                            className={cn(
                                                "text-xs flex items-center gap-1.5 transition-colors",
                                                req.met ? "text-copper" : "text-text-muted"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-4 h-4 flex items-center justify-center border transition-colors",
                                                req.met ? "border-copper bg-copper/10" : "border-border-primary"
                                            )}>
                                                {req.met && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                            {req.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !allRequirementsMet}
                            className="w-full bg-text-primary text-text-inverted py-4 text-sm uppercase tracking-widest font-medium hover:bg-copper disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <span>Creazione account...</span>
                            ) : (
                                <>
                                    Crea Account
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-center text-xs text-text-muted">
                            Registrandoti accetti i{" "}
                            <Link href="/terms" className="text-text-secondary hover:text-copper transition-colors">
                                Termini
                            </Link>{" "}
                            e la{" "}
                            <Link href="/privacy" className="text-text-secondary hover:text-copper transition-colors">
                                Privacy Policy
                            </Link>
                            .
                        </p>
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

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-text-secondary mb-3">Hai già un account?</p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-text-primary hover:text-copper transition-colors group"
                        >
                            <span className="border-b border-current pb-0.5">Accedi</span>
                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
