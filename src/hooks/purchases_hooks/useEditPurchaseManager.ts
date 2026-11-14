import { useMemo, useState } from "react";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { Purchase, PurchaseActionResult, PurchaseFormError, PurchaseLocation } from "@/types/purchases";
import { unitToLineItem } from "@/utils/purchaseUnits";
import { usePartyResolver } from "@/hooks/people_hooks/usePartyResolver";
import { usePurchaseLinesDraft } from "./usePurchaseLinesDraft";
import { usePurchaseUnitSearch } from "./usePurchaseUnitSearch";
import { useReceivePurchasedUnits } from "./useReceivePurchasedUnits";

/**
 * Edit Purchase, legacy layout: Supplier + Date + Location on top, Product Search (scan or type),
 * then one row per Serial/IMEI (quantity fixed at 1, editable Unit Price, Trash to remove).
 */
export function useEditPurchaseManager(purchase: Purchase) {
    const updatePurchase = useGlobalPurchasesStore((state) => state.updatePurchase);
    const receiveUnits = useReceivePurchasedUnits();
    const resolveSupplier = usePartyResolver("supplier");

    const [supplier, setSupplier] = useState(purchase.supplier);
    const [date, setDate] = useState(purchase.date);
    const [location, setLocation] = useState<PurchaseLocation | null>(purchase.location);
    const lines = usePurchaseLinesDraft(purchase.items, purchase.costing);

    const search = usePurchaseUnitSearch({
        mode: "purchase",
        items: lines.items,
        supplier: null,
        excludeId: purchase.id,
        onAdd: (option) => lines.appendItem(unitToLineItem(option)),
    });

    /** Units already received with this invoice; only newly scanned ones are received on save. */
    const savedBarcodeIds = useMemo(
        () => new Set(purchase.items.map((item) => item.barcodeId).filter((id): id is string => id !== null)),
        [purchase.items]
    );

    const validate = (): PurchaseFormError | null => {
        if (!supplier.trim()) return "supplier_required";
        if (!location) return "location_required";
        if (!date) return "date_required";
        if (lines.items.length === 0) return "items_required";
        return null;
    };

    const save = (): PurchaseActionResult => {
        const error = validate();
        if (error || !location) {
            return { ok: false, error: error ?? "location_required" };
        }
        const result = updatePurchase(purchase.id, { supplierId: resolveSupplier({ name: supplier, businessName: supplier }), supplier, date, location, items: lines.items, costing: lines.costing });
        if (result.ok) {
            receiveUnits(
                lines.items.filter((item) => item.barcodeId && !savedBarcodeIds.has(item.barcodeId)),
                { supplier: supplier.trim(), location, invoiceNumber: purchase.invoiceNumber }
            );
        }
        return result;
    };

    return {
        purchase,
        supplier, setSupplier,
        date, setDate,
        location, setLocation,
        ...lines,
        search,
        save,
    };
}
