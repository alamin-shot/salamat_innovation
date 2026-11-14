"use client";
import { OrderStatus } from "@/store/useOrderStore";
import { useOrderStatusManager } from "@/hooks/order_hooks/useOrderStatusManager";
import { ORDER_STATUS_VIEWS } from "@/hooks/order_hooks/orderStatusViews";
import { BaseOrderView } from "./BaseOrderView";

/** Orders in one status, with that status's actions (mount with `key={status}`). */
export function OrderStatusView({ status }: { status: OrderStatus }) {
    const manager = useOrderStatusManager(ORDER_STATUS_VIEWS[status]);
    return <BaseOrderView manager={manager} />;
}
