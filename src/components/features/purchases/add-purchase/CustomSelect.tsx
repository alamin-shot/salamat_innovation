"use client";
import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomSelect({ value, onChange, options, placeholder }: { value: string, onChange: (v: string) => void, options: string[], placeholder: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative w-full">
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-between font-normal"
            >
                <span className={value ? "text-gray-700" : "text-gray-400"}>{value || placeholder}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full z-20 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                        {options.map(opt => (
                            <button key={opt} type="button" onClick={() => { onChange(opt); setIsOpen(false); }} className="flex w-full items-center justify-between px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                                {opt}
                                {value === opt && <Check className="h-4 w-4 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}