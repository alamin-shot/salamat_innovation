import { PaymentListClient } from "@/components/features/payments/payment-list/PaymentListClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function PaymentListPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PaymentListClient />;
        </Suspense>
    )
}