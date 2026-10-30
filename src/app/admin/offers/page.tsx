import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { OffersClient } from "@/components/features/offers/OffersClient";

export const metadata = {
    title: "Offers | Salamat Innovation ERP",
};

export default function OffersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <OffersClient />
        </Suspense>
    );
}