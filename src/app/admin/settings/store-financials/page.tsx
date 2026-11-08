import { StoreFinancialsView } from "@/components/features/settings/views/StoreFinancialsView";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function StoreFinancialsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <StoreFinancialsView />
        </Suspense>
    );
}

