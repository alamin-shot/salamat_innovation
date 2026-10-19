import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OrderOptionItem {
    id: string;
    type: "Advance Media" | "Order Media" | "Delivery Status" | "Delivery By" | "Online / Offline";
    name: string;
    color: "Grey" | "Pink" | "Green" | "Yellow" | "Red" | "Blue";
    sortOrder: number;
    status: "Active" | "Inactive";
}

interface OrderOptionsState {
    options: OrderOptionItem[];
    addOption: (option: Omit<OrderOptionItem, "id">) => void;
    updateOption: (id: string, updated: Partial<OrderOptionItem>) => void;
    deleteOption: (id: string) => void;
    bulkDeleteOptions: (ids: string[]) => void;
    updateOptionStatus: (id: string, status: "Active" | "Inactive") => void;
}

export const useOrderOptionsStore = create<OrderOptionsState>()(
    persist(
        (set) => ({
            options: [
                { id: "1", type: "Advance Media", name: "Bkash 24", color: "Pink", sortOrder: 0, status: "Active" },
                { id: "2", type: "Advance Media", name: "Bkash 25", color: "Pink", sortOrder: 0, status: "Active" },
                { id: "3", type: "Advance Media", name: "Nagad 25", color: "Yellow", sortOrder: 0, status: "Active" },
                { id: "4", type: "Advance Media", name: "Nagad 24", color: "Yellow", sortOrder: 0, status: "Active" },
                { id: "5", type: "Advance Media", name: "Nagad 26", color: "Yellow", sortOrder: 0, status: "Active" },
                { id: "6", type: "Advance Media", name: "Bkash 22", color: "Pink", sortOrder: 1, status: "Active" },
                { id: "7", type: "Advance Media", name: "Bkash 26", color: "Pink", sortOrder: 2, status: "Active" },
                { id: "8", type: "Advance Media", name: "Nagad 22", color: "Yellow", sortOrder: 3, status: "Active" },
                { id: "9", type: "Advance Media", name: "SSL", color: "Green", sortOrder: 4, status: "Active" },
                { id: "10", type: "Advance Media", name: "EMI", color: "Blue", sortOrder: 5, status: "Active" },
            ],
            addOption: (newOption) =>
                set((state) => ({
                    options: [...state.options, { ...newOption, id: crypto.randomUUID() }],
                })),
            updateOption: (id, updated) =>
                set((state) => ({
                    options: state.options.map((item) =>
                        item.id === id ? { ...item, ...updated } : item
                    ),
                })),
            deleteOption: (id) =>
                set((state) => ({
                    options: state.options.filter((item) => item.id !== id),
                })),
            bulkDeleteOptions: (ids) =>
                set((state) => ({
                    options: state.options.filter((item) => !ids.includes(item.id)),
                })),
            updateOptionStatus: (id, status) =>
                set((state) => ({
                    options: state.options.map((item) =>
                        item.id === id ? { ...item, status } : item
                    ),
                })),
        }),
        {
            name: "tekzo_order_options_store",
        }
    )
);