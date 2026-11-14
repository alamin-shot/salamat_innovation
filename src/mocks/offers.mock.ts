import { Offer } from "@/types/offers";

/** The original Flash Sale, now pointing at a real Products variant (xiaomi 14 · 128GB). */
export const INITIAL_OFFERS: Offer[] = [
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
            { id: "p1", productId: "4", variantId: "var-1", productName: "xiaomi 14", variantName: "128GB", sku: "" },
        ],
    },
];
