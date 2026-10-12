import { GeneratedBarcodesClient } from "@/components/features/barcodes-pages/generated-barcodes/GeneratedBarcodesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function GeneratedBarcodesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }> <GeneratedBarcodesClient />;
        </Suspense>
    )
}