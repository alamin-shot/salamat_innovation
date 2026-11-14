"use client";
import * as React from "react";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useOrdersHubOverview } from "@/hooks/order_hooks/useOrdersHubOverview";
import { OrdersHubTabKey } from "@/types/ordersHub";
import { ORDERS_HUB } from "@/constants/hubRoutes";
import { findSpoke } from "@/utils/hubSpokes";
import { OrderListClient } from "@/components/features/order-confirmations/order-list/OrderListClient";
import { OrderOptionsClient } from "@/components/features/order-confirmations/order-options/OrderOptionsClient";
import { OrdersSpoke } from "./spokes/orders/OrdersSpoke";

const SPOKES: Record<OrdersHubTabKey, () => React.ReactNode> = {
    order_list: () => <OrderListClient />,
    order_options: () => <OrderOptionsClient />,
    orders: () => <OrdersSpoke />,
};

/** Full-page Orders spoke with "Back to Orders". */
export function OrdersSpokePage({ spoke }: { spoke: OrdersHubTabKey }) {
    const meta = findSpoke(useOrdersHubOverview().groups, spoke);
    return (
        <HubSpokePage hub={ORDERS_HUB} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone}>
            {SPOKES[spoke]()}
        </HubSpokePage>
    );
}
