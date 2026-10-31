import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OutletStatus = "Active" | "Inactive";

export interface Outlet {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    district: string;
    thana: string;
    postalCode: string;
    googleMapUrl: string;
    opens: string; // Time string, e.g., "10:00 AM"
    closes: string; // Time string, e.g., "10:00 PM"
    closeDay: string; // e.g., "Wednesday"
    description: string; // HTML string for Rich Text
    image: string | null; // Main thumbnail
    gallery: string[]; // Array of extra outlet image URLs
    status: OutletStatus;
    createdAt: string;
}

interface OutletStore {
    outlets: Outlet[];
    addOutlet: (outlet: Omit<Outlet, "id" | "createdAt">) => void;
    updateOutlet: (id: string, updatedData: Partial<Outlet>) => void;
    deleteOutlet: (id: string) => void;
    bulkDeleteOutlets: (ids: string[]) => void;
    updateStatus: (id: string, status: OutletStatus) => void;
}

export const useOutletStore = create<OutletStore>()(
    persist(
        (set) => ({
            outlets: [
                {
                    id: "1",
                    name: "Jamuna Future Park ( Branch - 1 )",
                    phone: "01897715222",
                    email: "info.jfp1@tekzo.com",
                    address: "Shop: 4C-021C Level: 4 Block: C, Jamuna Future Park, Dhaka, Bangladesh",
                    country: "Bangladesh",
                    district: "Dhaka",
                    thana: "Vatara",
                    postalCode: "1229",
                    googleMapUrl: "https://maps.app.goo.gl/...",
                    opens: "10:00 AM",
                    closes: "10:00 PM",
                    closeDay: "Wednesday",
                    description: "<p>Our flagship store located in the heart of Jamuna Future Park.</p>",
                    image: null,
                    gallery: [],
                    status: "Active",
                    createdAt: "2026-10-01T10:00:00.000Z"
                },
                {
                    id: "2",
                    name: "Jamuna Future Park ( Branch - 2 )",
                    phone: "01897715224",
                    email: "atickhasansajib@gmail.com",
                    address: "Shop: 4C-021C Level: 4 Block: C, Jamuna Future Park, Dhaka, Bangladesh",
                    country: "Bangladesh",
                    district: "Dhaka",
                    thana: "Vatara",
                    postalCode: "1229",
                    googleMapUrl: "https://maps.app.goo.gl/...",
                    opens: "10:00 AM",
                    closes: "10:00 PM",
                    closeDay: "Wednesday",
                    description: "",
                    image: null,
                    gallery: [],
                    status: "Inactive",
                    createdAt: "2026-10-05T10:00:00.000Z"
                }
            ],
            addOutlet: (outletData) => set((state) => ({
                outlets: [...state.outlets, { ...outletData, id: Date.now().toString(), createdAt: new Date().toISOString() }]
            })),
            updateOutlet: (id, updatedData) => set((state) => ({
                outlets: state.outlets.map(o => o.id === id ? { ...o, ...updatedData } : o)
            })),
            deleteOutlet: (id) => set((state) => ({
                outlets: state.outlets.filter(o => o.id !== id)
            })),
            bulkDeleteOutlets: (ids) => set((state) => ({
                outlets: state.outlets.filter(o => !ids.includes(o.id))
            })),
            updateStatus: (id, status) => set((state) => ({
                outlets: state.outlets.map(o => o.id === id ? { ...o, status } : o)
            }))
        }),
        { name: "erp-outlet-storage-v1" }
    )
);