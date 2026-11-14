// LAYER 1: Operations hub (routing only). Each spoke keeps its own entity file:
// types/stockTransfers.ts · types/damageProducts.ts · types/assets.types.ts · types/cashTransfers.ts

export type OperationsTabKey = "stock_transfers" | "damage_products" | "assets" | "cash_transfers";

/** Approval lifecycle shared by Stock Transfer, Damage Products and Cash Transfer: Draft → Approved | Cancelled. */
export type OperationApprovalStatus = "Draft" | "Approved" | "Cancelled";

/** Shops these modules move stock and cash between (the names the current screens use). */
export type OperationsShop =
    | "A-Block"
    | "TEKZO JFP 4A-018A"
    | "TEKZO JFP 4C-021C1"
    | "TEKZO Online Shop"
    | "Salamat Innovation";

/** Errors the Operations stores return instead of throwing (UI maps them to messages). */
export type OperationsError =
    | "shop_required"
    | "same_shop"
    | "date_required"
    | "serials_required"
    | "serial_duplicate"
    | "amount_invalid"
    | "not_found"
    | "not_draft";

export type OperationsCreateResult = { ok: true; id: string; ref: string } | { ok: false; error: OperationsError };
export type OperationsActionResult = { ok: true } | { ok: false; error: OperationsError };

/** One physical unit listed on a transfer or damage record. */
export interface OperationSerial {
    id: string;
    serialNo: string;
    product: string;
    sku: string;
    variant: string;
}

/** Result of scanning a serial into a Stock Transfer or Damage record. */
export type OperationUnitLookup = { ok: true; serial: OperationSerial } | { ok: false; message: string };
