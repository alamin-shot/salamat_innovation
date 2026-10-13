"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import * as React from "react";

export function TransferTopSection({ manager }: { manager: any }) {
    const shopOptions = ["TEKZO JFP 4A-018A", "Salamat Innovation", "TEKZO Online Shop", "A-Block"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">From Shop <span className="text-red-500">*</span></label>
                <CustomSelect value={manager.fromShop} onChange={manager.setFromShop} options={shopOptions} placeholder="Select From Shop" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">To Shop <span className="text-red-500">*</span></label>
                <CustomSelect value={manager.toShop} onChange={manager.setToShop} options={shopOptions} placeholder="Select To Shop" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Transfer Date <span className="text-red-500">*</span></label>
                <input type="date" value={manager.transferDate} onChange={(e) => manager.setTransferDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-500 font-medium">Note</label>
                <textarea value={manager.note} onChange={(e) => manager.setNote(e.target.value)} rows={1} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 resize-none min-h-[38px]" />
            </div>
        </div>
    );
}