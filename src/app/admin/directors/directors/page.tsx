import { DirectorListClient } from "@/components/features/directors-module/director-list/DirectorListClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DirectorsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorListClient />
        </Suspense>
    )
}

