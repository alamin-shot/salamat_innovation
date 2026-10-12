import { CreateBarcodeClient } from "@/components/features/barcodes-pages/create-barcode/CreateBarcodeClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function CreateBarcodePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <CreateBarcodeClient />;

        </Suspense>
    )
}