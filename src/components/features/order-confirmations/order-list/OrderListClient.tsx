"use client";
import { useOrderListManager } from "@/hooks/order_confirmation_hooks/useOrderListManager";
import { OrderListTable } from "./OrderListTable";
import { ViewOrderDrawer } from "./view-drawer/ViewOrderDrawer";
import { OrderFormDrawer } from "./form-drawer/OrderFormDrawer";

export function OrderListClient() {
    const manager = useOrderListManager();

    return (
        // Spoke of the Orders hub: the hub supplies the title and the page scrolls (no height lock).
        <div className="flex flex-col w-full">
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex flex-col">
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