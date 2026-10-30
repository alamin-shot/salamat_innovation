import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GiftRule {
    id: string;
    primaryProductId: string;
    primaryProductName: string;
    giftProductId: string;
    giftProductName: string;
    startDate: string; // ISO string
    endDate: string; // ISO string
    status: "Active" | "Inactive";
}

interface GiftStore {
    gifts: GiftRule[];
    addGift: (gift: Omit<GiftRule, "id">) => void;
    updateGift: (id: string, updatedData: Partial<GiftRule>) => void;
    deleteGift: (id: string) => void;
    bulkDeleteGifts: (ids: string[]) => void;
    toggleStatus: (id: string) => void;
}

export const useGiftStore = create<GiftStore>()(
    persist(
        (set) => ({
            gifts: [
                {
                    id: "1",
                    primaryProductId: "prod_s24",
                    primaryProductName: "Samsung Galaxy S24 Ultra",
                    giftProductId: "prod_buds",
                    giftProductName: "Galaxy Buds 2 Pro",
                    startDate: "2026-10-01T00:00:00.000Z",
                    endDate: "2026-11-30T23:59:59.000Z",
                    status: "Active"
                },
                {
                    id: "2",
                    primaryProductId: "prod_iphone15",
                    primaryProductName: "iPhone 15 Pro Max",
                    giftProductId: "prod_magsafe",
                    giftProductName: "Apple MagSafe Charger",
                    startDate: "2026-09-15T00:00:00.000Z",
                    endDate: "2026-10-15T23:59:59.000Z",
                    status: "Inactive"
                }
            ],
            addGift: (giftData) => set((state) => ({
                gifts: [...state.gifts, { ...giftData, id: Date.now().toString() }]
            })),
            updateGift: (id, updatedData) => set((state) => ({
                gifts: state.gifts.map(gift => gift.id === id ? { ...gift, ...updatedData } : gift)
            })),
            deleteGift: (id) => set((state) => ({
                gifts: state.gifts.filter(gift => gift.id !== id)
            })),
            bulkDeleteGifts: (ids) => set((state) => ({
                gifts: state.gifts.filter(gift => !ids.includes(gift.id))
            })),
            toggleStatus: (id) => set((state) => ({
                gifts: state.gifts.map(gift =>
                    gift.id === id
                        ? { ...gift, status: gift.status === "Active" ? "Inactive" : "Active" }
                        : gift
                )
            }))
        }),
        { name: "erp-gift-product-storage-v1" }
    )
);