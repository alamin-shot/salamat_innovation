import { PrintBarcodesClient } from "@/components/features/barcodes-pages/print-barcodes/PrintBarcodesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function PrintBarcodesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }> <PrintBarcodesClient />
        </Suspense>
    )
}