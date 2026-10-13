"use client";
import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InlineDropdownProps {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    /** 
     * Optional function to dynamically style the badge based on its string value 
     */
    getBadgeStyle?: (value: string) => string;
    placeholder?: string;
}

export function InlineDropdown({ value, options, onSelect, getBadgeStyle, placeholder = "Select..." }: InlineDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Apply dynamic style if provided, otherwise fallback to a generic neutral style
    const triggerStyle = getBadgeStyle
        ? getBadgeStyle(value)
        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none",
                    triggerStyle
                )}
            >
                {value || placeholder} <ChevronDown className="h-3 w-3" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 mt-1 w-max min-w-[140px] rounded-md border border-gray-200 bg-white shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { onSelect(opt); setIsOpen(false); }}
                                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[12px] text-gray-700 hover:bg-gray-50"
                            >
                                {/* If a style function exists, style the list options too. Otherwise just render text. */}
                                {getBadgeStyle ? (
                                    <span className={cn("px-2 py-0.5 rounded-full text-[10px]", getBadgeStyle(opt))}>
                                        {opt}
                                    </span>
                                ) : (
                                    <span>{opt}</span>
                                )}
                                {value === opt && <Check className="h-3 w-3 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}