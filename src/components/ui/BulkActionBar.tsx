"use client";
import * as React from "react";
import { X } from "lucide-react";

interface BulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    children: React.ReactNode;
}

export function BulkActionBar({ selectedCount, onClearSelection, children }: BulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 sm:gap-4 rounded-2xl border border-brand-subtext/20 bg-brand-text px-4 py-3 text-white shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex items-center gap-2 border-r border-brand-subtext/30 pr-2 sm:pr-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                    {selectedCount}
                </span>
                <span className="hidden sm:inline-block text-sm font-medium">Selected</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {children}
            </div>

            <div className="border-l border-brand-subtext/30 pl-2 sm:pl-4">
                <button
                    onClick={onClearSelection}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext transition-colors hover:bg-white/10 hover:text-white"
                    title="Clear selection"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}