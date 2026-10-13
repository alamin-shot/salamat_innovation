"use client";
import * as React from "react";
import { useAddPurchaseManager } from "@/hooks/useAddPurchaseManager";
import { PurchaseTopSection } from "./PurchaseTopSection";
import { PurchaseQueueSection } from "./PurchaseQueueSection";
import { PurchaseSummarySection } from "./PurchaseSummarySection";

import { Button } from "@/components/ui/button";

export function AddPurchaseForm() {
    const manager = useAddPurchaseManager();

    return (
        <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">

            <PurchaseTopSection manager={manager} />
            <PurchaseQueueSection manager={manager} />
            <PurchaseSummarySection manager={manager} />

            <div className="flex justify-end pt-4 mt-2">
                <Button
                    type="button"
                    variant="success"
                    onClick={manager.handleSavePurchase}
                    className="px-6"
                >
                    Save
                </Button>
            </div>

        </div>
    );
}