"use client";
import { ShoppingCart } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useOrdersHubOverview } from "@/hooks/order_hooks/useOrdersHubOverview";

/** Orders hub portal: Order Confirmation + Orders. Couriers stays its own section. */
export function OrdersHubClient() {
    const { kpis, groups } = useOrdersHubOverview();

    return (
        <UniversalHubShell
            title="Orders"
            subtitle="Order confirmations and the full storefront order workflow."
            icon={ShoppingCart}
            groups={groups}
            kpis={kpis}
        />
    );
}
