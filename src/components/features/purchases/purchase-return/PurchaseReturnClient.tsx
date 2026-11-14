"use client";
import * as React from "react";
import { PurchaseReturnTable } from "./PurchaseReturnTable";
import { ViewPurchaseReturnDrawer } from "./ViewPurchaseReturnDrawer";
import { EditPurchaseReturnDrawer } from "./EditPurchaseReturnDrawer";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { usePurchaseReturnsManager } from "@/hooks/purchases_hooks/usePurchaseReturnsManager";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function PurchaseReturnClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();
    const manager = usePurchaseReturnsManager();

    const isViewOpen = activeDrawer === "view-return";
    const isEditOpen = activeDrawer === "edit-return";
    // Keep the record in the drawer while it slides out.
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);
    const editId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    return (
        <>
            <SectionPageShell
                header={
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Purchase Return</h1>
                    </div>
                }
            >
                <PurchaseReturnTable manager={manager} />
            </SectionPageShell>

            <ViewPurchaseReturnDrawer id={viewId} isOpen={isViewOpen} onClose={closeView} />
            <EditPurchaseReturnDrawer id={editId} isOpen={isEditOpen} onClose={closeView} />
        </>
    );
}
