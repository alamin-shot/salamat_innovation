import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";
import { PurchaseReturnClient } from "@/components/features/purchases/purchase-return/PurchaseReturnClient";

export default function PurchaseReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PurchaseReturnClient />;

        </Suspense>
    )
}