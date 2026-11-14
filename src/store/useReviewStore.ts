import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Review, ReviewError, ReviewState, NewReviewInput } from "@/types/reviews";
import { INITIAL_REVIEWS } from "@/mocks/reviews.mock";

// LAYER 2: Reviews cache (future /api/reviews).

function validate(input: NewReviewInput): ReviewError | null {
    if (!input.productName.trim()) return "product_required";
    if (!input.customerName.trim()) return "customer_required";
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) return "rating_invalid";
    if (!input.comment.trim()) return "comment_required";
    return null;
}

export const useReviewStore = create<ReviewState>()(
    persist(
        (set) => ({
            reviews: INITIAL_REVIEWS,
            addReview: (input) => {
                const error = validate(input);
                if (error) return { ok: false, error };
                const review: Review = { ...input, comment: input.comment.trim(), reply: null, id: Date.now().toString(), createdAt: new Date().toISOString() };
                set((state) => ({ reviews: [review, ...state.reviews] }));
                return { ok: true, review };
            },
            updateReview: (id, updatedData) => set((state) => ({
                reviews: state.reviews.map((review) => (review.id === id ? { ...review, ...updatedData } : review)),
            })),
            deleteReview: (id) => set((state) => ({
                reviews: state.reviews.filter((review) => review.id !== id),
            })),
            bulkDeleteReviews: (ids) => set((state) => ({
                reviews: state.reviews.filter((review) => !ids.includes(review.id)),
            })),
            updateStatus: (id, status) => set((state) => ({
                reviews: state.reviews.map((review) => (review.id === id ? { ...review, status } : review)),
            })),
        }),
        {
            name: "erp-reviews-storage-v1",
            version: 1,
            // version 1: product / customer links and customer photos (empty for existing reviews).
            migrate: (persisted) => {
                const state = persisted as { reviews?: Partial<Review>[] };
                const reviews = (state.reviews ?? INITIAL_REVIEWS).map((review) => ({
                    productId: null,
                    customerId: null,
                    photos: [],
                    ...review,
                })) as Review[];
                return { reviews } as ReviewState;
            },
        }
    )
);
