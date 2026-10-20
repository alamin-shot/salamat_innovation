import { AddWithdrawalClient } from "@/components/features/withdrawals/add-withdrawal/AddWithdrawalClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddWithdrawalPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddWithdrawalClient />
        </Suspense>
    );
}