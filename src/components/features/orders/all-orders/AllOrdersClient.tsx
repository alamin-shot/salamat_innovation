"use client";
import { useOrderManager } from "@/hooks/order_hooks/useOrderManager";
import { AllOrdersToolbar } from "./AllOrdersToolbar";
import { AllOrdersTable } from "./AllOrdersTable";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Trash2 } from "lucide-react";

import { InvoiceDrawer } from "./drawers/InvoiceDrawer";
import { ReceivePaymentDrawer } from "./drawers/ReceivePaymentDrawer";
import { UpdateItemDrawer } from "./drawers/UpdateItemDrawer";
import { FraudCheckDrawer } from "./drawers/FraudCheckDrawer";

export function AllOrdersClient() {
    const manager = useOrderManager();

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl font-bold text-gray-900">All Orders</h1>

            <div className="flex-1 erp-card flex flex-col p-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <AllOrdersToolbar manager={manager} />
                </div>

                <AllOrdersTable manager={manager} />
            </div>

            {/* Bulk Actions */}
            <BulkActionBar
                selectedCount={manager.table.selectedIds.length}
                onClearSelection={manager.table.clearSelection}
            >
                <button
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Selected
                </button>
            </BulkActionBar>

            {/* Drawers (To be implemented in Phase 3) */}
            <InvoiceDrawer manager={manager} />
            <ReceivePaymentDrawer manager={manager} />
            <UpdateItemDrawer manager={manager} />
            <FraudCheckDrawer manager={manager} />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={manager.confirmModal.isOpen}
                title={manager.confirmModal.title}
                message={manager.confirmModal.message}
                onConfirm={manager.confirmModal.onConfirm}
                onCancel={manager.closeConfirm}
            />
        </div>
    );
}