"use client";
import * as React from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { ProductCareOption } from "@/types/products";

interface CarePlanSelectProps {
    options: ProductCareOption[];
    /** Text shown in the trigger for the current selection; empty when nothing is selected. */
    selectedLabel: string;
    isSelected: (option: ProductCareOption) => boolean;
    onSelect: (option: ProductCareOption) => void;
}

/** Searchable care-plan dropdown fed from the /admin/care page records. */
export function CarePlanSelect({ options, selectedLabel, isSelected, onSelect }: CarePlanSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div ref={containerRef} className="flex flex-col gap-2 relative max-w-xl">
            <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Select Care</label>

            {/* Dropdown Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full cursor-pointer items-center justify-between rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text shadow-sm hover:border-emerald-500 transition-colors"
            >
                <span className="font-medium truncate">{selectedLabel || "Choose a care"}</span>
                <ChevronDown className="h-4 w-4 text-brand-subtext shrink-0 ml-2" />
            </div>

            {/* Searchable Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-xl border border-brand-subtext/20 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="sticky top-0 bg-white p-2.5 border-b border-brand-subtext/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-subtext" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search care plans..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-brand-subtext/20 bg-brand-bg/40 py-1.5 pl-8 pr-3 text-sm focus:border-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => {
                                        onSelect(option);
                                        setIsOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 text-xs font-medium text-brand-text hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                >
                                    <span>{option.label}{option.inactive ? " (Inactive)" : ""}</span>
                                    {isSelected(option) && <Check className="h-4 w-4 text-emerald-600" />}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-brand-subtext">No care plans found. Add them on the Care page.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
