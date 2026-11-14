// LAYER 1: Stock Transfer (future NestJS resource: /api/stock-transfers).
import type {
    OperationApprovalStatus,
    OperationSerial,
    OperationsActionResult,
    OperationsCreateResult,
    OperationsShop,
} from "@/types/operations";

export interface StockTransfer {
    id: string;
    /** "ST-000353" */
    ref: string;
    fromShop: OperationsShop;
    toShop: OperationsShop;
    /** YYYY-MM-DD */
    date: string;
    /** ISO 8601 */
    createdAt: string;
    createdBy: string;
    /** Set when approved or cancelled. */
    approvedBy: string | null;
    note: string;
    status: OperationApprovalStatus;
    serials: OperationSerial[];
}

export type StockTransferInput = Pick<StockTransfer, "fromShop" | "toShop" | "date" | "note" | "serials">;

export interface StockTransferState {
    transfers: StockTransfer[];
    /** New transfers start as Draft. */
    addTransfer: (input: StockTransferInput) => OperationsCreateResult;
    /** Draft → Approved or Cancelled; anything else is refused. */
    setTransferStatus: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => OperationsActionResult;
}
