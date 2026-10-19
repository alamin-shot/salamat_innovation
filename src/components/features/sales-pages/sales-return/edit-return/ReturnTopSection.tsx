"use client";
import * as React from "react";
import { useSaleReturnManager } from "@/hooks/sales_hooks/useSaleReturnManager";

type Manager = ReturnType<typeof useSaleReturnManager>;

export function ReturnTopSection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500">Customer</label>
                <div className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] text-gray-700 uppercase font-medium">
                    {manager.customer}
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
            </div>
        </div>
    );
}