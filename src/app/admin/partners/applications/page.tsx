import { ApplicationClient } from "@/components/features/partners/applications/ApplicationClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";


export default function ApplicationsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ApplicationClient />
        </Suspense>
    );
}
