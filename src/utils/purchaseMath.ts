import { PurchaseCosting, PurchaseLineItem, PurchaseTotals } from "@/types/purchases";

// All money maths runs in whole paisa (integers), so 0.1 + 0.2 style float errors cannot occur.
// Values convert back to taka only when returned.

const toPaisa = (taka: number): number => (Number.isFinite(taka) ? Math.round(taka * 100) : 0);
const toTaka = (paisa: number): number => paisa / 100;
const nonNegative = (paisa: number): number => Math.max(0, paisa);

function subTotalPaisa(items: PurchaseLineItem[]): number {
    return items.reduce((sum, item) => sum + nonNegative(toPaisa(item.unitPrice)) * Math.max(0, Math.trunc(item.quantity)), 0);
}

function discountPaisa(subTotal: number, costing: PurchaseCosting): number {
    if (costing.discountType === "Fixed") {
        return Math.min(subTotal, nonNegative(toPaisa(costing.discountAmount)));
    }
    if (costing.discountType === "Percentage") {
        const percent = Math.min(100, Math.max(0, costing.discountAmount));
        return Math.round((subTotal * percent) / 100);
    }
    // No discount type chosen: no discount (the old code silently treated this as Fixed).
    return 0;
}

/** Unit price x quantity, in taka. */
export function lineTotal(item: PurchaseLineItem): number {
    return toTaka(subTotalPaisa([item]));
}

/** Subtotal - Discount + Tax (manual, fixed amount) + Shipping = Total. */
export function computePurchaseTotals(items: PurchaseLineItem[], costing: PurchaseCosting): PurchaseTotals {
    const subTotal = subTotalPaisa(items);
    const discount = discountPaisa(subTotal, costing);
    const tax = nonNegative(toPaisa(costing.taxAmount));
    const shipping = nonNegative(toPaisa(costing.shippingCost));
    return {
        subTotal: toTaka(subTotal),
        discount: toTaka(discount),
        tax: toTaka(tax),
        shipping: toTaka(shipping),
        total: toTaka(subTotal - discount + tax + shipping),
    };
}

/** Sums taka amounts without float drift (for table footers). */
export function sumTaka(values: number[]): number {
    return toTaka(values.reduce((sum, value) => sum + toPaisa(value), 0));
}

/** Total number of units on an invoice. */
export function countItems(items: PurchaseLineItem[]): number {
    return items.reduce((sum, item) => sum + Math.max(0, Math.trunc(item.quantity)), 0);
}

/** A return is editable only while it still has a due. */
export function canEditReturn(dueAmount: number): boolean {
    return toPaisa(dueAmount) > 0;
}

/** "Cell Tech BD" -> "CB": first letters of the first and last words. */
export function supplierInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
        return "?";
    }
    const first = words[0].charAt(0);
    const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
    return `${first}${last}`.toUpperCase();
}

/** Parses a typed amount; blank or invalid becomes 0. */
export function parseAmountInput(value: string): number {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : 0;
}

/** "৳ 1,13,840.00" — en-IN grouping, as the invoices show. */
export function formatPurchaseTaka(amount: number): string {
    return `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Due after editing a return: moves by the exact change in Total, never below 0.
 * Worked in paisa, e.g. due 100, total 1000 -> 700 gives max(0, 100 - 300) = 0.
 */
export function returnDueAfterEdit(oldDue: number, oldTotal: number, newTotal: number): number {
    return toTaka(Math.max(0, toPaisa(oldDue) + toPaisa(newTotal) - toPaisa(oldTotal)));
}

/** First Serial/IMEI that appears more than once in the list (trimmed, case-insensitive), or null. */
export function findDuplicateSerial(items: PurchaseLineItem[]): string | null {
    const seen = new Set<string>();
    for (const item of items) {
        const key = serialKey(item.serial);
        if (seen.has(key)) {
            return item.serial.trim();
        }
        seen.add(key);
    }
    return null;
}

/** Comparison key for serials: scanners and typing may differ in case and surrounding spaces. */
export function serialKey(serial: string): string {
    return serial.trim().toUpperCase();
}
