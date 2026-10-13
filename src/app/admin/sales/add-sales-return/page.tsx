import { AddSaleReturnClient } from "@/components/features/sales-pages/add-sales-return/AddSaleReturnClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function SalesReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddSaleReturnClient />;

        </Suspense>
    )
}