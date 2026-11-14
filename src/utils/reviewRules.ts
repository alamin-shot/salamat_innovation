import { Review, ReviewRow, ReviewSummary } from "@/types/reviews";
import { Sale } from "@/types/sales";

const norm = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Verified buyer: some sale belongs to this customer (by People id, or by name for older records) and
 * contains the reviewed product (same product name).
 */
export function isVerifiedBuyer(review: Pick<Review, "customerId" | "customerName" | "productName">, sales: Sale[]): boolean {
    const product = norm(review.productName);
    const name = norm(review.customerName);
    return sales.some((sale) => {
        const sameCustomer = review.customerId && sale.customerId ? sale.customerId === review.customerId : norm(sale.customerName) === name;
        return sameCustomer && sale.items.some((item) => norm(item.productName) === product);
    });
}

export const toReviewRows = (reviews: Review[], sales: Sale[]): ReviewRow[] =>
    reviews.map((review) => ({ ...review, isVerifiedBuyer: isVerifiedBuyer(review, sales) }));

/** Average, 5→1 star distribution and status counts for the summary header. */
export function summarizeReviews(rows: ReviewRow[]): ReviewSummary {
    const total = rows.length;
    const sum = rows.reduce((acc, row) => acc + row.rating, 0);
    return {
        total,
        average: total ? Math.round((sum / total) * 10) / 10 : 0,
        distribution: [5, 4, 3, 2, 1].map((stars) => {
            const count = rows.filter((row) => Math.round(row.rating) === stars).length;
            return { stars, count, percent: total ? Math.round((count / total) * 100) : 0 };
        }),
        byStatus: {
            Pending: rows.filter((row) => row.status === "Pending").length,
            Approved: rows.filter((row) => row.status === "Approved").length,
            Rejected: rows.filter((row) => row.status === "Rejected").length,
        },
        verified: rows.filter((row) => row.isVerifiedBuyer).length,
    };
}
