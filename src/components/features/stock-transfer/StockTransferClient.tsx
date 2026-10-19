"use client";
import * as React from "react";
import { StockTransferToolbar } from "./StockTransferToolbar";
import { StockTransferTable } from "./StockTransferTable";
import { Pagination } from "@/components/ui/Pagination";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { ViewStockTransferDrawer } from "./view-drawer/ViewStockTransferDrawer";
import { CreateStockTransferDrawer } from "./create-drawer/CreateStockTransferDrawer";

const dummyTransfers = [
    { id: "353", ref: "ST-000353", fromShop: "TEKZO JFP 4A-018A", toShop: "A-Block", date: "2026-10-08", createdAt: "08-Oct-2026 07:34 PM", items: 2, status: "Approved" },
    { id: "352", ref: "ST-000352", fromShop: "TEKZO Online Shop", toShop: "A-Block", date: "2026-10-08", createdAt: "08-Oct-2026 06:52 PM", items: 1, status: "Approved" },
    { id: "351", ref: "ST-000351", fromShop: "Salamat Innovation", toShop: "A-Block", date: "2026-10-06", createdAt: "06-Oct-2026 04:33 PM", items: 1, status: "Approved" },
    { id: "349", ref: "ST-000349", fromShop: "A-Block", toShop: "TEKZO Online Shop", date: "2026-10-01", createdAt: "01-Oct-2026 02:42 PM", items: 1, status: "Cancelled" },
    { id: "348", ref: "ST-000348", fromShop: "A-Block", toShop: "TEKZO Online Shop", date: "2026-10-01", createdAt: "01-Oct-2026 02:38 PM", items: 1, status: "Cancelled" },
];

export function StockTransferClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Stock Transfer</h1>
            </div>

            <div className="w-full pb-12">
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <StockTransferToolbar />
                    </div>
                    <StockTransferTable transfers={dummyTransfers} />
                    <Pagination />
                </div>
            </div>

            {/* Drawers unified with Sales/Returns pattern */}
            <ViewStockTransferDrawer
                id={activeId}
                isOpen={activeDrawer === "view-stock-transfer"}
                onClose={closeView}
            />

            <CreateStockTransferDrawer
                isOpen={activeDrawer === "create-stock-transfer"}
                onClose={closeView}
            />
        </div>
    );
}