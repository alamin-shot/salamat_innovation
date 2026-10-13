import { AddSaleClient } from "@/components/features/sales-pages/add-sale/AddSaleClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddSalesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddSaleClient />;

        </Suspense>
    )
}