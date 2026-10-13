import { StockTransferClient } from "@/components/features/stock-transfer/StockTransferClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function StockTransfersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <StockTransferClient />
        </Suspense>
    );
}
