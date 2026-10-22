import { DirectorViewClient } from "@/components/features/directors-module/director-view/DirectorViewClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DirectorProfilePage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorViewClient id={params.id} />
        </Suspense>
    )
}