"use client";
import * as React from "react";
import { BarcodeHistoryTable } from "./BarcodeHistoryTable";
import { useCommandParams } from "@/hooks/useCommandParams";
import { EditHistoryDrawer } from "./EditHistoryDrawer";
import { ViewHistoryDrawer } from "./ViewHistoryDrawer";

export function BarcodeHistoryClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    // Retain IDs in local state so the drawer has data while animating closed
    const [retainedEditId, setRetainedEditId] = React.useState<string | null>(null);
    const [retainedViewId, setRetainedViewId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activeDrawer === "edit-history" && activeId) setRetainedEditId(activeId);
        if (activeDrawer === "view-history" && activeId) setRetainedViewId(activeId);
    }, [activeDrawer, activeId]);

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Barcode History</h1>
                <p className="text-xs sm:text-sm text-brand-subtext">Audit log of all inbound and outbound transactions</p>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <BarcodeHistoryTable />
            </div>

            <EditHistoryDrawer
                id={retainedEditId}
                isOpen={activeDrawer === "edit-history"}
                onClose={closeView}
            />

            <ViewHistoryDrawer
                id={retainedViewId}
                isOpen={activeDrawer === "view-history"}
                onClose={closeView}
            />
        </div>
    );
}