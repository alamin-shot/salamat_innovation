import { OperationsError, OperationsShop, OperationsTabKey } from "@/types/operations";

export const OPERATIONS_TABS = ["stock_transfers", "damage_products", "assets", "cash_transfers"] as const satisfies readonly OperationsTabKey[];

/** Shops offered in the Operations forms (every name used by the current records and dropdowns). */
export const OPERATIONS_SHOPS = [
    "A-Block",
    "TEKZO JFP 4A-018A",
    "TEKZO JFP 4C-021C1",
    "TEKZO Online Shop",
    "Salamat Innovation",
] as const satisfies readonly OperationsShop[];

/** Stamped as Created By / Approved By until the live auth session is wired. */
export const OPERATIONS_AUDIT_ACTOR = "Admin";

export const OPERATIONS_ERROR_MESSAGES: Readonly<Record<OperationsError, string>> = {
    shop_required: "Please choose a shop.",
    same_shop: "From and To shops must be different.",
    date_required: "Please choose a date.",
    serials_required: "Add at least one serial number.",
    serial_duplicate: "The same serial number is listed twice.",
    amount_invalid: "Amount must be greater than 0.",
    not_found: "Record not found.",
    not_draft: "Only Draft records can be approved or cancelled.",
};
