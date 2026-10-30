import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReviewStatus = "Pending" | "Approved" | "Rejected";

export interface Review {
    id: string;
    productName: string;
    customerName: string;
    rating: number; // 1-5
    comment: string;
    reply: string | null;
    status: ReviewStatus;
    createdAt: string;
}

interface ReviewStore {
    reviews: Review[];
    addReview: (review: Omit<Review, "id" | "createdAt">) => void;
    updateReview: (id: string, updatedData: Partial<Review>) => void;
    deleteReview: (id: string) => void;
    bulkDeleteReviews: (ids: string[]) => void;
    updateStatus: (id: string, status: ReviewStatus) => void;
}

export const useReviewStore = create<ReviewStore>()(
    persist(
        (set) => ({
            reviews: [
                {
                    id: "1",
                    productName: "Samsung Galaxy S24 Ultra",
                    customerName: "Rahim Uddin",
                    rating: 5,
                    comment: "Excellent phone! The camera is mind-blowing and delivery was super fast.",
                    reply: "Thank you for the amazing feedback, Rahim! Enjoy your new device.",
                    status: "Approved",
                    createdAt: "2026-10-25T10:30:00.000Z"
                },
                {
                    id: "2",
                    productName: "Apple MagSafe Charger",
                    customerName: "Sarah Ahmed",
                    rating: 2,
                    comment: "The charger gets a bit too warm for my liking. Not sure if this is normal.",
                    reply: null,
                    status: "Pending",
                    createdAt: "2026-10-29T14:15:00.000Z"
                }
            ],
            addReview: (reviewData) => set((state) => ({
                reviews: [...state.reviews, { ...reviewData, id: Date.now().toString(), createdAt: new Date().toISOString() }]
            })),
            updateReview: (id, updatedData) => set((state) => ({
                reviews: state.reviews.map(review => review.id === id ? { ...review, ...updatedData } : review)
            })),
            deleteReview: (id) => set((state) => ({
                reviews: state.reviews.filter(review => review.id !== id)
            })),
            bulkDeleteReviews: (ids) => set((state) => ({
                reviews: state.reviews.filter(review => !ids.includes(review.id))
            })),
            updateStatus: (id, status) => set((state) => ({
                reviews: state.reviews.map(review => review.id === id ? { ...review, status } : review)
            }))
        }),
        { name: "erp-reviews-storage-v1" }
    )
);