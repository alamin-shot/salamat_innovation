// LAYER 1: Product reviews (future /api/reviews). "Verified buyer" is never stored: it is derived from
// Sales (the customer has a sale containing the reviewed product).

export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface Review {
    id: string;
    /** Products store id when picked from Products (null for older / storefront reviews). */
    productId: string | null;
    productName: string;
    /** People profile when picked from People (null for older / storefront reviews). */
    customerId: string | null;
    customerName: string;
    /** 1–5 */
    rating: number;
    comment: string;
    reply: string | null;
    status: ReviewStatus;
    /** Customer photos (scaled data URLs until media storage exists). */
    photos: string[];
    /** ISO-8601 */
    createdAt: string;
}

export type NewReviewInput = Omit<Review, "id" | "createdAt" | "reply">;

export type ReviewError = "product_required" | "customer_required" | "rating_invalid" | "comment_required";

export type ReviewSaveResult = { ok: true; review: Review } | { ok: false; error: ReviewError };

export interface ReviewState {
    reviews: Review[];
    addReview: (review: NewReviewInput) => ReviewSaveResult;
    updateReview: (id: string, updatedData: Partial<Review>) => void;
    deleteReview: (id: string) => void;
    bulkDeleteReviews: (ids: string[]) => void;
    updateStatus: (id: string, status: ReviewStatus) => void;
}

/** A review as the table shows it. */
export type ReviewRow = Review & { isVerifiedBuyer: boolean };

export interface ReviewSummary {
    total: number;
    /** 0 when there are no reviews; one decimal. */
    average: number;
    /** Count per star, index 0 = 5 stars … index 4 = 1 star. */
    distribution: { stars: number; count: number; percent: number }[];
    byStatus: Record<ReviewStatus, number>;
    verified: number;
}
