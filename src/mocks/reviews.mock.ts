import { Review } from "@/types/reviews";

export const INITIAL_REVIEWS: Review[] = [
    {
        id: "1", productId: null, productName: "Samsung Galaxy S24 Ultra", customerId: null, customerName: "Rahim Uddin", rating: 5,
        comment: "Excellent phone! The camera is mind-blowing and delivery was super fast.",
        reply: "Thank you for the amazing feedback, Rahim! Enjoy your new device.", status: "Approved", photos: [], createdAt: "2026-10-25T10:30:00.000Z",
    },
    {
        id: "2", productId: null, productName: "Apple MagSafe Charger", customerId: null, customerName: "Sarah Ahmed", rating: 2,
        comment: "The charger gets a bit too warm for my liking. Not sure if this is normal.",
        reply: null, status: "Pending", photos: [], createdAt: "2026-10-29T14:15:00.000Z",
    },
    // Ratul Shikder bought this phone (sale INV-2026-1122), so the badge shows "Verified buyer".
    {
        id: "3", productId: null, productName: "Nothing Phone 4a", customerId: "29", customerName: "Ratul Shikder", rating: 4,
        comment: "Clean software and the glyph lights are fun. Battery easily lasts a day.",
        reply: null, status: "Pending", photos: [], createdAt: "2026-10-30T09:00:00.000Z",
    },
];
