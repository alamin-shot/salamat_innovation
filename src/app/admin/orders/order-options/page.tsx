import { Suspense } from "react";
import { Metadata } from "next";
import { Loader } from "@/components/shared/loader/Loader";
import { OrdersSpokePage } from "@/components/features/orders-hub/OrdersSpokePage";

export const metadata: Metadata = {
    title: "Order Options · Orders | Salamat Innovation ERP",
};

/** Full-page Orders spoke (back link to the Orders hub inside). */
export default function OrderOptionsPage() {
    return (
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader /></div>}>
            <OrdersSpokePage spoke="order_options" />
        </Suspense>
    );
}
