"use client";
import * as React from "react";
import { useSaleReturnsListManager } from "@/hooks/sales_hooks/useSaleReturnsListManager";
import { SaleReturnListTable } from "./SaleReturnListTable";
import { ViewSaleReturnDrawer } from "./ViewSaleReturnDrawer";
import { EditSaleReturnDrawer } from "./edit-return/EditSaleReturnDrawer";

/** Sales Return list, backed by useGlobalSalesStore. */
export function SaleReturnClient() {
    const manager = useSaleReturnsListManager();

    return (
        <div className="flex flex-col w-full p-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sales Return</h1>
            </div>

            <div className="w-full pb-12">
                <SaleReturnListTable manager={manager} />
            </div>

            <ViewSaleReturnDrawer record={manager.viewed} isOpen={manager.isViewOpen} onClose={manager.closeView} />
            <EditSaleReturnDrawer record={manager.editing} isOpen={manager.isEditOpen} onClose={manager.closeView} />
        </div>
    );
}
