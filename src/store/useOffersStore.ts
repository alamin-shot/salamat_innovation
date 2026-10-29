import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OfferProduct {
    id: string; // unique ID for this row
    productId: string;
    productName: string;
    variantId: string;
    variantName: string;
    sku: string;
    basePrice: number;
    discountType: "Fixed" | "Percent";
    discountAmount: number;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    banner: string | null;
    startDate: string; // ISO string
    endDate: string; // ISO string
    type: "Flash Sale" | "Campaign" | "Regular";
    status: "Active" | "Inactive";
    products: OfferProduct[]; // Nested relational array
}

interface OffersStore {
    offers: Offer[];
    addOffer: (offer: Omit<Offer, "id">) => void;
    updateOffer: (id: string, updatedData: Partial<Offer>) => void;
    deleteOffer: (id: string) => void;
    bulkDeleteOffers: (ids: string[]) => void;
}

export const useOffersStore = create<OffersStore>()(
    persist(
        (set) => ({
            offers: [
                {
                    id: "1",
                    title: "Tech Drop Up To 70% Off",
                    description: "Massive clearance sale for Q4.",
                    banner: null,
                    startDate: "2026-09-28T10:53:00.000Z",
                    endDate: "2026-11-30T12:00:00.000Z",
                    type: "Flash Sale",
                    status: "Active",
                    products: [
                        {
                            id: "p1",
                            productId: "prod_1",
                            productName: "DIZO Trimmer Neo",
                            variantId: "var_1",
                            variantName: "Black",
                            sku: "DIZO Trimmer neo",
                            basePrice: 1400,
                            discountType: "Fixed",
                            discountAmount: 200
                        }
                    ]
                }
            ],
            addOffer: (offerData) => set((state) => ({
                offers: [...state.offers, { ...offerData, id: Date.now().toString() }]
            })),
            updateOffer: (id, updatedData) => set((state) => ({
                offers: state.offers.map(offer => offer.id === id ? { ...offer, ...updatedData } : offer)
            })),
            deleteOffer: (id) => set((state) => ({
                offers: state.offers.filter(offer => offer.id !== id)
            })),
            bulkDeleteOffers: (ids) => set((state) => ({
                offers: state.offers.filter(offer => !ids.includes(offer.id))
            }))
        }),
        { name: "erp-offers-storage-v1" }
    )
);