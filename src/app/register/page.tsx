"use client";

import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, Check, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { signup } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [state, action, isPending] = useActionState(signup, undefined);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.replace('/');
            }
        };
        checkSession();
    }, [router, supabase]);

    const requirements = [
        { label: "8+ caratteri", met: formData.password.length >= 8 },
        { label: "Maiuscola", met: /[A-Z]/.test(formData.password) },
        { label: "Numero", met: /\d/.test(formData.password) },
    ];

    const allRequirementsMet = requirements.every(r => r.met);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 bg-bg-secondary border-r border-border-primary items-center justify-center">
                <div className="text-center px-12">
                    <p className="font-serif text-3xl xl:text-4xl leading-relaxed text-text-secondary max-w-md">
                        &quot;Un profumo è come un <br />
                        <span className="text-gold italic">vestito invisibile</span>.&quot;
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
                    <form action={action} className="space-y-8">
                        <div className="space-y-6">
                            {/* Username */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Username
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                    placeholder="Il tuo username"
                                />
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Email
                                </label>
                                <input
                                    name="email"
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
                                        name="password"
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

                            {/* Confirm Password */}
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3 group-focus-within:text-copper transition-colors">
                                    Conferma Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={cn(
                                            "w-full bg-bg-tertiary/50 border px-4 py-3 pr-12 outline-none transition-colors",
                                            formData.confirmPassword.length > 0 && !passwordsMatch
                                                ? "border-red-500/50"
                                                : passwordsMatch
                                                    ? "border-copper"
                                                    : "border-border-primary focus:border-copper"
                                        )}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {formData.confirmPassword.length > 0 && !passwordsMatch && (
                                    <p className="text-xs text-red-500 mt-2">Le password non corrispondono</p>
                                )}
                                {passwordsMatch && (
                                    <p className="text-xs text-copper mt-2 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Le password corrispondono
                                    </p>
                                )}
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm">
                                {state.error}
                            </div>
                        )}
                        {state?.message && (
                            <div className="text-green-500 text-sm">
                                {state.message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending || !allRequirementsMet || !passwordsMatch}
                            className="w-full bg-text-primary text-text-inverted py-4 text-sm uppercase tracking-widest font-medium hover:bg-copper disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group"
                        >
                            {isPending ? (
                                <>
                                    <span>Creazione account...</span>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </>
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

