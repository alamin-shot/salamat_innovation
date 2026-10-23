import { DealerClient } from "@/components/features/partners/dealers/DealerClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DealersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DealerClient />
        </Suspense>
    )
}

