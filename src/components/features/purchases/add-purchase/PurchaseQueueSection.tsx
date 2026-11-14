"use client";
import * as React from "react";
import { useAddPurchaseManager } from "@/hooks/purchases_hooks/useAddPurchaseManager";
import { CustomSelect } from "./CustomSelect";
import { Button } from "@/components/ui/Button";
import { PurchaseUnitSearchBar } from "../shared/PurchaseUnitSearchBar";
import { PurchaseLineItemsTable } from "../shared/PurchaseLineItemsTable";

type Manager = ReturnType<typeof useAddPurchaseManager>;

export function PurchaseQueueSection({ manager }: { manager: Manager }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[13px] text-gray-600">Search by Barcode</label>

            {/* Toggled Manual Entry Row */}
            {manager.isManualEntryOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-1 mt-2 p-4 border border-gray-100 bg-gray-50 rounded">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Product <span className="text-red-500">*</span></label>
                        <CustomSelect value={manager.manualProduct} onChange={manager.setManualProduct} options={["Galaxy S25 Ultra", "iPhone 15 Pro", "Nothing Phone 4a"]} placeholder="Choose a product" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Variant <span className="text-red-500">*</span></label>
                        <CustomSelect value={manager.manualVariant} onChange={manager.setManualVariant} options={["Titanium Black", "White", "12GB/512GB"]} placeholder="Choose a Variant" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Serial/IMEI no.</label>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Serial/IMEI no." value={manager.manualSerial} onChange={(e) => manager.setManualSerial(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none" />
                            <Button type="button" variant="warning" onClick={manager.handleSuggestSerial} className="shrink-0">Suggest</Button>
                            <Button type="button" variant="success" onClick={manager.handleApplyManualItem} className="shrink-0">Apply</Button>
                        </div>
                    </div>
                </div>
            )}

            <PurchaseUnitSearchBar
                query={manager.search.query}
                onQueryChange={manager.search.setQuery}
                results={manager.search.results}
                onScan={manager.search.scan}
                onPick={manager.search.pick}
                placeholder="Scan or type a Serial/IMEI, product name or SKU"
                emptyText="No un-received barcode (Generated / Printed) matches. Press Enter to check a serial."
            />

            {/* Queue Table: one row per Serial/IMEI, quantity fixed at 1 */}
            <PurchaseLineItemsTable
                items={manager.items}
                onUnitPriceChange={manager.setUnitPrice}
                onRemove={manager.removeItem}
            />
        </div>
    );
}