// LAYER 1: Cash Transfer (future NestJS resource: /api/cash-transfers).
import type {
    OperationApprovalStatus,
    OperationsActionResult,
    OperationsCreateResult,
    OperationsShop,
} from "@/types/operations";

export interface CashTransfer {
    id: string;
    /** "CT-000056" */
    ref: string;
    fromShop: OperationsShop;
    toShop: OperationsShop;
    /** Taka, a number (the old screen stored it as text such as "14,500.00"). */
    amount: number;
    /** YYYY-MM-DD */
    date: string;
    /** ISO 8601 */
    createdAt: string;
    createdBy: string;
    approvedBy: string | null;
    note: string;
    status: OperationApprovalStatus;
}

export type CashTransferInput = Pick<CashTransfer, "fromShop" | "toShop" | "amount" | "date" | "note">;

export interface CashTransferState {
    cashTransfers: CashTransfer[];
    addCashTransfer: (input: CashTransferInput) => OperationsCreateResult;
    setCashTransferStatus: (id: string, status: Exclude<OperationApprovalStatus, "Draft">) => OperationsActionResult;
}
