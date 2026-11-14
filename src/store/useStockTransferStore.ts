import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StockTransfer, StockTransferState } from "@/types/stockTransfers";
import { INITIAL_STOCK_TRANSFERS } from "@/mocks/stockTransfers.mock";
import { OPERATIONS_AUDIT_ACTOR } from "@/constants/operations";
import { canDecide, nextOperationRef, serialListError } from "@/utils/operationsRules";

// LAYER 2: Stock Transfer optimistic cache (future /api/stock-transfers). Isolated from the other Operations spokes.

export const useStockTransferStore = create<StockTransferState>()(
    persist(
        (set, get) => ({
            transfers: INITIAL_STOCK_TRANSFERS as StockTransfer[],

            addTransfer: (input) => {
                if (!input.fromShop || !input.toShop) return { ok: false, error: "shop_required" };
                if (input.fromShop === input.toShop) return { ok: false, error: "same_shop" };
                if (!input.date) return { ok: false, error: "date_required" };
                const serialError = serialListError(input.serials);
                if (serialError) return { ok: false, error: serialError };

                const record: StockTransfer = {
                    ...input,
                    id: `st-${Date.now()}`,
                    ref: nextOperationRef("ST", get().transfers.map((transfer) => transfer.ref)),
                    createdAt: new Date().toISOString(),
                    createdBy: OPERATIONS_AUDIT_ACTOR,
                    approvedBy: null,
                    status: "Draft",
                };
                set((state) => ({ transfers: [record, ...state.transfers] }));
                return { ok: true, id: record.id, ref: record.ref };
            },

            setTransferStatus: (id, status) => {
                const target = get().transfers.find((transfer) => transfer.id === id);
                if (!target) return { ok: false, error: "not_found" };
                if (!canDecide(target.status)) return { ok: false, error: "not_draft" };
                set((state) => ({
                    transfers: state.transfers.map((transfer) => (
                        transfer.id === id ? { ...transfer, status, approvedBy: OPERATIONS_AUDIT_ACTOR } : transfer
                    )),
                }));
                return { ok: true };
            },
        }),
        { name: "erp-stock-transfers-storage-v1" }
    )
);
