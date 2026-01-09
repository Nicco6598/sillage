
"use client";

import { useActionState, useState, useEffect } from "react";
import { submitReview, updateReview, type ReviewState } from "@/app/actions/submit-review";
import { Star, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { SpringIcon, SummerIcon, AutumnIcon, WinterIcon } from "@/components/icons/season-icons";

interface EditingReview {
    id: string;
    rating: string | null;
    comment: string | null;
    sillage: string | null;
    longevity: string | null;
    genderVote: string | null;
    seasonVote: string | null;
    batchCode: string | null;
    productionDate: string | null;
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
    editingReview?: EditingReview | null;
}

const initialState: ReviewState = {
    message: "",
    errors: {},
    success: false
};

export function ReviewModal({ isOpen, onClose, fragranceId, fragranceSlug, fragranceName, editingReview }: ReviewModalProps) {
    const isEditing = !!editingReview;
    // @ts-expect-error - useActionState type inference issue with optional fields
    const [stateRaw, formAction, isPending] = useActionState(
        isEditing ? updateReview : submitReview,
        initialState
    );
    const state = stateRaw as ReviewState;

    const [rating, setRating] = useState([0]);
    const [manualInput, setManualInput] = useState("");
    const [valSillage, setValSillage] = useState([3.0]);
    const [valLongevity, setValLongevity] = useState([3.0]);
    const [comment, setComment] = useState("");
    const [genderVote, setGenderVote] = useState<string>("");
    const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
    const [batchCode, setBatchCode] = useState("");
    const [productionDate, setProductionDate] = useState("");

    // Pre-fill form when editing an existing review
    useEffect(() => {
        if (isOpen && editingReview) {
            const ratingVal = Number(editingReview.rating) || 0;
            setRating([ratingVal]);
            setManualInput(ratingVal > 0 ? ratingVal.toFixed(2) : "");
            setValSillage([Number(editingReview.sillage) || 3.0]);
            setValLongevity([Number(editingReview.longevity) || 3.0]);
            setComment(editingReview.comment || "");
            setGenderVote(editingReview.genderVote || "");
            setSelectedSeasons(editingReview.seasonVote ? editingReview.seasonVote.split(",") : []);
            setBatchCode(editingReview.batchCode || "");
            setProductionDate(editingReview.productionDate || "");
        } else if (!isOpen) {
            setRating([0]);
            setManualInput("");
            setValSillage([3.0]);
            setValLongevity([3.0]);
            setComment("");
            setGenderVote("");
            setSelectedSeasons([]);
            setBatchCode("");
            setProductionDate("");
        }
    }, [isOpen, editingReview]);
    useEffect(() => {
        if (state.success) {
            const t = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [state.success, onClose]);

    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    useEffect(() => {
        if (state.resetTimestamp && !state.success) {
            const updateCountdown = () => {
                const now = Date.now();
                const diff = state.resetTimestamp! - now;

                if (diff <= 0) {
                    setTimeRemaining(null);
                    return;
                }

                const totalSeconds = Math.floor(diff / 1000);
                const totalMinutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                let formatted = "";
                if (hours > 0) {
                    formatted = `${hours} or${hours === 1 ? "a" : "e"}`;
                    if (minutes > 0) formatted += ` e ${minutes} minut${minutes === 1 ? "o" : "i"}`;
                } else if (minutes > 0) {
                    formatted = `${minutes} minut${minutes === 1 ? "o" : "i"}`;
                    if (seconds > 0 && minutes < 5) formatted += ` e ${seconds} second${seconds === 1 ? "o" : "i"}`;
                } else {
                    formatted = `${seconds} second${seconds === 1 ? "o" : "i"}`;
                }

                setTimeRemaining(formatted);
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);

            return () => clearInterval(interval);
        } else {
            setTimeRemaining(null);
        }
    }, [state.resetTimestamp, state.success]);

    const handleManualChange = (val: string) => {
        setManualInput(val);
        const floatVal = parseFloat(val.replace(',', '.'));
        if (!isNaN(floatVal)) {
            if (floatVal >= 0 && floatVal <= 5) {
                setRating([floatVal]);
            }
        } else if (val === "") {
            setRating([0]);
        }
    };
    const handleSliderChange = (val: number[]) => {
        setRating(val);
        setManualInput(val[0].toFixed(2));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-bg-primary border border-border-primary shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col h-full max-h-[90vh]">
                    <div className="sticky top-0 left-0 right-0 bg-bg-primary z-20 border-b border-border-primary px-6 py-4 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="font-serif text-xl md:text-3xl">
                                {isEditing ? "Modifica recensione" : "Scrivi recensione"}
                            </h2>
                            <p className="text-xs md:text-sm text-text-secondary truncate max-w-[200px] md:max-w-none">
                                su <span className="font-medium text-text-primary">{fragranceName}</span>
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-bg-secondary rounded-full transition-colors cursor-pointer -mr-2">
                            <X className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10">

                        {state.success ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-6 text-center">
                                <h3 className="text-xl font-serif mb-2">
                                    {isEditing ? "Aggiornata!" : "Grazie!"}
                                </h3>
                                <p>{state.message}</p>
                            </div>
                        ) : (
                            <form action={formAction} className="space-y-6 md:space-y-10 pb-4">
                                <input type="hidden" name="fragranceId" value={fragranceId} />
                                <input type="hidden" name="slug" value={fragranceSlug} />
                                <input type="hidden" name="rating" value={rating[0]} />
                                {isEditing && editingReview && (
                                    <input type="hidden" name="reviewId" value={editingReview.id} />
                                )}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">Voto Complessivo *</label>
                                    <div className="flex flex-col gap-4 bg-bg-secondary p-6 border border-border-primary">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1 text-accent">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={cn(
                                                            "h-6 w-6 transition-colors",
                                                            rating[0] >= star ? "fill-current" :
                                                                rating[0] > star - 1 ? "fill-current opacity-50" : "text-border-primary"
                                                        )}
                                                    />
                                                ))}
                                            </div>

                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={manualInput}
                                                onChange={(e) => handleManualChange(e.target.value)}
                                                onBlur={() => {
                                                    const val = parseFloat(manualInput.replace(',', '.'));
                                                    if (isNaN(val) || val < 1) {
                                                        if (val === 0) {
                                                            setRating([0]);
                                                            setManualInput("");
                                                        } else {
                                                            setRating([1]);
                                                            setManualInput("1.00");
                                                        }
                                                    } else if (val > 5) {
                                                        setRating([5]);
                                                        setManualInput("5.00");
                                                    } else {
                                                        setManualInput(val.toFixed(2));
                                                    }
                                                }}
                                                placeholder="0.00"
                                                className="font-serif text-4xl w-28 text-right bg-transparent outline-none border-b border-transparent focus:border-text-primary transition-colors p-0 m-0 placeholder-text-muted/30"
                                            />
                                        </div>

                                        <Slider
                                            min={1}
                                            max={5}
                                            step={0.01}
                                            value={rating[0] === 0 ? [1] : rating}
                                            onValueChange={handleSliderChange}
                                            className="cursor-pointer py-2"
                                        />
                                        <div className="flex justify-between text-[10px] text-text-muted font-mono ml-[-6px] mr-[-6px]">
                                            <span>1.0</span><span>2.0</span><span>3.0</span><span>4.0</span><span>5.0</span>
                                        </div>
                                    </div>
                                    {state.errors?.rating && <p className="text-red-500 text-xs mt-2">{state.errors.rating}</p>}
                                </div>

                                <div className="grid gap-8">
                                    <div className="relative">
                                        <div className="flex justify-between items-baseline mb-3">
                                            <label className="block text-xs uppercase tracking-widest text-text-muted">La tua esperienza</label>
                                        </div>

                                        <div className={cn(
                                            "transition-all",
                                            state.message && !state.success && !state.message.includes("Puoi inviare una recensione ogni")
                                                ? "bg-red-500/5 border border-red-500/20 p-4 rounded-sm"
                                                : ""
                                        )}>
                                            {state.message && !state.success && !state.message.includes("Puoi inviare una recensione ogni") && (
                                                <div className="mb-3 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
                                                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-red-600 mb-0.5">Impossibile pubblicare</p>
                                                        <p className="text-text-secondary text-xs leading-relaxed">{state.message}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <textarea
                                                name="comment"
                                                rows={4}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className={cn(
                                                    "w-full bg-bg-secondary border p-4 outline-none transition-all resize-none text-sm leading-relaxed",
                                                    state.message && !state.success && !state.message.includes("Puoi inviare una recensione ogni")
                                                        ? "border-red-500/50 focus:border-red-500"
                                                        : "border-border-primary focus:border-text-primary"
                                                )}
                                                placeholder="Racconta cosa ti piace (o non ti piace) di questa fragranza..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-8 border-t border-border-primary">
                                    <div>
                                        <div className="flex items-baseline justify-between mb-4">
                                            <div>
                                                <label className="text-xs uppercase tracking-widest text-text-muted block">Scia (Sillage)</label>
                                                <span className="text-[10px] text-text-secondary">Intima — Enorme</span>
                                            </div>
                                            <span className="font-mono text-xl">{valSillage[0].toFixed(1)}</span>
                                        </div>
                                        <div className="px-1">
                                            <DetailedSlider name="sillage" value={valSillage} onChange={setValSillage} step={0.1} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-baseline justify-between mb-4">
                                            <div>
                                                <label className="text-xs uppercase tracking-widest text-text-muted block">Longevità</label>
                                                <span className="text-[10px] text-text-secondary">Breve — Eterna</span>
                                            </div>
                                            <span className="font-mono text-xl">{valLongevity[0].toFixed(1)}</span>
                                        </div>
                                        <div className="px-1">
                                            <DetailedSlider name="longevity" value={valLongevity} onChange={setValLongevity} step={0.1} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-text-muted mb-3 md:mb-4">Secondo te è più...</label>
                                        <input type="hidden" name="genderVote" value={genderVote} />
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {[
                                                { value: "masculine", label: "Maschile" },
                                                { value: "feminine", label: "Femminile" },
                                                { value: "unisex", label: "Unisex" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setGenderVote(genderVote === opt.value ? "" : opt.value)}
                                                    className={cn(
                                                        "px-3 py-2 md:px-4 md:py-2 border text-[10px] md:text-xs uppercase tracking-wider transition-all flex-1 md:flex-none text-center",
                                                        genderVote === opt.value
                                                            ? "border-copper bg-copper/10 text-copper"
                                                            : "border-border-primary hover:border-text-muted"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-text-muted mb-3 md:mb-4">Stagioni ideali</label>
                                        <input type="hidden" name="seasonVote" value={selectedSeasons.join(",")} />
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { value: "spring", label: "Prim", Icon: SpringIcon, color: "text-emerald-500" },
                                                { value: "summer", label: "Est", Icon: SummerIcon, color: "text-amber-500" },
                                                { value: "autumn", label: "Aut", Icon: AutumnIcon, color: "text-orange-600" },
                                                { value: "winter", label: "Inv", Icon: WinterIcon, color: "text-sky-500" },
                                            ].map((s) => (
                                                <button
                                                    key={s.value}
                                                    type="button"
                                                    onClick={() => {
                                                        if (selectedSeasons.includes(s.value)) {
                                                            setSelectedSeasons(selectedSeasons.filter(x => x !== s.value));
                                                        } else {
                                                            setSelectedSeasons([...selectedSeasons, s.value]);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex flex-col items-center gap-1.5 p-2.5 border transition-all",
                                                        selectedSeasons.includes(s.value)
                                                            ? "border-copper bg-copper/10"
                                                            : "border-border-primary opacity-60 hover:opacity-100"
                                                    )}
                                                >
                                                    <s.Icon className={cn("h-5 w-5 md:h-6 md:w-6", selectedSeasons.includes(s.value) ? "text-copper" : s.color)} />
                                                    <span className="text-[9px] font-mono uppercase block">{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-2">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">Codice Batch (Opzionale)</label>
                                        <input
                                            name="batchCode"
                                            value={batchCode}
                                            onChange={(e) => setBatchCode(e.target.value)}
                                            className="w-full bg-bg-secondary border border-border-primary p-4 outline-none focus:border-text-primary transition-colors text-sm font-mono placeholder:text-text-muted/50"
                                            placeholder="Es. A42, 22S11..."
                                        />
                                        <p className="text-[10px] text-text-muted mt-2">Utile per tracciare le riformulazioni.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">Anno di Produzione (Opzionale)</label>
                                        <input type="hidden" name="productionDate" value={productionDate} />
                                        <div className="grid grid-cols-5 gap-2">
                                            {Array.from({ length: 10 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return (
                                                    <button
                                                        key={year}
                                                        type="button"
                                                        onClick={() => setProductionDate(productionDate === String(year) ? "" : String(year))}
                                                        className={cn(
                                                            "py-2 text-xs font-mono border transition-all",
                                                            productionDate === String(year)
                                                                ? "border-copper bg-copper/10 text-copper"
                                                                : "border-border-primary hover:border-text-muted"
                                                        )}
                                                    >
                                                        {year}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2">Seleziona l&apos;anno indicato sulla confezione.</p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={isPending || !!timeRemaining}
                                        type="submit"
                                        className={cn(
                                            "w-full py-4 transition-all font-medium flex flex-col items-center justify-center gap-1.5",
                                            isPending || timeRemaining
                                                ? "bg-red-500/10 border border-red-500/20 text-red-600/70 cursor-not-allowed"
                                                : state.message && !state.success
                                                    ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer uppercase tracking-widest text-sm"
                                                    : "bg-text-primary text-bg-primary hover:bg-text-secondary cursor-pointer uppercase tracking-widest text-sm"
                                        )}
                                    >
                                        {isPending ? (
                                            <span className="uppercase tracking-widest text-sm">Invio in corso...</span>
                                        ) : timeRemaining ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Attendi</span>
                                                </div>
                                                <span className="text-xs font-normal normal-case tracking-normal leading-relaxed px-4 text-center">
                                                    Puoi inviare una recensione tra {timeRemaining}
                                                </span>
                                            </>
                                        ) : state.message && !state.success ? (
                                            <>
                                                <AlertCircle className="h-4 w-4" />
                                                Correggi e Riprova
                                            </>
                                        ) : (
                                            isEditing ? "Salva Modifiche" : "Invia Recensione"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

function DetailedSlider({ name, value, onChange, step = 0.1 }: { name: string, value: number[], onChange: (val: number[]) => void, step?: number }) {
    return (
        <div className="relative pt-1">
            <input type="hidden" name={name} value={value[0]} />
            <Slider
                min={1} max={5} step={step}
                value={value}
                onValueChange={onChange}
                className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-2 font-mono ml-[-6px] mr-[-6px]">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
        </div>
    );
}
