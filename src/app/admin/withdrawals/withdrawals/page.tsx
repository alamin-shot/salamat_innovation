import { WithdrawalClient } from "@/components/features/withdrawals/withdrawal-list/WithdrawalClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function WithdrawalPage() {

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <WithdrawalClient />
        </Suspense>
    );
}