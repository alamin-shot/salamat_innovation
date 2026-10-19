import { TelesaleResultsClient } from "@/components/features/telesales/telesales-results/TelesaleResultsClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function TelesaleResultsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <TelesaleResultsClient />
        </Suspense>
    );
}

