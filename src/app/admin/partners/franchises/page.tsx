import { FranchiseClient } from "@/components/features/partners/franchises/FranchiseClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function FranchisesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <FranchiseClient />
        </Suspense>
    );
}