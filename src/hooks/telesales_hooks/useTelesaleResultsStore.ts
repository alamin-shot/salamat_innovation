import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TelesaleResultItem {
    id: string;
    name: string;
    color: "Green" | "Yellow" | "Red" | "Blue" | "Grey";
    sortOrder: number;
    status: "Active" | "Inactive";
}

interface TelesaleResultsState {
    results: TelesaleResultItem[];
    addResult: (result: Omit<TelesaleResultItem, "id">) => void;
    updateResult: (id: string, updated: Partial<TelesaleResultItem>) => void;
    deleteResult: (id: string) => void;
    bulkDeleteResults: (ids: string[]) => void;
}

export const useTelesaleResultsStore = create<TelesaleResultsState>()(
    persist(
        (set) => ({
            results: [
                { id: "1", name: "Sale Done", color: "Green", sortOrder: 1, status: "Active" },
                { id: "2", name: "Follow Up", color: "Yellow", sortOrder: 2, status: "Active" },
                { id: "3", name: "Product Missing", color: "Red", sortOrder: 3, status: "Active" },
                { id: "4", name: "No More Follow Up", color: "Green", sortOrder: 4, status: "Active" },
                { id: "5", name: "Issue", color: "Red", sortOrder: 5, status: "Active" },
                { id: "6", name: "Stock Out", color: "Blue", sortOrder: 6, status: "Active" },
                { id: "7", name: "Not Available", color: "Red", sortOrder: 7, status: "Active" },
                { id: "8", name: "Waiting", color: "Yellow", sortOrder: 8, status: "Active" },
                { id: "9", name: "Shop Visit", color: "Green", sortOrder: 9, status: "Active" },
            ],
            addResult: (newResult) =>
                set((state) => ({
                    results: [
                        ...state.results,
                        { ...newResult, id: crypto.randomUUID() },
                    ],
                })),
            updateResult: (id, updated) =>
                set((state) => ({
                    results: state.results.map((item) =>
                        item.id === id ? { ...item, ...updated } : item
                    ),
                })),
            deleteResult: (id) =>
                set((state) => ({
                    results: state.results.filter((item) => item.id !== id),
                })),
            bulkDeleteResults: (ids) =>
                set((state) => ({
                    results: state.results.filter((item) => !ids.includes(item.id)),
                })),
        }),
        {
            name: "tekzo_telesale_results_store",
        }
    )
);