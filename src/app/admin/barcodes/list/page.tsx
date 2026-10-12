import { BarcodeListClient } from "@/components/features/barcodes-pages/barcode-list/BarcodeListClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function BarcodeListPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <BarcodeListClient />;
        </Suspense>
    )
}