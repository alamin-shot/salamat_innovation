import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    Purchase,
    PurchaseCosting,
    PurchaseFormError,
    PurchaseLineItem,
    PurchaseReturn,
    PurchasesState,
} from "@/types/purchases";
import { INITIAL_PURCHASES, INITIAL_PURCHASE_RETURNS } from "@/mocks/purchases.mock";
import { PURCHASES_AUDIT_ACTOR, NEW_SUPPLIER_BADGE } from "@/constants/purchases";
import {
    canEditReturn,
    computePurchaseTotals,
    findDuplicateSerial,
    returnDueAfterEdit,
    serialKey,
    supplierInitials,
} from "@/utils/purchaseMath";
import { nextInvoiceNumber, serialOwners } from "@/utils/purchaseUnits";
import { findPersonForParty } from "@/utils/peopleRules";
import { INITIAL_PEOPLE } from "@/mocks/people.mock";

// LAYER 2: Optimistic cache for the Purchases module.
// Records keep line items + costing inputs only; every total is recomputed by utils/purchaseMath.
// Each action is a plain payload mutation, ready to be swapped for a NestJS call.

const newId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

/** Every row is one unit: quantity is forced to 1 on every write. */
const normaliseItems = (items: PurchaseLineItem[]): PurchaseLineItem[] =>
    items.map((item) => ({ ...item, serial: item.serial.trim(), quantity: 1 as const }));

/** Tax, shipping and discount are never stored negative. */
const normaliseCosting = (costing: PurchaseCosting): PurchaseCosting => ({
    discountType: costing.discountType,
    discountAmount: Math.max(0, costing.discountAmount),
    taxAmount: Math.max(0, costing.taxAmount),
    shippingCost: Math.max(0, costing.shippingCost),
});

/**
 * Serial rules: unique inside the list, and not already held by another record of the same kind
 * (a unit is purchased once and returned once).
 */
function serialError(items: PurchaseLineItem[], others: { id: string; invoiceNumber: string; items: PurchaseLineItem[] }[], excludeId: string | null, takenError: PurchaseFormError): PurchaseFormError | null {
    if (items.some((item) => !item.serial.trim())) {
        return "serial_required";
    }
    if (findDuplicateSerial(items)) {
        return "serial_duplicate";
    }
    const owners = serialOwners(others, excludeId);
    if (items.some((item) => owners.has(serialKey(item.serial)))) {
        return takenError;
    }
    return null;
}

const priceError = (items: PurchaseLineItem[]): PurchaseFormError | null =>
    items.some((item) => !Number.isFinite(item.unitPrice) || item.unitPrice < 0) ? "price_invalid" : null;

