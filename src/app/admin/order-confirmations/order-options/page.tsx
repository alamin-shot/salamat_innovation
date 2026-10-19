import { OrderOptionsClient } from "@/components/features/order-confirmations/order-options/OrderOptionsClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export default function OrderOptionsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <OrderOptionsClient />
        </Suspense>
    );
}