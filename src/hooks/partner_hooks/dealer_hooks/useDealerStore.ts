import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Dealer {
    id: string;
    name: string;
    email: string;
    primaryPhone: string;
    secondaryPhone: string;
    businessName: string;
    tradeLicense: string;
    address: string;
    logo: string | null;
    status: string;
}

interface DealerState {
    dealers: Dealer[];
    addDealer: (dealer: Omit<Dealer, "id">) => void;
    updateDealer: (id: string, updated: Partial<Dealer>) => void;
    deleteDealer: (id: string) => void;
    bulkDeleteDealers: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const useDealerStore = create<DealerState>()(
    persist(
        (set) => ({
            dealers: [
                { id: "1", name: "Azizul Haque", email: "babuaziz875@gmail.com", primaryPhone: "01619905420", secondaryPhone: "-", businessName: "A K International", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "2", name: "Durjoy Chowhan", email: "-", primaryPhone: "01828484086", secondaryPhone: "-", businessName: "Dream watch & Optics", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "3", name: "Helal Uddin", email: "-", primaryPhone: "01764954098", secondaryPhone: "-", businessName: "Tech City", tradeLicense: "-", address: "-", logo: null, status: "Inactive" },
            ],
            addDealer: (newDealer) =>
                set((state) => ({
                    dealers: [{ ...newDealer, id: crypto.randomUUID() }, ...state.dealers],
                })),
            updateDealer: (id, updated) =>
                set((state) => ({
                    dealers: state.dealers.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteDealer: (id) =>
                set((state) => ({
                    dealers: state.dealers.filter((item) => item.id !== id),
                })),
            bulkDeleteDealers: (ids) =>
                set((state) => ({
                    dealers: state.dealers.filter((item) => !ids.includes(item.id)),
                })),
            updateStatus: (id, status) =>
                set((state) => ({
                    dealers: state.dealers.map((item) => item.id === id ? { ...item, status } : item),
                })),
        }),
        { name: "tekzo_dealer_store" }
    )
);