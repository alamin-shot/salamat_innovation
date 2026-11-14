import { PurchaseCosting, PurchaseFormError, PurchaseStatus, PurchaseStatusTone } from "@/types/purchases";

/** Stamped as Created By until the live auth session is wired (same as Products / Barcodes). */
export const PURCHASES_AUDIT_ACTOR = "Admin";

/** Avatar colour for suppliers of newly saved records. */
export const NEW_SUPPLIER_BADGE = "bg-emerald-600";

/** Badge colour family per recorded status (emerald / amber / rose). */
export const PURCHASE_STATUS_TONES: Readonly<Record<PurchaseStatus, PurchaseStatusTone>> = {
    Paid: "emerald",
    Received: "emerald",
    Pending: "amber",
    Due: "amber",
    Cancelled: "rose",
    Returned: "rose",
};

export const EMPTY_PURCHASE_COSTING: PurchaseCosting = {
    discountType: null,
    discountAmount: 0,
    taxAmount: 0,
    shippingCost: 0,
};

/** Rows the Product Search bar shows at most. */
export const PURCHASE_SEARCH_LIMIT = 8;

export const PURCHASE_FORM_ERRORS: Readonly<Record<PurchaseFormError, string>> = {
    supplier_required: "Please choose a supplier.",
    location_required: "Please choose a location.",
    date_required: "Please choose a date.",
    items_required: "Add at least one product.",
    serial_required: "Enter the product's Serial/IMEI number.",
    serial_duplicate: "The same Serial/IMEI number is in the list twice.",
    serial_on_purchase: "This Serial/IMEI number was already purchased on another invoice.",
    serial_on_return: "This Serial/IMEI number was already returned on another invoice.",
    price_invalid: "Unit price must be 0 or more.",
    return_locked: "This return is settled (no due), so it can't be edited.",
};
