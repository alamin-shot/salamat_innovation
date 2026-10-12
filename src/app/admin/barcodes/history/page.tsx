import { BarcodeHistoryClient } from "@/components/features/barcodes-pages/barcode-history/BarcodeHistoryClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function BarcodeHistoryPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <BarcodeHistoryClient />
        </Suspense>
    )
}