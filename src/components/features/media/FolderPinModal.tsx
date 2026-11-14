"use client";
import * as React from "react";
import { Lock, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MEDIA_PIN_LENGTH } from "@/constants/media";

interface FolderPinModalProps {
    folderName: string;
    role: string;
    onSubmit: (pin: string) => boolean;
    onClose: () => void;
}

/** 4-digit PIN entry for a locked folder. Mount only while open so every attempt starts empty. */
export function FolderPinModal({ folderName, role, onSubmit, onClose }: FolderPinModalProps) {
    const [digits, setDigits] = React.useState<string[]>(() => Array(MEDIA_PIN_LENGTH).fill(""));
    const [error, setError] = React.useState(false);
    const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

    const submit = (values: string[]) => {
        const pin = values.join("");
        if (pin.length < MEDIA_PIN_LENGTH) return;
        if (onSubmit(pin)) return;
        setError(true);
        setDigits(Array(MEDIA_PIN_LENGTH).fill(""));
        inputs.current[0]?.focus();
    };

    const setDigit = (index: number, raw: string) => {
        const value = raw.replace(/\D/g, "");
        if (!value) {
            setDigits((prev) => prev.map((digit, i) => (i === index ? "" : digit)));
            return;
        }
        // Pasting or typing several digits fills the following boxes.
        const next = [...digits];
        value.slice(0, MEDIA_PIN_LENGTH - index).split("").forEach((digit, offset) => { next[index + offset] = digit; });
        setDigits(next);
        setError(false);
        const nextIndex = Math.min(index + value.length, MEDIA_PIN_LENGTH - 1);
        inputs.current[nextIndex]?.focus();
        if (next.every(Boolean)) submit(next);
    };

    const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace" && !digits[index] && index > 0) inputs.current[index - 1]?.focus();
        if (event.key === "Enter") submit(digits);
        if (event.key === "Escape") onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Enter folder PIN">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Close">
                    <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600"><Lock className="h-6 w-6" /></div>
                    <h2 className="text-lg font-bold text-gray-900">Locked folder</h2>
                    <p className="text-sm text-gray-500"><b className="text-gray-800">{folderName}</b> is protected. Enter the 4-digit PIN to open it as {role}.</p>
                </div>

                <div className="mt-5 flex justify-center gap-3">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) => { inputs.current[index] = element; }}
                            value={digit}
                            onChange={(e) => setDigit(index, e.target.value)}
                            onKeyDown={(e) => onKeyDown(index, e)}
                            inputMode="numeric"
                            type="password"
                            autoComplete="one-time-code"
                            autoFocus={index === 0}
                            maxLength={MEDIA_PIN_LENGTH}
                            aria-label={`PIN digit ${index + 1}`}
                            className={`h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold text-gray-900 focus:outline-none ${error ? "border-rose-400 bg-rose-50" : "border-gray-200 focus:border-emerald-500"}`}
                        />
                    ))}
                </div>
                {error && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-rose-600"><ShieldAlert className="h-4 w-4" /> Incorrect PIN. Try again.</p>
                )}

                <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="success" onClick={() => submit(digits)} disabled={!digits.every(Boolean)} className="flex-1">Unlock</Button>
                </div>
            </div>
        </div>
    );
}
