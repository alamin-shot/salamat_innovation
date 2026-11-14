import { useState } from "react";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseActionResult, PurchaseFormError, PurchaseReturn } from "@/types/purchases";
import { canEditReturn, computePurchaseTotals, returnDueAfterEdit } from "@/utils/purchaseMath";
import { unitToLineItem } from "@/utils/purchaseUnits";
import { usePurchaseLinesDraft } from "./usePurchaseLinesDraft";
import { usePurchaseUnitSearch } from "./usePurchaseUnitSearch";

/** Edit Purchase Return. Locked (read-only, save refused) once the return has no due. */
export function useEditPurchaseReturnManager(record: PurchaseReturn) {
    const updatePurchaseReturn = useGlobalPurchasesStore((state) => state.updatePurchaseReturn);

    const [date, setDate] = useState(record.date);
    const lines = usePurchaseLinesDraft(record.items, record.costing);
    const isLocked = !canEditReturn(record.dueAmount);

    // Only in-stock units bought from this return's supplier can be added.
    const search = usePurchaseUnitSearch({
        mode: "return",
        items: lines.items,
        supplier: record.supplier,
        excludeId: record.id,
        onAdd: (option) => lines.appendItem(unitToLineItem(option)),
    });

    /** Due after saving: moves by the exact change in Total, never below ৳0 (the store applies the same rule). */
    const savedTotal = computePurchaseTotals(record.items, record.costing).total;
    const nextDue = returnDueAfterEdit(record.dueAmount, savedTotal, lines.totals.total);

    const validate = (): PurchaseFormError | null => {
        if (isLocked) return "return_locked";
        if (!date) return "date_required";
        if (lines.items.length === 0) return "items_required";
        return null;
    };

    const save = (): PurchaseActionResult => {
        const error = validate();
        if (error) {
            return { ok: false, error };
        }
        return updatePurchaseReturn(record.id, { date, items: lines.items, costing: lines.costing });
    };

    return { record, isLocked, date, setDate, ...lines, search, nextDue, save };
}
