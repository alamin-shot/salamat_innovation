"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, CheckCheck, Undo2 } from "lucide-react";

const ONWAY_CONFIG: OrderPageConfig = {
    title: "Onway Orders",
    targetStatus: "Onway",
    emptyStateMessage: "No orders are currently out for delivery.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        { label: "Delivery Complete", icon: CheckCheck, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Complete") },
        { label: "Customer Returned", icon: Undo2, colorClass: "text-orange-600 hover:bg-orange-50", onClick: (id, m) => m.changeStatus(id, "Return" as any) }
    ]
};

export default function OnwayOrdersPage() {
    const manager = useOrderStatusManager(ONWAY_CONFIG);
    return <BaseOrderView manager={manager} />;
}