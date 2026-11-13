"use client";
import * as React from "react";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { usePriceRangeAnalysis } from "@/hooks/products_hooks/usePriceRangeAnalysis";
import { PriceRangeTable } from "./PriceRangeTable";
import { PriceRangeDrawer } from "./PriceRangeDrawer";

export function PriceRangesClientManager() {
    const manager = useProductsManager("price_ranges");
    const analysis = usePriceRangeAnalysis();

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Price Ranges</h1>
                            <p className="text-xs sm:text-sm text-brand-subtext">Manage the price filter chips shown on the storefront — only Active ranges are shown to shoppers</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => manager.openDrawer("modal", "add")}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                        >
                            + Add Price Range
                        </button>
                    </div>
                }
            >
                <PriceRangeTable manager={manager} analysis={analysis} />
            </SectionPageShell>

            <PriceRangeDrawer manager={manager} analysis={analysis} />
        </>
    );
}
