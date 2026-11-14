import { ORDERS_HUB, ORDERS_SPOKE_SLUGS, spokeHref } from "@/constants/hubRoutes";
import { useMemo } from "react";
import { CheckCheck, ClipboardCheck, ListChecks, Settings2, ShoppingCart, Truck, Clock } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useOrderListStore } from "@/hooks/order_confirmation_hooks/useOrderListStore";
import { useOrderOptionsStore } from "@/hooks/order_confirmation_hooks/useOrderOptionsStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { OrdersHubTabKey } from "@/types/ordersHub";

/** Live KPI strip + portal cards for the Orders hub; each spoke keeps its own store. */
export function useOrdersHubOverview(): { kpis: HubKpi[]; groups: HubSpokeGroup<OrdersHubTabKey>[] } {
    const orders = useOrderStore((state) => state.orders);
    const confirmations = useOrderListStore((state) => state.orders);
    const options = useOrderOptionsStore((state) => state.options);

    return useMemo(() => {
        const count = (...statuses: string[]) => orders.filter((order) => statuses.includes(order.status)).length;

        const kpis: HubKpi[] = [
            { id: "awaiting", label: "Awaiting Action", value: String(count("Pending", "Hold")), hint: `${count("Hold")} on hold`, icon: Clock, tone: "amber" },
            { id: "fulfilment", label: "In Fulfilment", value: String(count("Confirmed", "Approved", "Processing", "Onway")), hint: `${count("Onway")} on the way`, icon: Truck, tone: "blue" },
            { id: "completed", label: "Completed", value: String(count("Complete")), hint: `${count("Return")} returned · ${count("Rejected")} rejected`, icon: CheckCheck, tone: "emerald" },
            { id: "confirmations", label: "Order Confirmations", value: String(confirmations.length), hint: "Phone & chat orders logged", icon: ClipboardCheck, tone: "violet" },
        ];

        const groups: HubSpokeGroup<OrdersHubTabKey>[] = [
            {
                title: "Order Confirmation",
                description: "Log phone, WhatsApp and Messenger orders against a customer profile.",
                spokes: [
                    { id: "order_list", href: spokeHref(ORDERS_HUB, ORDERS_SPOKE_SLUGS.order_list), label: "Order List", description: "Confirmed customer orders, linked by phone number", icon: ListChecks, tone: "violet", count: confirmations.length },
                    { id: "order_options", href: spokeHref(ORDERS_HUB, ORDERS_SPOKE_SLUGS.order_options), label: "Order Options", description: "Dropdown values the order form offers", icon: Settings2, tone: "slate", count: options.length },
                ],
            },
            {
                title: "Storefront Orders",
                description: "Every online order through its workflow: pending to complete.",
                spokes: [
                    { id: "orders", href: spokeHref(ORDERS_HUB, ORDERS_SPOKE_SLUGS.orders), label: "Orders", description: "All orders with status filters, invoices and payments", icon: ShoppingCart, tone: "blue", count: orders.length },
                ],
            },
        ];

        return { kpis, groups };
    }, [orders, confirmations, options]);
}
