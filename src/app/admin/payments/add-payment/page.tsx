import { AddPaymentClient } from "@/components/features/payments/add-payment/AddPaymentClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddPaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddPaymentClient />;
        </Suspense>
    )
}