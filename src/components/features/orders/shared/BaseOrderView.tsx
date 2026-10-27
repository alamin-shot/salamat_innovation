"use client";
import { OrderStatusManagerType } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderTable } from "./BaseOrderTable";
import { Search } from "lucide-react";
import { InvoiceDrawer } from "../all-orders/drawers/InvoiceDrawer";

export function BaseOrderView({ manager }: { manager: OrderStatusManagerType }) {
    const { config, table } = manager;

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>

            <div className="flex-1 erp-card flex flex-col p-0 overflow-hidden">
                {/* Toolbar */}
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

                {/* Dynamic Table */}
                <BaseOrderTable manager={manager} />
            </div>

            {/* Reused Bulletproof Print Drawer */}
            <InvoiceDrawer manager={manager as any} />
        </div>
    );
}