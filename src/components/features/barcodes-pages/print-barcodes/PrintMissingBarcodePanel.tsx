"use client";
import * as React from "react";
import { Plus, TriangleAlert, X } from "lucide-react";
import { PrintQueueManager } from "@/hooks/barcode_hooks/usePrintQueueManager";
import { BarcodeLocation } from "@/types/barcodes";
import { BARCODE_LOCATIONS } from "@/constants/barcodes";
import { BarcodeFormDropdown } from "../shared/BarcodeFormDropdown";

type MissingManager = Pick<
    PrintQueueManager,
    | "missingScan"
    | "productOptions"
    | "missingVariantOptions"
    | "missingProductId"
    | "setMissingProductId"
    | "missingVariantId"
    | "setMissingVariant"
    | "missingLocation"
    | "setMissingLocation"
    | "missingMrpText"
    | "setMissingMrpText"
    | "handleCreateMissing"
    | "dismissMissing"
>;

interface PrintMissingBarcodePanelProps {
    manager: MissingManager;
}

const LOCATION_OPTIONS = BARCODE_LOCATIONS.map((location) => ({ value: location, label: location }));

const isLocation = (value: string): value is BarcodeLocation => BARCODE_LOCATIONS.some((location) => location === value);

/** Inline POS prompt: the scanned serial is unknown, so create the barcode right here. */
export function PrintMissingBarcodePanel({ manager }: PrintMissingBarcodePanelProps) {
    const { missingScan, setMissingLocation } = manager;

    const handleLocationChange = React.useCallback((value: string) => {
        if (isLocation(value)) {
            setMissingLocation(value);
        }
    }, [setMissingLocation]);

    if (!missingScan) {
        return null;
    }

    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                    <TriangleAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-brand-text">
                            Serial <span className="font-mono">{missingScan.serialNumber}</span> is not in the system.
                        </span>
                        <span className="text-xs text-brand-subtext">Choose its product and location to create the barcode and add it to the print queue.</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={manager.dismissMissing}
                    title="Dismiss"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand-subtext hover:bg-white hover:text-brand-text transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <BarcodeFormDropdown
                    label="Product"
                    required
                    placeholder="Choose a product"
                    value={manager.missingProductId}
                    options={manager.productOptions}
                    onChange={manager.setMissingProductId}
                    emptyText="No products in the catalogue"
                />
                <BarcodeFormDropdown
                    label="Attribute"
                    required
                    placeholder={manager.missingProductId ? "Choose an attribute" : "Choose a product first"}
                    value={manager.missingVariantId}
                    options={manager.missingVariantOptions}
                    onChange={manager.setMissingVariant}
                    disabled={!manager.missingProductId}
                    emptyText="This product has no variants"
                />
                <BarcodeFormDropdown
                    label="Location"
                    required
                    placeholder="Choose a location"
                    value={manager.missingLocation}
                    options={LOCATION_OPTIONS}
                    onChange={handleLocationChange}
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext tracking-wider">MRP (৳)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={manager.missingMrpText}
                        onChange={(e) => manager.setMissingMrpText(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={manager.dismissMissing}
                    className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-white hover:text-brand-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={manager.handleCreateMissing}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Plus className="h-4 w-4" /> Create &amp; Add to Queue
                </button>
            </div>
        </div>
    );
}
