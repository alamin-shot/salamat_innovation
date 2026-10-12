"use client";
import * as React from "react";
import { PurchasesTable } from "./PurchasesTable";
import { useCommandParams } from "@/hooks/useCommandParams";
import { ViewPurchaseDrawer } from "./ViewPurchaseDrawer";
import { EditPurchaseDrawer } from "./EditPurchaseDrawer";

export function PurchasesClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    const [retainedViewId, setRetainedViewId] = React.useState<string | null>(null);
    const [retainedEditId, setRetainedEditId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activeDrawer === "view-purchase" && activeId) setRetainedViewId(activeId);
        if (activeDrawer === "edit-purchase" && activeId) setRetainedEditId(activeId);
    }, [activeDrawer, activeId]);

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Purchase List</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <PurchasesTable />
            </div>

            <ViewPurchaseDrawer
                id={retainedViewId}
                isOpen={activeDrawer === "view-purchase"}
                onClose={closeView}
            />

            <EditPurchaseDrawer
                id={retainedEditId}
                isOpen={activeDrawer === "edit-purchase"}
                onClose={closeView}
            />
        </div>
    );
}