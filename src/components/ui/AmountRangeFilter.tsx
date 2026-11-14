"use client";
import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Coins, X } from "lucide-react";
import { AmountRangeValue } from "@/types/ui";

// Filter-bar chip for a min / max amount. Like DateRangeFilter, the popover edits a draft and
// commits it on "Apply"; the parent manager hook owns the committed range.

const taka = (value: number) => `৳${value.toLocaleString("en-IN")}`;

/** "৳1,000 – ৳5,000", "≥ ৳1,000", "≤ ৳5,000" or "Any". */
export function formatAmountRangeLabel(value: AmountRangeValue): string {
    if (value.min !== null && value.max !== null) return `${taka(value.min)} – ${taka(value.max)}`;
    if (value.min !== null) return `≥ ${taka(value.min)}`;
    if (value.max !== null) return `≤ ${taka(value.max)}`;
    return "Any";
}

const parse = (text: string): number | null => {
    const value = Number(text);
    return text.trim() === "" || !Number.isFinite(value) || value < 0 ? null : value;
};

const INPUT = "w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none";

export function AmountRangeFilter({ label = "Amount", value, onChange }: { label?: string; value: AmountRangeValue; onChange: (value: AmountRangeValue) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [minDraft, setMinDraft] = React.useState("");
    const [maxDraft, setMaxDraft] = React.useState("");
    const hasValue = value.min !== null || value.max !== null;

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setMinDraft(value.min === null ? "" : String(value.min));
            setMaxDraft(value.max === null ? "" : String(value.max));
        }
        setIsOpen(open);
    };

    const min = parse(minDraft);
    const max = parse(maxDraft);
    const isInverted = min !== null && max !== null && min > max;

    const handleApply = () => {
        if (isInverted) return;
        onChange({ min, max });
        setIsOpen(false);
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            <div className="flex shrink-0 items-center">
                <Popover.Trigger className={`flex items-center justify-between gap-2 border border-brand-subtext/30 bg-white px-3 py-1.5 text-xs font-medium text-brand-text shadow-sm transition-colors hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${hasValue ? "rounded-l-lg border-r-0" : "rounded-lg"}`}>
                    <Coins className="h-3.5 w-3.5 text-brand-subtext" />
                    <span className="text-brand-subtext">{label}:</span>
                    <span className="whitespace-nowrap font-semibold text-brand-text">{formatAmountRangeLabel(value)}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-brand-subtext" />
                </Popover.Trigger>
                {hasValue && (
                    <button
                        type="button"
                        onClick={() => onChange({ min: null, max: null })}
                        title="Clear amount range"
                        className="flex items-center self-stretch rounded-r-lg border border-brand-subtext/30 bg-white px-2 text-brand-subtext shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            <Popover.Portal>
                <Popover.Content align="start" sideOffset={6} collisionPadding={16} className="z-[100] w-72 max-w-[calc(100vw-32px)] rounded-xl border border-brand-subtext/20 bg-white p-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1 text-xs font-semibold text-brand-subtext">
                            Min (৳)
                            <input type="number" min="0" inputMode="decimal" value={minDraft} onChange={(e) => setMinDraft(e.target.value)} placeholder="0" className={INPUT} />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-semibold text-brand-subtext">
                            Max (৳)
                            <input type="number" min="0" inputMode="decimal" value={maxDraft} onChange={(e) => setMaxDraft(e.target.value)} placeholder="Any" className={INPUT} />
                        </label>
                    </div>
                    {isInverted && <p className="mt-2 text-xs font-medium text-rose-600">Min must not be greater than Max.</p>}
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-subtext hover:bg-brand-bg">Cancel</button>
                        <button type="button" onClick={handleApply} disabled={isInverted} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">Apply</button>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
