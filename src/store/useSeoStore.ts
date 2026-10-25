import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SeoPlatform = "salamat" | "tekzo";
export type SeoTabType = "pages" | "products" | "categories" | "brands";

export interface SeoRecord {
    id: string;
    platform: SeoPlatform;
    type: SeoTabType;
    name: string;
    slug: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    metaTags: string;
    status: "Active" | "Inactive";
    productCategory?: string; // Specific to products tab
    productBrand?: string;    // Specific to products tab
    createdAt: string;
}

interface SeoStore {
    records: SeoRecord[];
    addRecord: (record: Omit<SeoRecord, "id" | "createdAt">) => void;
    updateRecord: (id: string, record: Partial<SeoRecord>) => void;
    deleteRecord: (id: string) => void;
    bulkDeleteRecords: (ids: string[]) => void;
}

export const useSeoStore = create<SeoStore>()(
    persist(
        (set) => ({
            records: [],
            addRecord: (record) =>
                set((state) => ({
                    records: [
                        { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] },
                        ...state.records,
                    ],
                })),
            updateRecord: (id, updatedFields) =>
                set((state) => ({
                    records: state.records.map((r) => (r.id === id ? { ...r, ...updatedFields } : r)),
                })),
            deleteRecord: (id) =>
                set((state) => ({
                    records: state.records.filter((r) => r.id !== id),
                })),
            bulkDeleteRecords: (ids) =>
                set((state) => ({
                    records: state.records.filter((r) => !ids.includes(r.id)),
                })),
        }),
        { name: "erp-seo-storage" }
    )
);