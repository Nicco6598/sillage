
"use client";

import { useActionState, useState, useEffect } from "react";
import { submitReview } from "@/app/actions/submit-review";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fragranceId: string;
    fragranceSlug: string;
    fragranceName: string;
}

const initialState = {
    message: "",
    errors: {},
    success: false
};

export function ReviewModal({ isOpen, onClose, fragranceId, fragranceSlug, fragranceName }: ReviewModalProps) {
    const [state, formAction, isPending] = useActionState(submitReview, initialState);

    // Rating state
    const [rating, setRating] = useState([0]);
    const [manualInput, setManualInput] = useState("");

    // Local state for sliders
    const [valSillage, setValSillage] = useState([3.0]);
    const [valLongevity, setValLongevity] = useState([3.0]);

    // Reset when modal opens
    useEffect(() => {
        if (!isOpen) {
            setRating([0]);
            setManualInput("");
            setValSillage([3.0]);
            setValLongevity([3.0]);
        }
        if (state.success) {
            const t = setTimeout(() => {
                onClose();
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [isOpen, state.success, onClose]);

    // Handle manual rating input changes (typing)
    const handleManualChange = (val: string) => {
        setManualInput(val); // Just update text first to allow typing "2." or "2.3"

        // Try to parse and update slider in background
        const floatVal = parseFloat(val.replace(',', '.'));
        if (!isNaN(floatVal)) {
            if (floatVal >= 0 && floatVal <= 5) {
                setRating([floatVal]);
            }
        } else if (val === "") {
            setRating([0]);
        }
    };

    // Handle slider changes
    const handleSliderChange = (val: number[]) => {
        setRating(val);
        // Sync text immediately when dragging slider
        setManualInput(val[0].toFixed(2));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-bg-primary border border-border-primary shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-bg-secondary rounded-full transition-colors z-10 cursor-pointer">
                    <X className="h-6 w-6" />
                </button>

                <div className="p-8 md:p-10">
                    <h2 className="font-serif text-3xl mb-2">Scrivi una recensione</h2>
                    <p className="text-text-secondary mb-8">Condividi la tua opinione su <span className="font-medium text-text-primary">{fragranceName}</span></p>

                    {state.success ? (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-6 text-center">
                            <h3 className="text-xl font-serif mb-2">Grazie!</h3>
                            <p>{state.message}</p>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-10">
                            <input type="hidden" name="fragranceId" value={fragranceId} />
                            <input type="hidden" name="slug" value={fragranceSlug} />
                            <input type="hidden" name="rating" value={rating[0]} />

                            {/* Rating */}
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

                                        {/* Custom Input */}
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={manualInput}
                                            onChange={(e) => handleManualChange(e.target.value)}
                                            onBlur={() => {
                                                const val = parseFloat(manualInput.replace(',', '.'));
                                                if (isNaN(val) || val < 1) {
                                                    // If empty or invalid on blur, reset to safe minimum or keep 0 if intended
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

                            {/* Name & Comment */}
                            <div className="grid gap-8">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">Nome Utente *</label>
                                    <input
                                        name="userName"
                                        className="w-full bg-bg-secondary border border-border-primary p-4 outline-none focus:border-text-primary transition-colors text-sm"
                                        placeholder="Come vuoi essere chiamato?"
                                    />
                                    {state.errors?.userName && <p className="text-red-500 text-xs mt-2">{state.errors.userName}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">La tua esperienza</label>
                                    <textarea
                                        name="comment"
                                        rows={4}
                                        className="w-full bg-bg-secondary border border-border-primary p-4 outline-none focus:border-text-primary transition-colors resize-none text-sm leading-relaxed"
                                        placeholder="Racconta cosa ti piace (o non ti piace) di questa fragranza..."
                                    />
                                </div>
                            </div>

                            {/* Detailed Ratings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-8 border-t border-border-primary">
                                {/* Sillage */}
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
                                {/* Longevity */}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Gender Vote */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-4">Secondo te è più...</label>
                                    <div className="flex flex-wrap gap-4">
                                        <RadioOption name="genderVote" value="masculine" label="Maschile" />
                                        <RadioOption name="genderVote" value="feminine" label="Femminile" />
                                        <RadioOption name="genderVote" value="unisex" label="Unisex" />
                                    </div>
                                </div>
                                {/* Season Vote */}
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-text-muted mb-4">Stagioni ideali (selezione multipla)</label>
                                    <SeasonSelector name="seasonVote" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full bg-text-primary text-bg-primary py-4 uppercase tracking-widest hover:bg-text-secondary transition-colors disabled:opacity-50 font-medium cursor-pointer"
                                >
                                    {isPending ? "Invio in corso..." : "Invia Recensione"}
                                </button>
                            </div>

                            {state.message && !state.success && (
                                <p className="text-red-500 text-center text-sm bg-red-500/5 p-2 border border-red-500/10">{state.message}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
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

function RadioOption({ name, value, label }: { name: string, value: string, label: string }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group select-none">
            <div className="relative flex items-center">
                <input type="radio" name={name} value={value} className="peer sr-only " />
                <div className="w-4 h-4 border border-border-primary rounded-full peer-checked:border-accent peer-checked:bg-accent transition-all"></div>
            </div>
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors uppercase tracking-wider text-xs">{label}</span>
        </label>
    );
}

function SeasonSelector({ name }: { name: string }) {
    const [selected, setSelected] = useState<string[]>([]);
    const seasons = [
        { value: "spring", label: "Primavera", icon: "🌸" },
        { value: "summer", label: "Estate", icon: "☀️" },
        { value: "autumn", label: "Autunno", icon: "🍂" },
        { value: "winter", label: "Inverno", icon: "❄️" },
    ];

    const toggleSeason = (val: string) => {
        if (selected.includes(val)) {
            setSelected(selected.filter(s => s !== val));
        } else {
            setSelected([...selected, val]);
        }
    };

    return (
        <div className="grid grid-cols-4 gap-3">
            <input type="hidden" name={name} value={selected.join(",")} />
            {seasons.map((s) => (
                <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSeason(s.value)}
                    className={cn(
                        "flex flex-col items-center gap-2 p-2 sm:py-4 border transition-all cursor-pointer hover:bg-bg-secondary min-w-0 relative",
                        selected.includes(s.value)
                            ? "border-text-primary bg-bg-secondary"
                            : "border-border-primary opacity-60 hover:opacity-100"
                    )}
                >
                    <span className="text-2xl sm:text-3xl">{s.icon}</span>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-center hidden sm:block truncate w-full">{s.label}</span>

                    {selected.includes(s.value) && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-text-primary rounded-full md:hidden"></div>
                    )}
                </button>
            ))}
        </div>
    );
}
