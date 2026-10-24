"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
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
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${size === "sm" ? "inline-block w-auto min-w-[130px]" : "w-full"}`} ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white text-gray-700 hover:border-emerald-500 focus:outline-none ${size === "sm"
                        ? "h-7 px-2.5 py-0.5 text-[11px] font-medium rounded-full gap-1.5"
                        : "h-9 w-full px-3 py-2 text-[13px] font-medium"
                    } ${triggerClassName}`}
            >
                <span className={`truncate ${!value ? "text-gray-400" : ""}`}>{value || placeholder}</span>
                <ChevronDown
                    className={`shrink-0 transition-transform ${size === "sm" ? "h-3 w-3 opacity-70" : "h-4 w-4 text-gray-400"} ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 top-full z-[100] mt-1 max-h-60 w-full min-w-[130px] overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`flex cursor-pointer items-center justify-between px-3 py-2 text-[13px] hover:bg-emerald-50 hover:text-emerald-700 ${value === option ? "bg-emerald-50/50 font-semibold text-emerald-700" : "text-gray-700"
                                }`}
                        >
                            <span className="truncate">{option}</span>
                            {value === option && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}