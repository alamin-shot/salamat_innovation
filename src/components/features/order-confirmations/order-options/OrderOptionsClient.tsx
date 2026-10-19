"use client";
import { useOrderOptionsManager } from "@/hooks/order_confirmation_hooks/useOrderOptionsManager";
import { OrderOptionsTable } from "./OrderOptionsTable";
import { ViewOrderOptionDrawer } from "./view-drawer/ViewOrderOptionDrawer";
import { OrderOptionFormDrawer } from "./form-drawer/OrderOptionFormDrawer";

export function OrderOptionsClient() {
    const manager = useOrderOptionsManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Order Options</h1>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <OrderOptionsTable manager={manager} />
            </div>

            <ViewOrderOptionDrawer
                id={manager.retainedViewId}
                record={manager.activeViewRecord}
                isOpen={manager.activeDrawer === "view-order-option"}
                onClose={manager.closeView}
            />

            <OrderOptionFormDrawer
                mode="create"
                isOpen={manager.activeDrawer === "create-order-option"}
                onClose={manager.closeView}
            />

            <OrderOptionFormDrawer
                mode="edit"
                id={manager.retainedEditId}
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "edit-order-option"}
                onClose={manager.closeView}
            />
        </div>
    );
}