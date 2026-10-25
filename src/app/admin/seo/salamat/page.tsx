import { SharedSeoClient } from "@/components/features/seo/shared-seo/SharedSeoClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export default function SalamatSeoPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SharedSeoClient platform="salamat" />
        </Suspense>
    );
}