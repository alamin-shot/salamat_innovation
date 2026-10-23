import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface B2bPartner {
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

interface B2bState {
    partners: B2bPartner[];
    addPartner: (partner: Omit<B2bPartner, "id">) => void;
    updatePartner: (id: string, updated: Partial<B2bPartner>) => void;
    deletePartner: (id: string) => void;
    bulkDeletePartners: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const useB2bStore = create<B2bState>()(
    persist(
        (set) => ({
            partners: [
                { id: "1", name: "Cartup", email: "-", primaryPhone: "01321153699", secondaryPhone: "-", businessName: "Cartup", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "2", name: "Sakib Arafat", email: "support@techtime.com.bd", primaryPhone: "01886006006", secondaryPhone: "-", businessName: "Techtime", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "3", name: "Swap", email: "-", primaryPhone: "01722531613", secondaryPhone: "-", businessName: "Swap.com.bd", tradeLicense: "-", address: "-", logo: null, status: "Inactive" },
                { id: "4", name: "Johir", email: "-", primaryPhone: "01975571289", secondaryPhone: "-", businessName: "Gadstyle", tradeLicense: "-", address: "-", logo: null, status: "Active" },
            ],
            addPartner: (newPartner) =>
                set((state) => ({
                    partners: [{ ...newPartner, id: crypto.randomUUID() }, ...state.partners],
                })),
            updatePartner: (id, updated) =>
                set((state) => ({
                    partners: state.partners.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deletePartner: (id) =>
                set((state) => ({
                    partners: state.partners.filter((item) => item.id !== id),
                })),
            bulkDeletePartners: (ids) =>
                set((state) => ({
                    partners: state.partners.filter((item) => !ids.includes(item.id)),
                })),
            updateStatus: (id, status) =>
                set((state) => ({
                    partners: state.partners.map((item) => item.id === id ? { ...item, status } : item),
                })),
        }),
        { name: "tekzo_b2b_store" }
    )
);