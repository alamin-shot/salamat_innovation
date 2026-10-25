// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export type SeoPlatform = "salamat" | "tekzo";
// export type SeoTabType = "pages" | "products" | "categories" | "brands";

// export interface SeoRecord {
//     id: string;
//     platform: SeoPlatform;
//     type: SeoTabType;
//     name: string;
//     slug: string;
//     description: string;
//     metaTitle: string;
//     metaDescription: string;
//     metaTags: string;
//     status: "Active" | "Inactive";
//     productCategory?: string; // Specific to products tab
//     productBrand?: string;    // Specific to products tab
//     createdAt: string;
// }

// interface SeoStore {
//     records: SeoRecord[];
//     addRecord: (record: Omit<SeoRecord, "id" | "createdAt">) => void;
//     updateRecord: (id: string, record: Partial<SeoRecord>) => void;
//     deleteRecord: (id: string) => void;
//     bulkDeleteRecords: (ids: string[]) => void;
// }

// export const useSeoStore = create<SeoStore>()(
//     persist(
//         (set) => ({
//             records: [],
//             addRecord: (record) =>
//                 set((state) => ({
//                     records: [
//                         { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] },
//                         ...state.records,
//                     ],
//                 })),
//             updateRecord: (id, updatedFields) =>
//                 set((state) => ({
//                     records: state.records.map((r) => (r.id === id ? { ...r, ...updatedFields } : r)),
//                 })),
//             deleteRecord: (id) =>
//                 set((state) => ({
//                     records: state.records.filter((r) => r.id !== id),
//                 })),
//             bulkDeleteRecords: (ids) =>
//                 set((state) => ({
//                     records: state.records.filter((r) => !ids.includes(r.id)),
//                 })),
//         }),
//         { name: "erp-seo-storage" }
//     )
// );

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
    productCategory?: string;
    productBrand?: string;
    createdAt: string;
}

interface SeoStore {
    records: SeoRecord[];
    addRecord: (record: Omit<SeoRecord, "id" | "createdAt">) => void;
    updateRecord: (id: string, record: Partial<SeoRecord>) => void;
    deleteRecord: (id: string) => void;
    bulkDeleteRecords: (ids: string[]) => void;
}

// 1. DUMMY DATA ARRAY
const initialDummyData: SeoRecord[] = [
    { id: "1", platform: "salamat", type: "pages", name: "Featured", slug: "featured", description: "Featured Tech Accessories", metaTitle: "Featured", metaDescription: "Best tech deals", metaTags: "tech, deals", status: "Active", createdAt: "2026-10-24" },
    { id: "2", platform: "salamat", type: "pages", name: "FAQ", slug: "faq", description: "Frequently Asked Questions", metaTitle: "FAQ", metaDescription: "Answers", metaTags: "help, faq", status: "Inactive", createdAt: "2026-10-24" },
    { id: "3", platform: "salamat", type: "pages", name: "About Us", slug: "about-us", description: "About Salamat Innovation", metaTitle: "About", metaDescription: "Company info", metaTags: "about", status: "Active", createdAt: "2026-10-25" },
    { id: "4", platform: "salamat", type: "pages", name: "Contact", slug: "contact", description: "Contact Information", metaTitle: "Contact Us", metaDescription: "Get in touch", metaTags: "contact", status: "Active", createdAt: "2026-10-25" },
    { id: "5", platform: "salamat", type: "products", name: "Honor Choice T10", slug: "honor-choice-t10", description: "High quality smart phone.", metaTitle: "Buy Honor T10", metaDescription: "Best price", metaTags: "honor", status: "Active", productCategory: "Smart Phones", productBrand: "Honor", createdAt: "2026-10-24" },
    { id: "6", platform: "tekzo", type: "pages", name: "About Us", slug: "about-us", description: "About Tekzo eCommerce", metaTitle: "About Tekzo", metaDescription: "Learn about us", metaTags: "about, tekzo", status: "Inactive", createdAt: "2026-10-25" }
];

export const useSeoStore = create<SeoStore>()(
    persist(
        (set) => ({
            records: initialDummyData,
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

        { name: "erp-seo-storage-v5" }
    )
);