import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Franchise {
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

interface FranchiseState {
    franchises: Franchise[];
    addFranchise: (franchise: Omit<Franchise, "id">) => void;
    updateFranchise: (id: string, updated: Partial<Franchise>) => void;
    deleteFranchise: (id: string) => void;
    bulkDeleteFranchises: (ids: string[]) => void;
    updateStatus: (id: string, status: string) => void;
}

export const useFranchiseStore = create<FranchiseState>()(
    persist(
        (set) => ({

            franchises: [
                { id: "1", name: "Zayed Khan", email: "zayed@example.com", primaryPhone: "01711223344", secondaryPhone: "-", businessName: "Zayed Franchise Hub", tradeLicense: "-", address: "Gulshan, Dhaka", logo: null, status: "Active" },
                { id: "2", name: "Ananta Jalil", email: "ananta@example.com", primaryPhone: "01811223344", secondaryPhone: "-", businessName: "AJ Electronics", tradeLicense: "-", address: "Banani, Dhaka", logo: null, status: "Inactive" },
            ],
            addFranchise: (newFranchise) =>
                set((state) => ({
                    franchises: [{ ...newFranchise, id: crypto.randomUUID() }, ...state.franchises],
                })),
            updateFranchise: (id, updated) =>
                set((state) => ({
                    franchises: state.franchises.map((item) => item.id === id ? { ...item, ...updated } : item),
                })),
            deleteFranchise: (id) =>
                set((state) => ({
                    franchises: state.franchises.filter((item) => item.id !== id),
                })),
            bulkDeleteFranchises: (ids) =>
                set((state) => ({
                    franchises: state.franchises.filter((item) => !ids.includes(item.id)),
                })),
            updateStatus: (id, status) =>
                set((state) => ({
                    franchises: state.franchises.map((item) => item.id === id ? { ...item, status } : item),
                })),
        }),
        { name: "tekzo_franchise_store" }
    )
);