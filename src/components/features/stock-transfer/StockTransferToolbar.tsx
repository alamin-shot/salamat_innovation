"use client";
import * as React from "react";
import { Search, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommandParams } from "@/hooks/useCommandParams";

export function StockTransferToolbar() {
    const { openView } = useCommandParams();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="bg-white hidden sm:flex text-gray-600 border-gray-200">
                    <Columns className="h-4 w-4 mr-2" /> Columns
                </Button>
                {/* Triggers Create Drawer via Command Params */}
                <Button variant="success" size="sm" onClick={() => openView("drawer", "create-stock-transfer",)} className="w-full sm:w-auto">
                    New Transfer
                </Button>
            </div>
        </div>
    );
}