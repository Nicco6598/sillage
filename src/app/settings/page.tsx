"use client";

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Trash2, Loader2, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { updateProfile, updatePassword, deleteAccount } from "@/app/actions/settings";
import { createClient } from "@/lib/supabase/client";

type UserData = {
    id: string;
    email: string;
    username: string;
    fullName: string;
};

const initialState = {
    message: "",
    error: "",
    success: false
};

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">("profile");

    // Form states
    const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, initialState);
    const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, initialState);

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Delete account
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

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
                username: authUser.user_metadata?.username || '',
                fullName: authUser.user_metadata?.full_name || '',
            });
            setIsLoading(false);
        };

        fetchUser();
    }, [router, supabase]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-copper" />
            </div>
        );
    }

    return (
        <div className="w-full pt-32 md:pt-40 pb-24">
            <div className="container-page max-w-4xl">
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

                {/* Tabs - Scrollable on mobile */}
                <div className="flex gap-0 mb-6 md:mb-10 border-b border-border-primary overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "profile"
                            ? "border-copper text-copper"
                            : "border-transparent text-text-muted hover:text-text-primary"
                            }`}
                    >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Profilo</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "password"
                            ? "border-copper text-copper"
                            : "border-transparent text-text-muted hover:text-text-primary"
                            }`}
                    >
                        <Lock className="h-4 w-4" />
                        <span className="hidden sm:inline">Password</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("danger")}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === "danger"
                            ? "border-red-500 text-red-500"
                            : "border-transparent text-text-muted hover:text-red-500"
                            }`}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Elimina Account</span>
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-bg-secondary border border-border-primary p-4 md:p-8">
                        <h2 className="font-serif text-2xl mb-6">Informazioni Profilo</h2>

                        {profileState?.success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                {profileState.message}
                            </div>
                        )}

                        {profileState?.error && !profileState.success && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500">
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
                                <p className="text-xs text-text-muted mt-2">L'email non può essere modificata.</p>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Username
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    defaultValue={user?.username || ''}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                    placeholder="Il tuo username"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-3">
                                    Nome Completo
                                </label>
                                <input
                                    name="fullName"
                                    type="text"
                                    defaultValue={user?.fullName || ''}
                                    className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 outline-none focus:border-copper transition-colors"
                                    placeholder="Il tuo nome"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isProfilePending}
                                className="w-full md:w-auto px-8 py-3 bg-text-primary text-text-inverted text-sm uppercase tracking-widest font-medium hover:bg-copper disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
                    <div className="bg-bg-secondary border border-border-primary p-4 md:p-8">
                        <h2 className="font-serif text-2xl mb-6">Cambia Password</h2>

                        {passwordState?.success && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                {passwordState.message}
                            </div>
                        )}

                        {passwordState?.error && !passwordState.success && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500">
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
                                <p className="text-xs text-text-muted mt-2">Minimo 6 caratteri.</p>
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
                                        className="w-full bg-bg-tertiary/50 border border-border-primary px-4 py-3 pr-12 outline-none focus:border-copper transition-colors"
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
                            </div>

                            <button
                                type="submit"
                                disabled={isPasswordPending}
                                className="w-full md:w-auto px-8 py-3 bg-text-primary text-text-inverted text-sm uppercase tracking-widest font-medium hover:bg-copper disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
                    <div className="bg-red-500/5 border border-red-500/20 p-4 md:p-8">
                        <h2 className="font-serif text-xl md:text-2xl mb-2 text-red-500">Elimina Account</h2>
                        <p className="text-text-secondary text-sm md:text-base mb-6 md:mb-8">
                            Attenzione: questa azione è permanente e irreversibile.
                        </p>

                        <div className="border border-red-500/30 p-4 md:p-6 bg-bg-primary">
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="p-3 bg-red-500/10 text-red-500 shrink-0">
                                    <Trash2 className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary font-medium mb-3">
                                        Eliminando il tuo account verranno cancellati definitivamente:
                                    </p>
                                    <ul className="text-text-secondary text-sm space-y-2 mb-6">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            Tutte le tue <strong>recensioni</strong> e valutazioni
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            La tua <strong>collezione</strong> (armadio profumi)
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            I tuoi <strong>preferiti</strong> (wishlist)
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            I tuoi <strong>dati personali</strong> (email, username, foto profilo)
                                        </li>
                                    </ul>
                                    <p className="text-text-muted text-xs mb-6">
                                        Non sarà possibile recuperare nessuno di questi dati dopo l'eliminazione.
                                    </p>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full sm:w-auto px-6 py-3 border border-red-500 text-red-500 text-sm uppercase tracking-widest font-medium hover:bg-red-500 hover:text-white transition-colors"
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
                        <div className="bg-bg-primary border border-border-primary p-6 md:p-8 max-w-md w-full mx-4">
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
                                    Scrivi "ELIMINA" per confermare
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
