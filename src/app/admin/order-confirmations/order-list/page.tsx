import { OrderListClient } from "@/components/features/order-confirmations/order-list/OrderListClient";
import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";

export default function OrderListPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <OrderListClient />
        </Suspense>
    );
}