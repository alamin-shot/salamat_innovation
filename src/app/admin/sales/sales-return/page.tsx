import { SaleReturnClient } from "@/components/features/sales-pages/sales-return/SaleReturnClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function SalesReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SaleReturnClient />;

        </Suspense>
    )
}