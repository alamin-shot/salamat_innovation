// LAYER 1: Purchases module type definitions.
import type { BarcodeLocation, BarcodeStatus } from "@/types/barcodes";

// ── Shared enums ────────────────────────────────────────────────────────────

/** Same approved locations as the Barcodes module (BARCODE_LOCATIONS). */
export type PurchaseLocation = BarcodeLocation;

export type PurchaseDiscountType = "Fixed" | "Percentage";

/**
 * Recorded status, shown as a read-only badge.
 * Never derived from payment maths and never edited through a dropdown.
 */
export type PurchaseStatus = "Paid" | "Received" | "Pending" | "Due" | "Cancelled" | "Returned";

export type PurchaseStatusTone = "emerald" | "amber" | "rose";

// ── Line items & costing ────────────────────────────────────────────────────

/** One invoice row. Each row is one physical unit (one Serial/IMEI), so quantity is always 1. */
export interface PurchaseLineItem {
    id: string;
    /** Barcodes-module unit this row came from; null for rows typed in manually. */
    barcodeId: string | null;
    productName: string;
    variant: string;
    sku: string;
    serial: string;
    /** Taka. Editable; 0 is valid (free samples / gifts). */
    unitPrice: number;
    quantity: 1;
}

/** Costing inputs. Totals are always recomputed from these and the line items, never stored. */
export interface PurchaseCosting {
    /** null = no discount applied. */
    discountType: PurchaseDiscountType | null;
    /** Taka when Fixed, percent when Percentage. */
    discountAmount: number;
    /** Fixed government tax in taka, entered manually (not a percentage). */
    taxAmount: number;
    shippingCost: number;
}

/** Subtotal - Discount + Tax + Shipping = Total, all in taka (computed in whole paisa). */
export interface PurchaseTotals {
    subTotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
}

// ── Purchases ───────────────────────────────────────────────────────────────

export interface Purchase {
    id: string;
    invoiceNumber: string;
    /** People profile of the supplier (null only when a legacy name could not be matched). */
    supplierId: string | null;
    supplier: string;
    supplierInitials: string;
    /** Tailwind background class of the supplier avatar. */
    badgeColor: string;
    location: PurchaseLocation;
    /** YYYY-MM-DD */
    date: string;
    status: PurchaseStatus;
    items: PurchaseLineItem[];
    costing: PurchaseCosting;
    // Paid / due are not stored: they come from Payment records that reference invoiceNumber.
    createdBy: string;
}

/** What Add Purchase / Edit Purchase save. */
export type PurchaseInput = Pick<Purchase, "supplierId" | "supplier" | "date" | "location" | "items" | "costing">;

export type NewPurchaseInput = PurchaseInput;

/** A purchase as the list shows it: counts and amount derived from its items. */
export interface PurchaseRow extends Purchase {
    totalItem: number;
    totalAmount: number;
}

// ── Purchase returns ────────────────────────────────────────────────────────
// Paid Amount and Status are intentionally absent: the CEO removed them from returns.

export interface PurchaseReturn {
    id: string;
    invoiceNumber: string;
    /** People profile of the supplier (null only when a legacy name could not be matched). */
    supplierId: string | null;
    supplier: string;
    company: string;
    supplierInitials: string;
    badgeColor: string;
    /** YYYY-MM-DD */
    date: string;
    items: PurchaseLineItem[];
    costing: PurchaseCosting;
    /** Outstanding amount. A return can be edited only while this is above 0. */
    dueAmount: number;
    createdBy: string;
}

/** What Edit Purchase Return saves; Due Amount is adjusted by the store, never sent. */
export type PurchaseReturnInput = Pick<PurchaseReturn, "date" | "items" | "costing">;

/** What Add Purchase Return saves; Due Amount starts equal to the Total. */
export type NewPurchaseReturnInput = Pick<PurchaseReturn, "supplierId" | "supplier" | "company" | "date" | "items" | "costing">;

