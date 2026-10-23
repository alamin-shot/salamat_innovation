import { B2bClient } from "@/components/features/partners/b2b/B2bClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function B2bPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <B2bClient />
        </Suspense>
    )
}



