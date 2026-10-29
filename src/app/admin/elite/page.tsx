
import { EliteClient } from "@/components/features/elite/EliteClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function ElitePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <EliteClient />
        </Suspense>
    )
}

