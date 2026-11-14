import { useCallback, useMemo, useState } from "react";
import { PurchaseCosting, PurchaseLineItem } from "@/types/purchases";
import { computePurchaseTotals } from "@/utils/purchaseMath";

/**
 * Unsaved line items + costing of one invoice form (Add / Edit Purchase, Add / Edit Purchase Return).
 * Mount edit forms with `key={record.id}` so each record starts from its own saved values.
 * Handlers are stable, so memoised rows re-render only when their own item changes.
 */
export function usePurchaseLinesDraft(initialItems: PurchaseLineItem[], initialCosting: PurchaseCosting) {
    const [items, setItems] = useState<PurchaseLineItem[]>(initialItems);
    const [costing, setCosting] = useState<PurchaseCosting>(initialCosting);

    // Subtotal - Discount + Tax (manual amount) + Shipping = Total.
    const totals = useMemo(() => computePurchaseTotals(items, costing), [items, costing]);

    const setUnitPrice = useCallback((id: string, unitPrice: number) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unitPrice } : item)));
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const appendItem = useCallback((item: PurchaseLineItem) => {
        setItems((prev) => [...prev, item]);
    }, []);

    const updateCosting = useCallback((changes: Partial<PurchaseCosting>) => {
        setCosting((prev) => ({ ...prev, ...changes }));
    }, []);

    return { items, costing, totals, setUnitPrice, removeItem, appendItem, updateCosting };
}
