"use client";
import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { useAddPurchaseReturnManager } from "@/hooks/useAddPurchaseReturnManager";
import { Button } from "@/components/ui/Button";

// Extract the type directly from our custom hook for perfect TypeScript safety
type Manager = ReturnType<typeof useAddPurchaseReturnManager>;

export function ReturnTopSection({ manager }: { manager: Manager }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Side */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-600">Supplier</label>
                    <div className="flex w-full items-center rounded border border-gray-100 bg-gray-50/50 px-3 py-2 text-[13px] text-gray-400 h-[38px]">
                        Auto-filled upon searching invoice
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
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={manager.toggleManualEntry}
                        className="w-full"
                    >
                        Create Barcode
                    </Button>
                </div>
            </div>
        </div>
    );
}