export const useGlobalPurchasesStore = create<PurchasesState>()(
    persist(
        (set, get) => ({
            purchases: INITIAL_PURCHASES as Purchase[],
            purchaseReturns: INITIAL_PURCHASE_RETURNS as PurchaseReturn[],

            // ── Purchases ───────────────────────────────────────────────────
            addPurchase: (input) => {
                const items = normaliseItems(input.items);
                if (items.length === 0) {
                    return { ok: false, error: "items_required" };
                }
                const error = priceError(items) ?? serialError(items, get().purchases, null, "serial_on_purchase");
                if (error) {
                    return { ok: false, error };
                }
                const costing = normaliseCosting(input.costing);
                const purchase: Purchase = {
                    id: newId("pur"),
                    invoiceNumber: nextInvoiceNumber("PP", get().purchases.map((record) => record.invoiceNumber)),
                    supplierId: input.supplierId,
                    supplier: input.supplier.trim(),
                    supplierInitials: supplierInitials(input.supplier),
                    badgeColor: NEW_SUPPLIER_BADGE,
                    location: input.location,
                    date: input.date,
                    status: "Due",
                    items,
                    costing,
                    createdBy: PURCHASES_AUDIT_ACTOR,
                };
                set((state) => ({ purchases: [purchase, ...state.purchases] }));
                return { ok: true, id: purchase.id, invoiceNumber: purchase.invoiceNumber };
            },

            updatePurchase: (id, input) => {
                const target = get().purchases.find((record) => record.id === id);
                if (!target) {
                    return { ok: false, error: "items_required" };
                }
                const items = normaliseItems(input.items);
                if (items.length === 0) {
                    return { ok: false, error: "items_required" };
                }
                const error = priceError(items) ?? serialError(items, get().purchases, id, "serial_on_purchase");
                if (error) {
                    return { ok: false, error };
                }
                const supplier = input.supplier.trim();
                set((state) => ({
                    purchases: state.purchases.map((record) => {
                        if (record.id !== id) {
                            return record;
                        }
                        const costing = normaliseCosting(input.costing);
                        return {
                            ...record,
                            supplierId: input.supplierId,
                            supplier,
                            supplierInitials: record.supplier === supplier ? record.supplierInitials : supplierInitials(supplier),
                            date: input.date,
                            location: input.location,
                            items,
                            costing,
                        };
                    }),
                }));
                return { ok: true };
            },

            deletePurchases: (ids) => set((state) => ({
                purchases: state.purchases.filter((purchase) => !ids.includes(purchase.id)),
            })),

            // ── Purchase returns ────────────────────────────────────────────
            addPurchaseReturn: (input) => {
                const items = normaliseItems(input.items);
                if (items.length === 0) {
                    return { ok: false, error: "items_required" };
                }
                const error = priceError(items) ?? serialError(items, get().purchaseReturns, null, "serial_on_return");
                if (error) {
                    return { ok: false, error };
                }
                const costing = normaliseCosting(input.costing);
                const record: PurchaseReturn = {
                    id: newId("ret"),
                    invoiceNumber: nextInvoiceNumber("PR", get().purchaseReturns.map((item) => item.invoiceNumber)),
                    supplierId: input.supplierId,
                    supplier: input.supplier.trim(),
                    company: input.company.trim(),
                    supplierInitials: supplierInitials(input.supplier),
                    badgeColor: NEW_SUPPLIER_BADGE,
                    date: input.date,
                    items,
                    costing,
                    // A new return is fully due.
                    dueAmount: computePurchaseTotals(items, costing).total,
                    createdBy: PURCHASES_AUDIT_ACTOR,
                };
                set((state) => ({ purchaseReturns: [record, ...state.purchaseReturns] }));
                return { ok: true, id: record.id, invoiceNumber: record.invoiceNumber };
            },

            updatePurchaseReturn: (id, input) => {
                const target = get().purchaseReturns.find((record) => record.id === id);
                // Settled returns are locked here too, not only in the UI.
                if (!target || !canEditReturn(target.dueAmount)) {
                    return { ok: false, error: "return_locked" };
                }
                const items = normaliseItems(input.items);
                if (items.length === 0) {
                    return { ok: false, error: "items_required" };
                }
                const error = priceError(items) ?? serialError(items, get().purchaseReturns, id, "serial_on_return");
                if (error) {
                    return { ok: false, error };
                }
                const costing = normaliseCosting(input.costing);
                const oldTotal = computePurchaseTotals(target.items, target.costing).total;
                const newTotal = computePurchaseTotals(items, costing).total;
                const dueAmount = returnDueAfterEdit(target.dueAmount, oldTotal, newTotal);
                set((state) => ({
                    purchaseReturns: state.purchaseReturns.map((record) => (
                        record.id === id ? { ...record, date: input.date, items, costing, dueAmount } : record
                    )),
                }));
                return { ok: true };
            },

            deletePurchaseReturns: (ids) => set((state) => ({
                purchaseReturns: state.purchaseReturns.filter((record) => !ids.includes(record.id)),
            })),
        }),
        {
            // v2 key: line items gained barcodeId and a fixed quantity of 1.
            name: "erp-purchases-storage-v2",
            // version 1: supplierId. version 2: paid / due moved to Payment records (stored copies dropped).
            version: 2,
            migrate: (persistedState) => {
                const state = persistedState as PurchasesState;
                const supplierIdFor = (name: string) => findPersonForParty(INITIAL_PEOPLE, { name, businessName: name }, "supplier")?.id ?? null;
                return {
                    ...state,
                    purchases: (state.purchases ?? INITIAL_PURCHASES).map((stored) => {
                        const record: Purchase & { paidAmount?: unknown; dueAmount?: unknown } = { ...stored };
                        delete record.paidAmount;
                        delete record.dueAmount;
                        return { ...record, supplierId: record.supplierId ?? supplierIdFor(record.supplier) };
                    }),
                    purchaseReturns: (state.purchaseReturns ?? INITIAL_PURCHASE_RETURNS).map((record) => ({
                        ...record,
                        supplierId: record.supplierId ?? supplierIdFor(record.company || record.supplier) ?? supplierIdFor(record.supplier),
                    })),
                };
            },
        }
    )
);
