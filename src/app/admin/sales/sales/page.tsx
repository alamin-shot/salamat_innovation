import { SalesClient } from "@/components/features/sales-pages/sales/SalesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function SalesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SalesClient />;

        </Suspense>
    )
}