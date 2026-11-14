import { useCallback } from "react";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useStockTransferStore } from "@/store/useStockTransferStore";
import { StockTransfer } from "@/types/stockTransfers";
import { OperationApprovalStatus } from "@/types/operations";
import { notifyOperationResult } from "./notifyOperationResult";
import { useSpokeDrawers } from "./useSpokeDrawers";

const matches = (row: StockTransfer, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.ref, row.fromShop, row.toShop, row.status, row.date].some((text) => text.toLowerCase().includes(q))
        || row.serials.some((serial) => serial.serialNo.toLowerCase().includes(q));
};

/** Stock Transfer spoke: list, search, pagination, drawers and the approve / cancel decision. */
export function useStockTransfersManager() {
    const transfers = useStockTransferStore((state) => state.transfers);
    const setTransferStatus = useStockTransferStore((state) => state.setTransferStatus);
    const table = useListControls(transfers, matches);
    const drawers = useSpokeDrawers("view-stock-transfer", "create-stock-transfer");

    const viewed = transfers.find((transfer) => transfer.id === drawers.viewId) ?? null;

    const decide = useCallback((id: string, status: Exclude<OperationApprovalStatus, "Draft">) => {
        notifyOperationResult(setTransferStatus(id, status), `Transfer ${status === "Approved" ? "approved" : "cancelled"}.`);
    }, [setTransferStatus]);

    return { table, drawers, viewed, decide };
}
