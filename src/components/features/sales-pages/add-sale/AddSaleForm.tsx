"use client";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useAddSaleManager } from "@/hooks/useAddSaleManager";
import { SaleTopSection } from "./SaleTopSection";
import { SaleQueueSection } from "./SaleQueueSection";
import { SaleSummarySection } from "./SaleSummarySection";


export function AddSaleForm() {
    // Initializes the complex math and cart logic
    const manager = useAddSaleManager();

    return (
        <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">

            {/* The 3 modular pieces we built earlier */}
            <SaleTopSection manager={manager} />
            <SaleQueueSection manager={manager} />
            <SaleSummarySection manager={manager} />

            <div className="flex justify-end pt-4 mt-2 border-t border-gray-100">
                <Button variant="success" onClick={manager.handleSaveSale} className="px-10">
                    Save
                </Button>
            </div>
        </div>
    );
}