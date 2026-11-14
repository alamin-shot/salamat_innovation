import * as React from "react";
import { Search, ScanLine } from "lucide-react";
import { PurchaseUnitOption } from "@/types/purchases";

interface PurchaseUnitSearchBarProps {
    query: string;
    onQueryChange: (value: string) => void;
    results: PurchaseUnitOption[];
    /** Enter: exact Serial/IMEI lookup (barcode scanners send the serial + Enter). */
    onScan: () => void;
    onPick: (option: PurchaseUnitOption) => void;
    placeholder: string;
    disabled?: boolean;
    /** Shown when the query matches no eligible unit. */
    emptyText: string;
}

/** Product Search for scanners and typing: Enter adds an exact serial, or pick from the matching units. */
export function PurchaseUnitSearchBar({ query, onQueryChange, results, onScan, onPick, placeholder, disabled = false, emptyText }: PurchaseUnitSearchBarProps) {
    const showList = query.trim().length > 0 && !disabled;

    return (
        <div className="relative mb-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                disabled={disabled}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onScan();
                    }
                }}
                placeholder={placeholder}
                className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            {showList && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto custom-scrollbar rounded-lg border border-brand-subtext/20 bg-white py-1 shadow-xl" role="listbox">
                    {results.length === 0 ? (
                        <p className="px-4 py-3 text-[13px] text-gray-500">{emptyText}</p>
                    ) : results.map((option) => (
                        <button
                            key={option.barcodeId}
                            type="button"
                            role="option"
                            aria-selected="false"
                            onClick={() => onPick(option)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-2 text-left transition-colors hover:bg-emerald-50"
                        >
                            <span className="flex min-w-0 flex-col">
                                <span className="truncate text-[13px] font-medium text-gray-700">{option.productName}</span>
                                <span className="truncate text-[11px] text-emerald-600">{option.variant} · {option.sku}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[12px] text-gray-500">
                                <ScanLine className="h-3.5 w-3.5" /> {option.serial}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
