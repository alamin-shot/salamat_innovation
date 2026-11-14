import * as React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SpokeToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    actionLabel: string;
    onAction: () => void;
}

/** Search on the left, the spoke's create button on the right. */
export function SpokeToolbar({ searchQuery, onSearchChange, searchPlaceholder, actionLabel, onAction }: SpokeToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 p-4">
            <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                />
            </div>
            <Button variant="success" size="sm" onClick={onAction} className="w-full sm:w-auto gap-1.5">
                <Plus className="h-4 w-4" /> {actionLabel}
            </Button>
        </div>
    );
}
