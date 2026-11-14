"use client";
import { Search } from "lucide-react";
import { OrderStatusManagerType } from "@/hooks/order_hooks/useOrderStatusManager";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { BaseOrderTable } from "./BaseOrderTable";
import { InvoiceDrawer } from "../all-orders/drawers/InvoiceDrawer";

/** One order status inside the Orders hub. The hub's status chips replace the old page title. */
export function BaseOrderView({ manager }: { manager: OrderStatusManagerType }) {
    const { table } = manager;

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="erp-card flex flex-col p-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={table.searchQuery}
                            onChange={(e) => table.setSearchQuery(e.target.value)}
                            className="erp-input pl-9 w-full"
                        />
                    </div>
                </div>

                <BaseOrderTable manager={manager} />
            </div>

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- InvoiceDrawer is typed for the All Orders manager (pre-existing) */}
            <InvoiceDrawer manager={manager as any} />

            <ConfirmModal
                isOpen={manager.pendingDeleteId !== null}
                title="Delete order permanently?"
                message="This rejected order will be removed for good. This cannot be undone."
                onConfirm={manager.confirmDelete}
                onCancel={manager.cancelDelete}
            />
        </div>
    );
}
