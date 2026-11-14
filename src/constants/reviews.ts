import { ReviewError, ReviewStatus } from "@/types/reviews";

export const REVIEW_STATUSES: ReviewStatus[] = ["Pending", "Approved", "Rejected"];

export const REVIEW_ERRORS: Readonly<Record<ReviewError, string>> = {
    product_required: "Choose a product.",
    customer_required: "Choose a customer.",
    rating_invalid: "Choose a rating from 1 to 5 stars.",
    comment_required: "Write the review comment.",
};

/** Customer photos per review. */
export const REVIEW_MAX_PHOTOS = 4;