export interface PurchaseReturnRow extends PurchaseReturn {
    totalItem: number;
    totalAmount: number;
    canEdit: boolean;
}

// ── Edit flow helpers ───────────────────────────────────────────────────────

/** Which units the Product Search may offer: un-received for purchases, in-stock from the supplier for returns. */
export type PurchaseUnitMode = "purchase" | "return";

/** A Barcodes-module unit the Product Search can add as a row. */
export interface PurchaseUnitOption {
    barcodeId: string;
    serial: string;
    productName: string;
    variant: string;
    sku: string;
    status: BarcodeStatus;
    /** Supplier that received the unit; null until it is received. */
    supplier: string | null;
    /** Purchase price from the Received event for returns; 0 for new purchases. */
    unitPrice: number;
}

/** What decides whether a unit may be added to the list being edited. */
export interface UnitEligibilityContext {
    mode: PurchaseUnitMode;
    /** Returns only: the return's supplier; null until the first unit sets it (Add Return). */
    supplier: string | null;
    /** Serial keys already in the list being edited. */
    inList: ReadonlySet<string>;
    /** Serial key -> invoice number of another purchase/return that already holds it. */
    taken: ReadonlyMap<string, string>;
}

/** Inputs of usePurchaseUnitSearch. */
export interface PurchaseUnitSearchOptions {
    mode: PurchaseUnitMode;
    /** Rows already in the list being edited. */
    items: PurchaseLineItem[];
    /** Returns: the return's supplier (null until the first unit sets it). Ignored for purchases. */
    supplier: string | null;
    /** The record being edited, so its own serials do not count as taken. */
    excludeId: string | null;
    onAdd: (option: PurchaseUnitOption) => void;
}

/** Receipt details written to each scanned unit when a purchase is saved. */
export interface PurchaseReceiveInput {
    supplier: string;
    location: PurchaseLocation;
    invoiceNumber: string;
}

/** Scan / pick outcome; `message` explains exactly why a unit was refused. */
export type PurchaseUnitLookup = { ok: true; option: PurchaseUnitOption } | { ok: false; message: string };

export type PurchaseFormError =
    | "supplier_required"
    | "location_required"
    | "date_required"
    | "items_required"
    | "serial_required"
    | "serial_duplicate"
    | "serial_on_purchase"
    | "serial_on_return"
    | "price_invalid"
    | "return_locked";

export type PurchaseActionResult = { ok: true } | { ok: false; error: PurchaseFormError };

export type PurchaseSaveResult = { ok: true; id: string; invoiceNumber: string } | { ok: false; error: PurchaseFormError };

/** Footer of a list table: a single Total (no Grand Total). */
export interface PurchaseListTotal {
    totalItem: number;
    totalAmount: number;
}

export interface PurchaseReturnListTotal extends PurchaseListTotal {
    dueAmount: number;
}

// ── Store ───────────────────────────────────────────────────────────────────

export interface PurchasesState {
    purchases: Purchase[];
    purchaseReturns: PurchaseReturn[];

    /** New purchases start with status Due. Refused on a Serial/IMEI that is duplicated or already purchased. */
    addPurchase: (input: NewPurchaseInput) => PurchaseSaveResult;
    updatePurchase: (id: string, input: PurchaseInput) => PurchaseActionResult;
    deletePurchases: (ids: string[]) => void;

    /** Due Amount starts equal to the Total. */
    addPurchaseReturn: (input: NewPurchaseReturnInput) => PurchaseSaveResult;
    /**
     * Refused (`return_locked`) when the return has no due left. Otherwise Due Amount moves by the
     * exact change in Total, capped at 0 (which locks the return).
     */
    updatePurchaseReturn: (id: string, input: PurchaseReturnInput) => PurchaseActionResult;
    deletePurchaseReturns: (ids: string[]) => void;
}
