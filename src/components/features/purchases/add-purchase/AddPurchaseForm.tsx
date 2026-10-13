"use client";
import * as React from "react";
import { useAddPurchaseManager } from "@/hooks/useAddPurchaseManager";
import { PurchaseTopSection } from "./PurchaseTopSection";
import { PurchaseQueueSection } from "./PurchaseQueueSection";
import { PurchaseSummarySection } from "./PurchaseSummarySection";

export function AddPurchaseForm() {
    const manager = useAddPurchaseManager();

    return (
        <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">

            <PurchaseTopSection manager={manager} />
            <PurchaseQueueSection manager={manager} />
            <PurchaseSummarySection manager={manager} />

            <div className="flex justify-end pt-4 mt-2">
                <button
                    onClick={manager.handleSavePurchase}
                    className="rounded bg-[#108c5d] px-6 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                    Save
                </button>
            </div>

        </div>
    );
}