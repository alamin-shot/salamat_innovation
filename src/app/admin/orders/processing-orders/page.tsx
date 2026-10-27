"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, Truck, CheckCheck } from "lucide-react";

const PROCESSING_CONFIG: OrderPageConfig = {
    title: "Processing Orders",
    targetStatus: "Processing",
    emptyStateMessage: "No orders are currently processing.",
    actions: [
        {
            label: "Order Details",
            icon: Eye,
            colorClass: "text-blue-600 hover:bg-blue-50",
            onClick: (id, manager) => manager.openInvoice(id)
        },
        {
            label: "Send OnWay",
            icon: Truck,
            colorClass: "text-amber-600 hover:bg-amber-50",
            onClick: (id, manager) => manager.changeStatus(id, "Onway")
        },
        {
            label: "Mark Complete",
            icon: CheckCheck,
            colorClass: "text-emerald-600 hover:bg-emerald-50",
            onClick: (id, manager) => manager.changeStatus(id, "Complete")
        }
    ]
};

export default function ProcessingOrdersPage() {
    const manager = useOrderStatusManager(PROCESSING_CONFIG);
    return <BaseOrderView manager={manager} />;
}