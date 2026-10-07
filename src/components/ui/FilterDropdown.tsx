"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { FilterOption } from "@/types/filter";

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedValue?: string;
    onSelect: (value: string) => void;
}

export function FilterDropdown({ label, options, selectedValue, onSelect }: FilterDropdownProps) {
    const selectedLabel = options.find(o => o.value === selectedValue)?.label;

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex cursor-pointer select-none items-center gap-1.5 rounded-lg border border-brand-subtext/20 bg-white px-3 py-1.5 text-sm font-medium text-brand-text transition-colors hover:bg-brand-bg/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 data-[state=open]:bg-brand-bg/80">
                {selectedLabel ? (
                    <span className="text-brand-primary font-semibold">{selectedLabel}</span>
                ) : (
                    label
                )}
                <ChevronDown className="h-3.5 w-3.5 text-brand-subtext transition-transform data-[state=open]:rotate-180" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    sideOffset={8}
                    collisionPadding={16}
                    className="z-[100] w-48 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                >
                    {options.map((option) => (
                        <DropdownMenu.Item
                            key={option.value}
                            onClick={() => onSelect(option.value)}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-brand-bg ${selectedValue === option.value ? "bg-brand-primary/10 text-brand-primary font-medium" : "text-brand-text"
                                }`}
                        >
                            {option.label}
                            {selectedValue === option.value && <Check className="h-4 w-4" />}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}