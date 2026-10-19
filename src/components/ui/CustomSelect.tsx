"use client";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CustomSelectProps {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
    size?: "default" | "sm";
    triggerClassName?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    size = "default",
    triggerClassName = "",
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${size === "sm" ? "inline-block w-auto min-w-[130px]" : "w-full"}`}>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`justify-between font-normal ${size === "sm"
                    ? "h-7 px-2.5 py-0.5 text-[11px] font-medium rounded-full gap-1.5"
                    : "w-full"
                    } ${triggerClassName}`}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown
                    className={`shrink-0 transition-transform ${size === "sm" ? "h-3 w-3 opacity-70" : "h-4 w-4 text-gray-400"
                        } ${isOpen ? "rotate-180" : ""}`}
                />
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 min-w-[150px] w-full z-20 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                        {options.map((opt) => (
                            <Button
                                key={opt}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-none px-3.5 py-2 text-[12px] font-normal text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-700"
                            >
                                <span className="truncate">{opt}</span>
                                {value === opt && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                            </Button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}