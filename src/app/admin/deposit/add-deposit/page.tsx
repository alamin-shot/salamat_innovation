import { AddDepositClient } from "@/components/features/deposits/add-deposit/AddDepositClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddDepositPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddDepositClient />
        </Suspense>
    );
}