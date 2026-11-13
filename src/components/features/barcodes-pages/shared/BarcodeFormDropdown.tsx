"use client";
import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

interface BarcodeFormDropdownOption {
    value: string;
    label: string;
}

interface BarcodeFormDropdownProps {
    label: string;
    required?: boolean;
    placeholder: string;
    value: string;
    options: BarcodeFormDropdownOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
    /** Shown inside the open menu when there is nothing to pick. */
    emptyText?: string;
}

/** The labelled custom dropdown the Create Barcode form already used, made reusable. */
export function BarcodeFormDropdown({
    label, required = false, placeholder, value, options, onChange, disabled = false, emptyText = "No options available",
}: BarcodeFormDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const selected = options.find((option) => option.value === value);

    return (
        <div className="flex-1 w-full flex flex-col gap-1.5 relative">
            <label className="text-xs font-bold text-brand-subtext tracking-wider">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
            >
                <span className={`truncate ${selected ? "text-brand-text" : "text-brand-subtext"}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-brand-subtext transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && !disabled && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-full z-20 max-h-60 overflow-y-auto custom-scrollbar rounded-lg border border-brand-subtext/20 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2">
                        {options.length === 0 ? (
                            <p className="px-4 py-2 text-sm text-brand-subtext">{emptyText}</p>
                        ) : options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className="flex w-full items-center justify-between px-4 py-2 text-sm text-brand-text hover:bg-brand-bg transition-colors"
                            >
                                <span className="truncate text-left">{option.label}</span>
                                {value === option.value && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
