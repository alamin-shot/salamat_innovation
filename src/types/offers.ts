import type { DiscountState } from "@/types/products";

// LAYER 1: Offers (future /api/offers). An offer lists product variants; their price and discount are
// never stored here — they come from the Products store (discount = MRP − selling price), so an offer
// always shows what the product page shows.

export type OfferType = "Flash Sale" | "Campaign" | "Regular";
export type OfferStatus = "Active" | "Inactive";

export interface OfferProduct {
    /** Row id inside the offer. */
    id: string;
    productId: string;
    variantId: string;
    /** Names / SKU as they were when added (shown if the product is later removed from Products). */
    productName: string;
    variantName: string;
    sku: string;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    banner: string | null;
    /** ISO-8601 */
    startDate: string;
    /** ISO-8601 */
    endDate: string;
    type: OfferType;
    status: OfferStatus;
    products: OfferProduct[];
}

export type OfferInput = Omit<Offer, "id">;

export interface OffersState {
    offers: Offer[];
    addOffer: (offer: OfferInput) => void;
    updateOffer: (id: string, updatedData: Partial<OfferInput>) => void;
    deleteOffer: (id: string) => void;
    bulkDeleteOffers: (ids: string[]) => void;
}

/** An offer product joined with live Products data. */
export interface OfferProductView extends OfferProduct {
    /** False when the product / variant no longer exists in Products. */
    isAvailable: boolean;
    maxRetailPrice: number | null;
    sellingPrice: number | null;
    discountAmount: number;
    discountPercent: number;
    discountState: DiscountState | "unavailable";
}
