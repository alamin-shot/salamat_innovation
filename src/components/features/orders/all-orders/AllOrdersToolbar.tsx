"use client";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Search, Filter, LayoutIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AllOrdersToolbar({ manager }: { manager: OrderManagerType }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID, Customer, or Phone..."
                    value={manager.table.searchQuery}
                    onChange={(e) => manager.table.setSearchQuery(e.target.value)}
                    className="erp-input pl-9 w-full"
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button variant="outline" className="h-9 px-3 gap-2 text-gray-600">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="outline" className="h-9 px-3 gap-2 text-gray-600">
                    <LayoutIcon className="h-4 w-4" />
                    Columns
                </Button>
            </div>
        </div>
    );
}