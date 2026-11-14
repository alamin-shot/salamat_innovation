import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OrdersHubClient } from "@/components/features/orders-hub/OrdersHubClient";

export const metadata: Metadata = {
    title: "Orders | Salamat Innovation ERP",
    description: "Order confirmations and the storefront order workflow.",
};

export default function OrdersHubPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OrdersHubClient />
        </Suspense>
    );
}
