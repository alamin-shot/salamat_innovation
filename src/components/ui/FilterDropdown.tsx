"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedValue?: string;
    onSelect: (value: string) => void;
}

export function FilterDropdown({ label, options, selectedValue, onSelect }: FilterDropdownProps) {
    const selectedOption = options.find((o) => o.value === selectedValue);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center justify-between gap-2 rounded-lg border border-brand-subtext/30 bg-white px-3 py-1.5 text-xs font-medium text-brand-text shadow-sm transition-colors hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                <span className="text-brand-subtext">{label}:</span>
                <span className="font-semibold text-brand-text">
                    {selectedOption ? selectedOption.label : "All"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-brand-subtext" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    sideOffset={4}
                    className="z-[100] w-44 rounded-xl border border-brand-subtext/20 bg-white p-1.5 shadow-xl max-h-[240px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95"
                >
                    <DropdownMenu.Item
                        onClick={() => onSelect("")}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-brand-subtext outline-none transition-colors hover:bg-brand-bg hover:text-brand-text"
                    >
                        <span>All {label}s</span>
                        {!selectedValue && <Check className="h-3.5 w-3.5 text-brand-primary" />}
                    </DropdownMenu.Item>

                    {options.map((opt) => {
                        const isSelected = selectedValue === opt.value;
                        return (
                            <DropdownMenu.Item
                                key={opt.value}
                                onClick={() => onSelect(opt.value)}
                                className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-brand-text outline-none transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
                            >
                                <span className={isSelected ? "font-bold text-brand-primary" : ""}>{opt.label}</span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-brand-primary" />}
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}