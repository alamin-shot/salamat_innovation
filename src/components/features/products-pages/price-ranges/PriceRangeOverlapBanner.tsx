import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { PriceRangeOverlap } from "@/types/products";
import { formatPriceSpan } from "@/utils/priceRangeRules";

interface PriceRangeOverlapBannerProps {
    overlaps: PriceRangeOverlap[];
    /** The range being edited is Inactive, so the clash only happens once it is activated. */
    isInactive: boolean;
}

/** Live amber warning. Overlaps never block saving. */
export function PriceRangeOverlapBanner({ overlaps, isInactive }: PriceRangeOverlapBannerProps) {
    if (overlaps.length === 0) {
        return null;
    }

    const count = `${overlaps.length} active ${overlaps.length === 1 ? "range" : "ranges"}`;

    return (
        <div role="status" className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex min-w-0 flex-col gap-2">
                <div>
                    <p className="text-sm font-bold text-amber-800">
                        {isInactive ? `If activated, this range will overlap ${count}` : `This range overlaps ${count}`}
                    </p>
                    <p className="text-xs text-amber-700">
                        Products priced inside the shared stretch will appear under more than one storefront chip. You can still save.
                    </p>
                </div>
                <ul className="flex flex-wrap gap-2">
                    {overlaps.map((overlap) => (
                        <li key={overlap.rangeId} className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800">
                            <span className="font-semibold">{overlap.label}</span>
                            <span className="text-amber-600">·</span>
                            <span className="tabular-nums">{formatPriceSpan(overlap.from, overlap.to)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
