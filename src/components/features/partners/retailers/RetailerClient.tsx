"use client";
import { useRetailerManager } from "@/hooks/partner_hooks/retailer_hooks/useRetailerManager";
import { RetailerTable } from "./RetailerTable";
import { RetailerFormDrawer } from "./form-drawer/RetailerFormDrawer";

export function RetailerClient() {
    const manager = useRetailerManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Retailers List</h1>
            </div>
            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
                <RetailerTable manager={manager} />
            </div>
            <RetailerFormDrawer
                initialRecord={manager.activeEditRecord}
                isOpen={manager.activeDrawer === "retailer-form"}
                onClose={manager.closeView}
            />
        </div>
    );
}