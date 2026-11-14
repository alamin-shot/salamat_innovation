"use client";
import * as React from "react";
import { useOrderStatusFilter } from "@/hooks/order_hooks/useOrderStatusFilter";
import { AllOrdersClient } from "@/components/features/orders/all-orders/AllOrdersClient";
import { OrderStatusView } from "@/components/features/orders/shared/OrderStatusView";
import { OrderStatusChips } from "./OrderStatusChips";

/** Orders spoke: "All Orders" or one status, chosen by the chips (`?status=`). */
export function OrdersSpoke() {
    const { status, setStatus, counts, isPending } = useOrderStatusFilter();

    return (
        <div className="flex flex-col gap-3">
            <OrderStatusChips status={status} counts={counts} onChange={setStatus} />
            <div className={`transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}>
                {status === "All" ? <AllOrdersClient /> : <OrderStatusView key={status} status={status} />}
            </div>
        </div>
    );
}
