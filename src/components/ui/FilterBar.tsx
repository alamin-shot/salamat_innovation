import * as React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClearFilters?: () => void;
    activeFilterCount?: number;
    children?: React.ReactNode; // Slot for the specific filter dropdowns
}

export function FilterBar({
    searchQuery,
    onSearchChange,
    onClearFilters,
    activeFilterCount = 0,
    children
}: FilterBarProps) {
    return (
        <div className="flex flex-col gap-3 border-b border-brand-subtext/20 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Search Input Area */}
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full border-brand-subtext/20 bg-brand-bg/50 pl-9 shadow-none transition-colors hover:bg-brand-bg focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary"
                />
            </div>

            {/* Dynamic Filter Pills Area */}
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0 custom-scrollbar">
                <div className="flex items-center gap-1.5 border-r border-brand-subtext/20 pr-3 text-sm font-medium text-brand-subtext">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary">
                            {activeFilterCount}
                        </span>
                    )}
                </div>

                {/* Render specific page filters (Category, Brand, etc.) here */}
                <div className="flex items-center gap-2 pl-1">
                    {children}
                </div>

                {/* Clear Filters Button */}
                {activeFilterCount > 0 && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="ml-1 flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        <X className="h-3 w-3" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}