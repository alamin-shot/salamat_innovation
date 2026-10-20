import { DirectorClient } from "@/components/features/withdrawals/director-list/DirectorClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DirectorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorClient />
        </Suspense>
    );
}