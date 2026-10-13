"use client";
import * as React from "react";
import { useAddPurchaseReturnManager } from "@/hooks/useAddPurchaseReturnManager";
import { ReturnTopSection } from "./ReturnTopSection";
import { ReturnQueueSection } from "./ReturnQueueSection";
import { ReturnSummarySection } from "./ReturnSummarySection";

export function AddPurchaseReturnForm() {
    // 1. Initialize the Brain
    const manager = useAddPurchaseReturnManager();

    // 2. Pass the logic down into the Modular UI
    return (
        <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">

            <ReturnTopSection manager={manager} />
            <ReturnQueueSection manager={manager} />
            <ReturnSummarySection manager={manager} />

            <div className="flex justify-end pt-4 mt-2">
                <button
                    onClick={manager.handleSaveReturn}
                    className="rounded bg-[#108c5d] px-6 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                    Save Return
                </button>
            </div>

        </div>
    );
}