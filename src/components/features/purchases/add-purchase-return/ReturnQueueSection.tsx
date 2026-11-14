"use client";
import * as React from "react";
import { useAddPurchaseReturnManager } from "@/hooks/purchases_hooks/useAddPurchaseReturnManager";
import { PurchaseUnitSearchBar } from "../shared/PurchaseUnitSearchBar";
import { PurchaseLineItemsTable } from "../shared/PurchaseLineItemsTable";

type Manager = ReturnType<typeof useAddPurchaseReturnManager>;

export function ReturnQueueSection({ manager }: { manager: Manager }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[13px] text-gray-600">Search Product to Return</label>

            <PurchaseUnitSearchBar
                query={manager.search.query}
                onQueryChange={manager.search.setQuery}
                results={manager.search.results}
                onScan={manager.search.scan}
                onPick={manager.search.pick}
                placeholder={manager.supplier ? `Scan or search units bought from ${manager.supplier}` : "Scan or search a Serial/IMEI, product name or SKU"}
                emptyText={manager.supplier ? `No in-stock unit from ${manager.supplier} matches. Press Enter to check a serial.` : "No in-stock (Received / Transferred) unit matches. Press Enter to check a serial."}
            />

            <PurchaseLineItemsTable
                items={manager.items}
                onUnitPriceChange={manager.setUnitPrice}
                onRemove={manager.removeItem}
                quantityLabel="Return Qty"
                totalLabel="Total Refund"
                emptyText="No products added for return"
            />
        </div>
    );
}