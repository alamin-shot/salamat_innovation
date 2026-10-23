import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Retailer {
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

interface RetailerState {
    retailers: Retailer[];
    addRetailer: (retailer: Omit<Retailer, "id">) => void;
    updateRetailer: (id: string, updated: Partial<Retailer>) => void;
    deleteRetailer: (id: string) => void;
    bulkDeleteRetailers: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const useRetailerStore = create<RetailerState>()(
    persist(
        (set) => ({
            retailers: [
                { id: "1", name: "Mohammad Asif", email: "-", primaryPhone: "01940166001", secondaryPhone: "-", businessName: "Umrelo", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "2", name: "Waliullah", email: "-", primaryPhone: "01620822287", secondaryPhone: "-", businessName: "Uttra Gadget Gallery", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "3", name: "Moniruzzaman Munna", email: "technestbd2025@gmail.com", primaryPhone: "01728461190", secondaryPhone: "-", businessName: "TechNest BD", tradeLicense: "-", address: "-", logo: null, status: "Inactive" },
                { id: "4", name: "Ashraf", email: "-", primaryPhone: "01521432513", secondaryPhone: "-", businessName: "TAG", tradeLicense: "-", address: "-", logo: null, status: "Active" },
                { id: "5", name: "Md. Jahid Hasan", email: "gadgetbreezebd@gmail.com", primaryPhone: "01716696120", secondaryPhone: "-", businessName: "Gadget Breeze", tradeLicense: "-", address: "-", logo: null, status: "Active" },
            ],
            addRetailer: (newRetailer) =>
                set((state) => ({
                    retailers: [{ ...newRetailer, id: crypto.randomUUID() }, ...state.retailers],
                })),
            updateRetailer: (id, updated) =>
                set((state) => ({
                    retailers: state.retailers.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteRetailer: (id) =>
                set((state) => ({
                    retailers: state.retailers.filter((item) => item.id !== id),
                })),
            bulkDeleteRetailers: (ids) =>
                set((state) => ({
                    retailers: state.retailers.filter((item) => !ids.includes(item.id)),
                })),
            updateStatus: (id, status) =>
                set((state) => ({
                    retailers: state.retailers.map((item) => item.id === id ? { ...item, status } : item),
                })),
        }),
        { name: "tekzo_retailer_store" }
    )
);