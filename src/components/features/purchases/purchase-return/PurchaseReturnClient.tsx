"use client";
import * as React from "react";
import { PurchaseReturnTable } from "./PurchaseReturnTable";
import { ViewPurchaseReturnDrawer } from "./ViewPurchaseReturnDrawer";
import { EditPurchaseReturnDrawer } from "./EditPurchaseReturnDrawer";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export function PurchaseReturnClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Purchase Return</h1>
            </div>

            <div className="w-full pb-12">
                <PurchaseReturnTable />
            </div>

            <ViewPurchaseReturnDrawer
                id={activeId}
                isOpen={activeDrawer === "view-return"}
                onClose={closeView}
            />

            <EditPurchaseReturnDrawer
                id={activeId}
                isOpen={activeDrawer === "edit-return"}
                onClose={closeView}
            />
        </div>
    );
}