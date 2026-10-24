import { SharedPartnerClient } from "@/components/features/partners/shared/SharedPartnerClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function B2bPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SharedPartnerClient type="b2b" />
        </Suspense>
    )
}



