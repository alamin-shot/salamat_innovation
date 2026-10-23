import { RetailerClient } from "@/components/features/partners/retailers/RetailerClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function RetailersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <RetailerClient />
        </Suspense>
    )
}
