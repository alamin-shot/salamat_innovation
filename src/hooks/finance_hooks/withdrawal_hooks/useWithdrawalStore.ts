import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Withdrawal {
    id: string;
    directorId: string;
    shopName: string;
    title: string;
    date: string;
    contact: string;
    attachments: number;
    note: string;
    amount: number;
    createdBy: string;
}

interface WithdrawalState {
    withdrawals: Withdrawal[];
    addWithdrawal: (withdrawal: Omit<Withdrawal, "id">) => void;
    updateWithdrawal: (id: string, updated: Partial<Withdrawal>) => void;
    deleteWithdrawal: (id: string) => void;
    bulkDeleteWithdrawals: (ids: string[]) => void;
}

export const useWithdrawalStore = create<WithdrawalState>()(
    persist(
        (set) => ({
            withdrawals: [
                { id: "101", directorId: "1", shopName: "A-Block", title: "Choshma Bill", date: "2026-10-19", contact: "-", attachments: 0, note: "-", amount: 800.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "102", directorId: "2", shopName: "A-Block", title: "Refund", date: "2026-10-19", contact: "-", attachments: 0, note: "-", amount: 700.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "103", directorId: "2", shopName: "A-Block", title: "Payment from ARIFUL ISLAM via Bkash", date: "2026-10-18", contact: "ARIFUL ISLAM", attachments: 0, note: "-", amount: 3000.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "104", directorId: "2", shopName: "A-Block", title: "Sale income via POS Brac Bank (A)", date: "2026-10-18", contact: "Tanzim", attachments: 1, note: "-", amount: 2599.00, createdBy: "Md Ahsan Habib Anik" },
            ],
            addWithdrawal: (newWithdrawal) =>
                set((state) => ({
                    withdrawals: [{ ...newWithdrawal, id: crypto.randomUUID() }, ...state.withdrawals],
                })),
            updateWithdrawal: (id, updated) =>
                set((state) => ({
                    withdrawals: state.withdrawals.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteWithdrawal: (id) =>
                set((state) => ({
                    withdrawals: state.withdrawals.filter((item) => item.id !== id),
                })),
            bulkDeleteWithdrawals: (ids) =>
                set((state) => ({
                    withdrawals: state.withdrawals.filter((item) => !ids.includes(item.id)),
                })),
        }),
        { name: "tekzo_withdrawal_store" }
    )
);