import { SharedPartnerClient } from "@/components/features/partners/shared/SharedPartnerClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";


export default function ApplicationsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <SharedPartnerClient type="application" />
        </Suspense>
    );
}
