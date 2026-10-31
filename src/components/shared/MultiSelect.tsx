"use client";
import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

interface MultiSelectProps {
    options: string[];
    value: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "Select options..." }: MultiSelectProps) {
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

    const toggleOption = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter(item => item !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className="erp-input min-h-[38px] h-auto flex flex-wrap items-center gap-1.5 cursor-pointer pr-8"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    value.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-brand-primary/10 text-brand-primary text-xs font-medium px-2 py-0.5 rounded">
                            {tag}
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleOption(tag); }} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))
                )}
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(option => {
                        const isSelected = value.includes(option);
                        return (
                            <div
                                key={option}
                                className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleOption(option)}
                            >
                                <span className={isSelected ? "font-medium text-brand-primary" : "text-gray-700"}>{option}</span>
                                {isSelected && <Check className="w-4 h-4 text-brand-primary" />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}