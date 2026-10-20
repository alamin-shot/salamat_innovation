import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Deposit {
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

interface DepositState {
    deposits: Deposit[];
    addDeposit: (deposit: Omit<Deposit, "id">) => void;
    updateDeposit: (id: string, updated: Partial<Deposit>) => void;
    deleteDeposit: (id: string) => void;
    bulkDeleteDeposits: (ids: string[]) => void;
}

export const useDepositStore = create<DepositState>()(
    persist(
        (set) => ({
            deposits: [
                { id: "293", directorId: "2", shopName: "A-Block", title: "Payment from Atick Hasan Sajib on 2026-10-17", date: "2026-10-17", contact: "Razin", attachments: 0, note: "-", amount: 50000.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "282", directorId: "2", shopName: "A-Block", title: "Payment from Atick Hasan Sajib on 2026-10-16", date: "2026-10-16", contact: "Gadget Opia", attachments: 0, note: "-", amount: 20000.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "291", directorId: "2", shopName: "A-Block", title: "Khokon Vai Salary", date: "2026-09-30", contact: "-", attachments: 0, note: "-", amount: 50000.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "288", directorId: "2", shopName: "A-Block", title: "Payment from Atick Hasan Sajib on 2026-09-24", date: "2026-09-24", contact: "maruf", attachments: 0, note: "-", amount: 200.00, createdBy: "Md Zihadul Islam Sazzad" },
                { id: "283", directorId: "1", shopName: "A-Block", title: "Bankim Investment profit", date: "2026-08-15", contact: "-", attachments: 0, note: "-", amount: 400000.00, createdBy: "-" },
            ],
            addDeposit: (newDeposit) =>
                set((state) => ({
                    deposits: [{ ...newDeposit, id: crypto.randomUUID() }, ...state.deposits],
                })),
            updateDeposit: (id, updated) =>
                set((state) => ({
                    deposits: state.deposits.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteDeposit: (id) =>
                set((state) => ({
                    deposits: state.deposits.filter((item) => item.id !== id),
                })),
            bulkDeleteDeposits: (ids) =>
                set((state) => ({
                    deposits: state.deposits.filter((item) => !ids.includes(item.id)),
                })),
        }),
        { name: "tekzo_deposit_store" }
    )
);