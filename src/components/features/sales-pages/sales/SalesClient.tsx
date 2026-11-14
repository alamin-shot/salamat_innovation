"use client";
import * as React from "react";
import { useSalesListManager } from "@/hooks/sales_hooks/useSalesListManager";
import { SaleListTable } from "./SaleListTable";
import { UpdateSellerModal } from "./UpdateSellerModal";
import { ViewSaleDrawer } from "./ViewSaleDrawer";
import { EditSaleDrawer } from "./EditSaleDrawer";

/** Sale List, backed by useGlobalSalesStore (totals and status derived from each sale's ledger). */
export function SalesClient() {
    const manager = useSalesListManager();

    return (
        <div className="flex flex-col w-full p-4">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sale List</h1>
            </div>

            <div className="w-full pb-12">
                <SaleListTable manager={manager} />
            </div>

            <UpdateSellerModal
                saleId={manager.sellerModalSaleId}
                isOpen={manager.isSellerModalOpen}
                onClose={manager.closeView}
                onSave={manager.handleSellerSave}
            />
            <ViewSaleDrawer sale={manager.viewed} isOpen={manager.isViewOpen} onClose={manager.closeView} />
            <EditSaleDrawer sale={manager.editing} isOpen={manager.isEditOpen} onClose={manager.closeView} />
        </div>
    );
}
