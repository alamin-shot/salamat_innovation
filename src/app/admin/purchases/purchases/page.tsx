import { PurchasesClient } from "@/components/features/purchases/purchases/PurchasesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function PurchasesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PurchasesClient />;

        </Suspense>
    )
}