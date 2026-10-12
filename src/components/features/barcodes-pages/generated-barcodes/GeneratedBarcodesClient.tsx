"use client";
import * as React from "react";
import { GeneratedBarcodesTable } from "./GeneratedBarcodesTable";
import { useCommandParams } from "@/hooks/useCommandParams";
import { EditBarcodeDrawer } from "./EditBarcodeDrawer";
import { ViewBarcodeDrawer } from "./ViewBarcodeDrawer";

export function GeneratedBarcodesClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    // Retain IDs in local state so the drawer has data while animating closed
    const [retainedEditId, setRetainedEditId] = React.useState<string | null>(null);
    const [retainedViewId, setRetainedViewId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activeDrawer === "edit-barcode" && activeId) setRetainedEditId(activeId);
        if (activeDrawer === "view-barcode" && activeId) setRetainedViewId(activeId);
    }, [activeDrawer, activeId]);

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Generated Barcodes</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <GeneratedBarcodesTable />
            </div>

            {/* Always rendered, animation triggered by isOpen prop */}
            <EditBarcodeDrawer
                id={retainedEditId}
                isOpen={activeDrawer === "edit-barcode"}
                onClose={closeView}
            />

            <ViewBarcodeDrawer
                id={retainedViewId}
                isOpen={activeDrawer === "view-barcode"}
                onClose={closeView}
            />
        </div>
    );
}