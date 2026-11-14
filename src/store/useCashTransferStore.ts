import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CashTransfer, CashTransferState } from "@/types/cashTransfers";
import { INITIAL_CASH_TRANSFERS } from "@/mocks/cashTransfers.mock";
import { OPERATIONS_AUDIT_ACTOR } from "@/constants/operations";
import { canDecide, nextOperationRef } from "@/utils/operationsRules";

// LAYER 2: Cash Transfer optimistic cache (future /api/cash-transfers). Isolated from the other Operations spokes.

export const useCashTransferStore = create<CashTransferState>()(
    persist(
        (set, get) => ({
            cashTransfers: INITIAL_CASH_TRANSFERS as CashTransfer[],

            addCashTransfer: (input) => {
                if (!input.fromShop || !input.toShop) return { ok: false, error: "shop_required" };
                if (input.fromShop === input.toShop) return { ok: false, error: "same_shop" };
                if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, error: "amount_invalid" };
                if (!input.date) return { ok: false, error: "date_required" };

                const record: CashTransfer = {
                    ...input,
                    // Whole paisa: never store float noise such as 0.30000000000000004.
                    amount: Math.round(input.amount * 100) / 100,
                    id: `ct-${Date.now()}`,
                    ref: nextOperationRef("CT", get().cashTransfers.map((transfer) => transfer.ref)),
                    createdAt: new Date().toISOString(),
                    createdBy: OPERATIONS_AUDIT_ACTOR,
                    approvedBy: null,
                    status: "Draft",
                };
                set((state) => ({ cashTransfers: [record, ...state.cashTransfers] }));
                return { ok: true, id: record.id, ref: record.ref };
            },

            setCashTransferStatus: (id, status) => {
                const target = get().cashTransfers.find((transfer) => transfer.id === id);
                if (!target) return { ok: false, error: "not_found" };
                if (!canDecide(target.status)) return { ok: false, error: "not_draft" };
                set((state) => ({
                    cashTransfers: state.cashTransfers.map((transfer) => (
                        transfer.id === id ? { ...transfer, status, approvedBy: OPERATIONS_AUDIT_ACTOR } : transfer
                    )),
                }));
                return { ok: true };
            },
        }),
        { name: "erp-cash-transfers-storage-v1" }
    )
);
