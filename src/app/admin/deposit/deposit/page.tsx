import { DepositClient } from "@/components/features/deposits/deposit-list/DepositClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DepositPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DepositClient />
        </Suspense>
    );
}

