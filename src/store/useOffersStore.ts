import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Offer, OfferProduct, OffersState } from "@/types/offers";
import { INITIAL_OFFERS } from "@/mocks/offers.mock";

// LAYER 2: Offers cache (future /api/offers). Prices and discounts are read from Products, never stored.

export const useOffersStore = create<OffersState>()(
    persist(
        (set) => ({
            offers: INITIAL_OFFERS,
            addOffer: (offerData) => set((state) => ({
                offers: [...state.offers, { ...offerData, id: Date.now().toString() }],
            })),
            updateOffer: (id, updatedData) => set((state) => ({
                offers: state.offers.map((offer) => (offer.id === id ? { ...offer, ...updatedData } : offer)),
            })),
            deleteOffer: (id) => set((state) => ({
                offers: state.offers.filter((offer) => offer.id !== id),
            })),
            bulkDeleteOffers: (ids) => set((state) => ({
                offers: state.offers.filter((offer) => !ids.includes(offer.id)),
            })),
        }),
        {
            name: "erp-offers-storage-v1",
            version: 1,
            // version 1: per-product discountType / discountAmount / basePrice removed (derived from Products now).
            migrate: (persisted) => {
                const state = persisted as { offers?: (Offer & { products: (OfferProduct & Record<string, unknown>)[] })[] };
                const offers = (state.offers ?? INITIAL_OFFERS).map((offer) => ({
                    ...offer,
                    products: offer.products.map((product): OfferProduct => ({
                        id: product.id,
                        productId: product.productId,
                        variantId: product.variantId,
                        productName: product.productName,
                        variantName: product.variantName,
                        sku: product.sku,
                    })),
                }));
                return { offers } as OffersState;
            },
        }
    )
);
