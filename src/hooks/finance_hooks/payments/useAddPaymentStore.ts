import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PaymentEntity {
    id: string;
    name: string;
    businessName: string;
    businessLogo: string;
    phoneNumber: string;
    debit: number;
    credit: number;
    balance: number;
}

interface AddPaymentState {
    entities: PaymentEntity[];
    processPayment: (id: string, type: "receive" | "send", amount: number) => void;
    deleteEntity: (id: string) => void;
    bulkDeleteEntities: (ids: string[]) => void;
}

export const useAddPaymentStore = create<AddPaymentState>()(
    persist(
        (set) => ({
            entities: [
                { id: "1", name: "Momin Accessories", businessName: "Momin Accessories", businessLogo: "-", phoneNumber: "01748987794", debit: 0.0, credit: 13800.0, balance: -13800.0 },
                { id: "2", name: "Zihad Ahmed Mahin", businessName: "-", businessLogo: "-", phoneNumber: "01342400634", debit: 28500.0, credit: 28500.0, balance: 0.0 },
                { id: "3", name: "Ashraful Amin", businessName: "-", businessLogo: "-", phoneNumber: "01860707540", debit: 41000.0, credit: 41000.0, balance: 0.0 },
                { id: "4", name: "Ariful Islam", businessName: "-", businessLogo: "-", phoneNumber: "01727886096", debit: 55200.0, credit: 55200.0, balance: 0.0 },
                { id: "5", name: "Pronoy Roy", businessName: "-", businessLogo: "-", phoneNumber: "01715232149", debit: 6449.0, credit: 0.0, balance: 6449.0 },
                { id: "6", name: "Nadim Sarker Rimon", businessName: "ABR Trading International", businessLogo: "-", phoneNumber: "01863630212", debit: 0.0, credit: 144000.0, balance: -144000.0 },
                { id: "7", name: "ARIFUL ISLAM", businessName: "-", businessLogo: "-", phoneNumber: "01887476986", debit: 28800.0, credit: 3000.0, balance: 25800.0 },
            ],
            processPayment: (id, type, amount) =>
                set((state) => ({
                    entities: state.entities.map((item) => {
                        if (item.id !== id) return item;
                        const newDebit = type === "receive" ? item.debit + amount : item.debit;
                        const newCredit = type === "send" ? item.credit + amount : item.credit;
                        return {
                            ...item,
                            debit: newDebit,
                            credit: newCredit,
                            balance: newDebit - newCredit,
                        };
                    }),
                })),
            deleteEntity: (id) =>
                set((state) => ({
                    entities: state.entities.filter((item) => item.id !== id),
                })),
            bulkDeleteEntities: (ids) =>
                set((state) => ({
                    entities: state.entities.filter((item) => !ids.includes(item.id)),
                })),
        }),
        {
            name: "tekzo_add_payment_store",
        }
    )
);