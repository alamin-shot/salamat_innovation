import { DirectorViewClient } from "@/components/features/directors-module/director-view/DirectorViewClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default async function DirectorProfilePage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DirectorViewClient id={id} />
        </Suspense>
    )
}