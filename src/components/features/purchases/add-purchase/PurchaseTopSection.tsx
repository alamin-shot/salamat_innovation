"use client";
import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { useAddPurchaseManager } from "@/hooks/useAddPurchaseManager";
import { CustomSelect } from "./CustomSelect";

type Manager = ReturnType<typeof useAddPurchaseManager>;

export function PurchaseTopSection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Side */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-600">Supplier</label>
                    <div className="flex gap-2">
                        <CustomSelect
                            value={manager.supplier}
                            onChange={manager.setSupplier}
                            options={["Rasel Raj", "Bina Ambix", "Gadget Opia", "Cell Tech BD"]}
                            placeholder="Choose a Supplier"
                        />
                        <button onClick={manager.openAddSupplierModal} className="shrink-0 rounded bg-[#108c5d] px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700 transition-colors">
                            Add Supplier
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-600">Invoice/Bill</label>
                    <div className="flex items-center gap-4 rounded border border-dashed border-gray-300 bg-gray-50/50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-white border border-gray-200 text-gray-400 shadow-sm">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col text-[12px] text-gray-500">
                            <span>Recommended size: 300 X 90 PX</span>
                            <span>Max file size: 2MB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-600">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div className="flex flex-col gap-1.5 mt-1">
                    <button
                        type="button"
                        onClick={manager.toggleManualEntry}
                        className="w-full rounded bg-gray-100 border border-gray-200 py-2 text-[13px] text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        Create Barcode
                    </button>
                </div>
            </div>
        </div>
    );
}