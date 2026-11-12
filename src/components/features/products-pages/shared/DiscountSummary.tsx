"use client";
import * as React from "react";
import { computeDiscount, formatTaka } from "@/utils/productRules";

interface DiscountSummaryProps {
    maxRetailPrice: number | null;
    sellingPrice: number | null;
    /** Compact variant for table cells. */
    compact?: boolean;
}

/** Read-only discount derived from MRP vs. Selling Price. Replaces the manual discount inputs. */
export const DiscountSummary = React.memo(function DiscountSummary({ maxRetailPrice, sellingPrice, compact = false }: DiscountSummaryProps) {
    const discount = computeDiscount(maxRetailPrice, sellingPrice);

    let text = "—";
    let tone = "text-brand-subtext";

    if (discount.state === "discounted") {
        text = `${formatTaka(discount.amount)} (${discount.percent}%)`;
        tone = "text-emerald-700 font-semibold";
    } else if (discount.state === "none") {
        text = "No discount";
    } else if (discount.state === "selling_above_mrp") {
        text = "Selling price exceeds MRP";
        tone = "text-rose-600 font-semibold";
    }

    if (compact) {
        return <span className={`text-xs ${tone}`}>{text}</span>;
    }

    return (
        <div className="flex h-[38px] w-full items-center rounded-md border border-brand-subtext/20 bg-brand-bg/50 px-3 text-sm">
            <span className={tone}>{text}</span>
        </div>
    );
});

DiscountSummary.displayName = "DiscountSummary";
