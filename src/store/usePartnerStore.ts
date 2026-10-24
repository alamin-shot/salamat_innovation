import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PartnerType = "dealer" | "retailer" | "b2b" | "franchise" | "application";

export interface Partner {
    id: string;
    type: PartnerType;
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

interface PartnerState {
    partners: Partner[];
    addPartner: (partner: Omit<Partner, "id">) => void;
    updatePartner: (id: string, updated: Partial<Partner>) => void;
    deletePartner: (id: string) => void;
    bulkDeletePartners: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const usePartnerStore = create<PartnerState>()(
    persist(
        (set) => ({
            partners: [],
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
        { name: "tekzo_partner_store" }
    )
);