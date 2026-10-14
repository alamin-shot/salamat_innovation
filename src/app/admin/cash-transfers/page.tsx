import { CashTransferClient } from "@/components/features/cash-transfer/CashTransferClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function CashTransfersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <CashTransferClient />
        </Suspense>
    );
}
