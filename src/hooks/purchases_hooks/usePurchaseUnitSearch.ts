import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGlobalBarcodesStore } from "@/store/useGlobalBarcodesStore";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseUnitOption, PurchaseUnitSearchOptions, UnitEligibilityContext } from "@/types/purchases";
import { PURCHASE_SEARCH_LIMIT } from "@/constants/purchases";
import { serialKey } from "@/utils/purchaseMath";
import { lookupUnitBySerial, serialOwners, toUnitOption, unitRefusalReason } from "@/utils/purchaseUnits";

/**
 * Product Search over Barcodes-module units, for scanners and manual lookup.
 * Purchases: un-received units (Generated / Printed). Returns: in-stock units (Received / Transferred)
 * bought from the return's supplier. A refused scan always explains why.
 */
export function usePurchaseUnitSearch({ mode, items, supplier, excludeId, onAdd }: PurchaseUnitSearchOptions) {
    const barcodes = useGlobalBarcodesStore((state) => state.barcodes);
    const purchases = useGlobalPurchasesStore((state) => state.purchases);
    const purchaseReturns = useGlobalPurchasesStore((state) => state.purchaseReturns);
    const [query, setQuery] = useState("");

    const context = useMemo<UnitEligibilityContext>(() => ({
        mode,
        supplier: mode === "return" ? supplier : null,
        inList: new Set(items.map((item) => serialKey(item.serial))),
        taken: serialOwners(mode === "purchase" ? purchases : purchaseReturns, excludeId),
    }), [mode, supplier, items, purchases, purchaseReturns, excludeId]);

    const results = useMemo<PurchaseUnitOption[]>(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return [];
        }
        return barcodes
            .filter((barcode) => [barcode.serialNumber, barcode.productName, barcode.variant, barcode.sku].some((text) => text.toLowerCase().includes(q)))
            .filter((barcode) => unitRefusalReason(barcode, context) === null)
            .slice(0, PURCHASE_SEARCH_LIMIT)
            .map((barcode) => toUnitOption(barcode, mode));
    }, [barcodes, query, context, mode]);

    const add = (option: PurchaseUnitOption) => {
        onAdd(option);
        setQuery("");
    };

    /** Enter in the search box: a scanner sends the serial followed by Enter. */
    const scan = () => {
        const serial = query.trim();
        if (!serial) {
            return;
        }
        const result = lookupUnitBySerial(barcodes, serial, context);
        if (result.ok) {
            add(result.option);
            return;
        }
        // Typed a product name rather than a serial: one matching unit is unambiguous.
        if (results.length === 1) {
            add(results[0]);
            return;
        }
        toast.error(result.message);
    };

    return { query, setQuery, results, scan, pick: add };
}
