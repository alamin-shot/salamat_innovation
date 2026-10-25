import { AboutBuilderClient } from "@/components/features/about-builder/AboutBuilderClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function TekzoAboutBuilderPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Loader />
                </div>
            }>
            <AboutBuilderClient platform="tekzo" />
        </Suspense>
    )
}

