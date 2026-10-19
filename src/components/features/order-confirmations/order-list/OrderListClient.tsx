"use client";
import { useOrderListManager } from "@/hooks/order_confirmation_hooks/useOrderListManager";
import { OrderListTable } from "./OrderListTable";
import { ViewOrderDrawer } from "./view-drawer/ViewOrderDrawer";
import { OrderFormDrawer } from "./form-drawer/OrderFormDrawer";

export function OrderListClient() {
    const manager = useOrderListManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Order Confirmations</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <OrderListTable manager={manager} />
            </div>

            <ViewOrderDrawer
                id={manager.retainedViewId}
                record={manager.activeViewRecord}
                isOpen={manager.activeDrawer === "view-order"}
                onClose={manager.closeView}
            />

            <OrderFormDrawer
                mode="create"
                isOpen={manager.activeDrawer === "create-order"}
                onClose={manager.closeView}
            />

            <OrderFormDrawer
                mode="edit"
                id={manager.retainedEditId}
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-order"}
                onClose={manager.closeView}
            />
        </div>
    );
}