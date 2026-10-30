import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { ReviewClient } from "@/components/features/reviews/ReviewClient";

export const metadata = {
    title: "Product Reviews | Salamat Innovation ERP",
};

export default function ReviewsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ReviewClient />
        </Suspense>
    );
}