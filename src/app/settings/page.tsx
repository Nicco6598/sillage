"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Trash2, Loader2, Check, AlertTriangle, Eye, EyeOff, AtSign } from "lucide-react";
import { updateProfile, updatePassword, deleteAccount } from "@/app/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { InlineLoader } from "@/components/ui/perfume-loader";
import { cn } from "@/lib/utils";

type UserData = {
    id: string;
    email: string;
    username: string;
};

const initialState = {
    message: "",
    error: "",
    success: false,
    requiresLogout: false
};

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">("profile");
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Form states
    const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, initialState);
    const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, initialState);

    // Password form state for live validation
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Delete account
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    // Password requirements (same as register)
    const passwordRequirements = [
        { label: "8+ caratteri", met: newPassword.length >= 8 },
        { label: "Maiuscola", met: /[A-Z]/.test(newPassword) },
        { label: "Numero", met: /\d/.test(newPassword) },
    ];
    const allRequirementsMet = passwordRequirements.every(r => r.met);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                router.replace('/login');
                return;
            }

            setUser({
                id: authUser.id,
                email: authUser.email || '',
                username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
            });
            setIsLoading(false);
        };

        fetchUser();
    }, [router, supabase]);

    // Handle logout redirect after successful update
    useEffect(() => {
        if (profileState?.requiresLogout || passwordState?.requiresLogout) {
            setIsLoggingOut(true);
            // Wait a bit then redirect to login
            const timer = setTimeout(() => {
                router.replace('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [profileState?.requiresLogout, passwordState?.requiresLogout, router]);

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "ELIMINA") return;

        setIsDeleting(true);
        const result = await deleteAccount();

        if (result.success) {
            router.replace('/');
        } else {
            setIsDeleting(false);
            alert(result.error);
        }
    };

    // Logging out screen
    if (isLoggingOut) {
        return <InlineLoader message="Logout in corso..." />;
    }

    if (isLoading) {
        return <InlineLoader message="Caricamento..." />;
    }

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            <div className="container-page max-w-2xl">
                {/* Back Button */}
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-copper transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Torna al profilo
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-3">
                        Impostazioni<span className="text-copper">.</span>
                    </h1>
                    <p className="text-text-secondary">
                        Gestisci il tuo account e le preferenze.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 mb-8 border-b border-border-primary overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "profile"
                            ? "border-copper text-copper"
                            : "border-transparent text-text-muted hover:text-text-primary"
                            }`}
                    >
                        <User className="h-4 w-4" />
                        <span>Profilo</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "password"
                            ? "border-copper text-copper"
                            : "border-transparent text-text-muted hover:text-text-primary"
                            }`}
                    >
                        <Lock className="h-4 w-4" />
                        <span>Password</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("danger")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "danger"
                            ? "border-red-500 text-red-500"
                            : "border-transparent text-text-muted hover:text-red-500"
                            }`}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Elimina</span>
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="p-6 bg-bg-secondary/50 border border-border-primary">
                            <h2 className="font-serif text-xl mb-1">Informazioni Account</h2>
                            <p className="text-sm text-text-muted">
                                Il tuo username è visibile pubblicamente nelle recensioni.
                            </p>
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Cambiando username verrai disconnesso.
                            </p>
                        </div>

                        {profileState?.success && !profileState.requiresLogout && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                {profileState.message}
                            </div>
                        )}

                        {profileState?.error && !profileState.success && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500">
                                {profileState.error}
                            </div>
                        )}

                        <form action={profileAction} className="space-y-6">
                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-bg-tertiary border border-border-primary px-4 py-3 text-text-muted cursor-not-allowed"
                                />
                                <p className="text-xs text-text-muted mt-2">L&apos;email non può essere modificata.</p>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Username
                                </label>
                                <div className="relative">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                    <input
                                        name="username"
                                        type="text"
                                        defaultValue={user?.username || ''}
                                        className="w-full bg-bg-tertiary/50 border border-border-primary pl-11 pr-4 py-3 outline-none focus:border-copper transition-colors"
                                        placeholder="iltuousername"
                                    />
                                </div>
                                <p className="text-xs text-text-muted mt-2">
                                    Solo lettere, numeri e underscore. Minimo 3 caratteri.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isProfilePending}
                                className="w-full py-3 bg-copper text-white text-sm uppercase tracking-widest font-medium hover:bg-copper/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isProfilePending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Salvataggio...
                                    </>
                                ) : (
                                    "Salva Modifiche"
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <div className="space-y-6">
                        {/* Info Card */}
                        <div className="p-6 bg-bg-secondary/50 border border-border-primary">
                            <h2 className="font-serif text-xl mb-1">Cambia Password</h2>
                            <p className="text-sm text-text-muted">
                                La nuova password deve rispettare i requisiti di sicurezza.
                            </p>
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Cambiando password verrai disconnesso da tutte le sessioni.
                            </p>
                        </div>

                        {passwordState?.success && !passwordState.requiresLogout && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                {passwordState.message}
                            </div>
                        )}

                        {passwordState?.error && !passwordState.success && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500">
                                {passwordState.error}
                            </div>
                        )}

                        <form action={passwordAction} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Password Attuale
                                </label>
                                <div className="relative">
                                    <input
                                        name="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 pr-12 outline-none focus:border-copper transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Nuova Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 pr-12 outline-none focus:border-copper transition-colors"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                <div className="mt-4 flex gap-4 flex-wrap">
                                    {passwordRequirements.map(req => (
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
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Conferma Nuova Password
                                </label>
                                <div className="relative">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={cn(
                                            "w-full bg-bg-tertiary/50 border px-4 py-3 pr-12 outline-none transition-colors",
                                            confirmPassword.length > 0 && !passwordsMatch
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
                                {confirmPassword.length > 0 && !passwordsMatch && (
                                    <p className="text-xs text-red-500 mt-2">Le password non corrispondono</p>
                                )}
                                {passwordsMatch && (
                                    <p className="text-xs text-copper mt-2 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Le password corrispondono
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isPasswordPending || !allRequirementsMet || !passwordsMatch}
                                className="w-full py-3 bg-copper text-white text-sm uppercase tracking-widest font-medium hover:bg-copper/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isPasswordPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Aggiornamento...
                                    </>
                                ) : (
                                    "Cambia Password"
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Delete Account Tab */}
                {activeTab === "danger" && (
                    <div className="space-y-6">
                        <div className="p-6 bg-red-500/5 border border-red-500/20">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-500/10 text-red-500 shrink-0">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-xl mb-2 text-red-500">Elimina Account</h2>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Questa azione è <strong>permanente e irreversibile</strong>.
                                    </p>
                                    <p className="text-sm text-text-muted mb-4">
                                        Verranno eliminati:
                                    </p>
                                    <ul className="text-sm text-text-secondary space-y-1 mb-6">
                                        <li className="flex items-center gap-2">
                                            <span className="text-red-500">•</span>
                                            Tutte le tue recensioni
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-red-500">•</span>
                                            La tua collezione (armadio)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-red-500">•</span>
                                            I tuoi preferiti
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-red-500">•</span>
                                            I tuoi dati personali
                                        </li>
                                    </ul>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="px-6 py-3 border border-red-500 text-red-500 text-sm uppercase tracking-widest font-medium hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        Elimina il mio account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-bg-primary border border-border-primary p-6 md:p-8 max-w-md w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-500/10 text-red-500">
                                    <AlertTriangle className="h-6 w-6" />
                                </div>
                                <h3 className="font-serif text-2xl">Sei sicuro?</h3>
                            </div>

                            <p className="text-text-secondary mb-6">
                                Questa azione è <strong>irreversibile</strong>. Tutti i tuoi dati verranno eliminati permanentemente.
                            </p>

                            <div className="mb-6">
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Scrivi &quot;ELIMINA&quot; per confermare
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-red-500 transition-colors"
                                    placeholder="ELIMINA"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText("");
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 border border-border-primary hover:border-text-primary transition-colors text-sm"
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting || deleteConfirmText !== "ELIMINA"}
                                    className="flex-1 py-3 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Eliminazione...
                                        </>
                                    ) : (
                                        "Elimina Account"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
