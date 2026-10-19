import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentLog {
    id: string;
    contact: string;
    businessName: string;
    businessLogo: string;
    date: string;
    invoiceNumber: string;
    type: "payment sent" | "payment received";
    debit: number;
    credit: number;
}

interface PaymentListState {
    logs: PaymentLog[];
    deleteLog: (id: string) => void;
    bulkDeleteLogs: (ids: string[]) => void;
}

export const usePaymentListStore = create<PaymentListState>()(
    persist(
        (set) => ({
            logs: [
                { id: "1", contact: "Gadget Opia", businessName: "Gadget Opia", businessLogo: "GO", date: "18-10-2026", invoiceNumber: "PP-3594", type: "payment sent", debit: 13000.0, credit: 0.0 },
                { id: "2", contact: "Zihad Ahmed Mahin", businessName: "-", businessLogo: "-", date: "18-10-2026", invoiceNumber: "SLT-3593", type: "payment received", debit: 0.0, credit: 28500.0 },
                { id: "3", contact: "Minal Hossain", businessName: "-", businessLogo: "-", date: "18-10-2026", invoiceNumber: "PP-3592", type: "payment sent", debit: 33300.0, credit: 0.0 },
                { id: "4", contact: "Gadget Opia", businessName: "Gadget Opia", businessLogo: "GO", date: "18-10-2026", invoiceNumber: "PP-3591", type: "payment sent", debit: 35300.0, credit: 0.0 },
                { id: "5", contact: "Xeero", businessName: "Sojib", businessLogo: "-", date: "18-10-2026", invoiceNumber: "PP-3590", type: "payment sent", debit: 10000.0, credit: 0.0 },
                { id: "6", contact: "Live Apple", businessName: "-", businessLogo: "-", date: "18-10-2026", invoiceNumber: "PMT-3589", type: "payment received", debit: 0.0, credit: 15000.0 },
                { id: "7", contact: "huge Collection", businessName: "huge Collection", businessLogo: "-", date: "18-10-2026", invoiceNumber: "PP-3587", type: "payment sent", debit: 50000.0, credit: 0.0 },
                { id: "8", contact: "Ashraful Amin", businessName: "-", businessLogo: "-", date: "18-10-2026", invoiceNumber: "SLT-3586", type: "payment received", debit: 0.0, credit: 41000.0 },
            ],
            deleteLog: (id) =>
                set((state) => ({
                    logs: state.logs.filter((item) => item.id !== id),
                })),
            bulkDeleteLogs: (ids) =>
                set((state) => ({
                    logs: state.logs.filter((item) => !ids.includes(item.id)),
                })),
        }),
        {
            name: "tekzo_payment_list_store",
        }
    )
);