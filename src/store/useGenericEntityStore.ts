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
                    { id: "1", name: "TEKZO Care 1 Year for Android (Flat Display)", value: 4.99 },
                    { id: "2", name: "TEKZO Care 1 Year for Apple Device", value: 9.99 }
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
        { name: "erp-generic-entities-v1" }
    )
);