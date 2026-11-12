import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GenericEntity {
    id: string;
    [key: string]: any;
}

interface GenericEntityStore {
    entities: Record<string, GenericEntity[]>;
    addEntity: (moduleKey: string, data: Omit<GenericEntity, "id">) => void;
    updateEntity: (moduleKey: string, id: string, updatedData: Partial<GenericEntity>) => void;
    deleteEntity: (moduleKey: string, id: string) => void;
    bulkDeleteEntities: (moduleKey: string, ids: string[]) => void;
}

export const useGenericEntityStore = create<GenericEntityStore>()(
    persist(
        (set) => ({
            entities: {
                // Initialize with some dummy data for the first modules to verify UI
                "care": [
                    { id: "1", title: "TEKZO Care 1 Year for Android (Flat Display)", value: 4.99, status: "Active" },
                    { id: "2", title: "TEKZO Care 1 Year for Apple Device", value: 9.99, status: "Active" }
                ],
                "popup-dialog": [
                    { id: "1", name: "Tech Drop", image: null, mobileImage: null, url: "https://tekzo.com/offer", status: "Inactive" }
                ],
                "sliders": [
                    { id: "1", shop: "TEKZO", type: "Main Slider", heading: "-", status: "Active" }
                ],
                "our-teams": [
                    { id: "1", name: "Alamin Rifat", designation: "CEO", about: "Founder", photo: null }
                ]
            },
            addEntity: (moduleKey, data) => set((state) => {
                const current = state.entities[moduleKey] || [];
                return {
                    entities: {
                        ...state.entities,
                        [moduleKey]: [...current, { ...data, id: Date.now().toString() }]
                    }
                };
            }),
            updateEntity: (moduleKey, id, updatedData) => set((state) => {
                const current = state.entities[moduleKey] || [];
                return {
                    entities: {
                        ...state.entities,
                        [moduleKey]: current.map(item => item.id === id ? { ...item, ...updatedData } : item)
                    }
                };
            }),
            deleteEntity: (moduleKey, id) => set((state) => {
                const current = state.entities[moduleKey] || [];
                return {
                    entities: {
                        ...state.entities,
                        [moduleKey]: current.filter(item => item.id !== id)
                    }
                };
            }),
            bulkDeleteEntities: (moduleKey, ids) => set((state) => {
                const current = state.entities[moduleKey] || [];
                return {
                    entities: {
                        ...state.entities,
                        [moduleKey]: current.filter(item => !ids.includes(item.id))
                    }
                };
            })
        }),
        {
            name: "erp-generic-entities-v1",
            version: 1,
            // v0 -> v1: Care records were seeded under `name`, but the Care page reads `title`.
            // Existing browsers keep their saved data; only the missing `title`/`status` are filled in.
            migrate: (persistedState) => {
                const saved = persistedState as GenericEntityStore;
                const savedCare = saved?.entities?.["care"];
                if (!Array.isArray(savedCare)) {
                    return saved;
                }
                const care = savedCare.map((item) => {
                    if (item.title || !item.name) {
                        return item;
                    }
                    return { ...item, title: item.name, status: item.status || "Active" };
                });
                return { ...saved, entities: { ...saved.entities, care } };
            }
        }
    )
);