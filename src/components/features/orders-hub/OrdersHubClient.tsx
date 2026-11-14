"use client";
import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useHubTab } from "@/hooks/shared_hooks/useHubTab";
import { useOrdersHubOverview } from "@/hooks/order_hooks/useOrdersHubOverview";
import { OrdersHubTabKey } from "@/types/ordersHub";
import { ORDERS_HUB_TABS } from "@/constants/hub";
import { OrderListClient } from "@/components/features/order-confirmations/order-list/OrderListClient";
import { OrderOptionsClient } from "@/components/features/order-confirmations/order-options/OrderOptionsClient";
import { OrdersSpoke } from "./spokes/orders/OrdersSpoke";

const SPOKES: Record<OrdersHubTabKey, () => React.ReactNode> = {
    order_list: () => <OrderListClient />,
    order_options: () => <OrderOptionsClient />,
    orders: () => <OrdersSpoke />,
};

/** Orders hub: Order Confirmation + Orders. Couriers stays its own section. */
export function OrdersHubClient() {
    const hub = useHubTab<OrdersHubTabKey>(ORDERS_HUB_TABS);
    const { kpis, groups } = useOrdersHubOverview();

    return (
        <UniversalHubShell
            title="Orders"
            subtitle="Order confirmations and the full storefront order workflow."
            icon={ShoppingCart}
            groups={groups}
            kpis={kpis}
            hub={hub}
            renderSpoke={(tab) => SPOKES[tab]()}
        />
    );
}
