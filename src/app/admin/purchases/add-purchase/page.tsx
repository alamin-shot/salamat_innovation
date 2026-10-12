import { AddPurchaseClient } from "@/components/features/purchases/add-purchase/AddPurchaseClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddPurchasePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddPurchaseClient />;

        </Suspense>
    )
}