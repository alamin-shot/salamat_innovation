import { SharedSeoClient } from "@/components/features/seo/shared-seo/SharedSeoClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function TekzoSeoPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SharedSeoClient platform="tekzo" />
        </Suspense>
    );
}

