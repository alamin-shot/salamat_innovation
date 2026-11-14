import { useCallback } from "react";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCashTransferStore } from "@/store/useCashTransferStore";
import { CashTransfer } from "@/types/cashTransfers";
import { OperationApprovalStatus } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";
import { useSpokeDrawers } from "./useSpokeDrawers";

const matches = (row: CashTransfer, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.ref, row.fromShop, row.toShop, row.status, row.date, String(row.amount)].some((text) => text.toLowerCase().includes(q));
};

/** Cash Transfer spoke: list, search, pagination, drawers and the approve / cancel decision. */
export function useCashTransfersManager() {
    const cashTransfers = useCashTransferStore((state) => state.cashTransfers);
    const setCashTransferStatus = useCashTransferStore((state) => state.setCashTransferStatus);
    const table = useListControls(cashTransfers, matches);
    const drawers = useSpokeDrawers("view-cash-transfer", "create-cash-transfer");

    const viewed = cashTransfers.find((transfer) => transfer.id === drawers.viewId) ?? null;

    const decide = useCallback((id: string, status: Exclude<OperationApprovalStatus, "Draft">) => {
        notifyOperationResult(setCashTransferStatus(id, status), `Cash transfer ${status === "Approved" ? "approved" : "cancelled"}.`);
    }, [setCashTransferStatus]);

    return { table, drawers, viewed, decide };
}
