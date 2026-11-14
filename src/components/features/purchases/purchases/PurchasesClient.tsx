"use client";
import * as React from "react";
import { PurchasesTable } from "./PurchasesTable";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { SectionPageShell } from "@/components/layout/SectionPageShell";
import { ViewPurchaseDrawer } from "./ViewPurchaseDrawer";
import { EditPurchaseDrawer } from "./EditPurchaseDrawer";

export function PurchasesClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    const isViewOpen = activeDrawer === "view-purchase";
    const isEditOpen = activeDrawer === "edit-purchase";
    // Keep the record in the drawer while it slides out.
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);
    const editId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    return (
        <>
            <SectionPageShell
                cardClassName="flex flex-col"
                header={
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Purchase List</h1>
                    </div>
                }
            >
                <PurchasesTable />
            </SectionPageShell>

            <ViewPurchaseDrawer id={viewId} isOpen={isViewOpen} onClose={closeView} />
            <EditPurchaseDrawer id={editId} isOpen={isEditOpen} onClose={closeView} />
        </>
    );
}
