"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, RefreshCcw, XCircle } from "lucide-react";

const HOLD_CONFIG: OrderPageConfig = {
    title: "Hold Orders",
    targetStatus: "Hold" as any,
    emptyStateMessage: "No orders are currently on hold.",
    actions: [
        {
            label: "Order Details",
            icon: Eye,
            colorClass: "text-blue-600 hover:bg-blue-50",
            onClick: (id, manager) => manager.openInvoice(id)
        },
        {
            label: "Resume Order",
            icon: RefreshCcw,
            colorClass: "text-emerald-600 hover:bg-emerald-50",
            onClick: (id, manager) => manager.changeStatus(id, "Pending")
        },
        {
            label: "Cancel Order",
            icon: XCircle,
            colorClass: "text-red-600 hover:bg-red-50",
            onClick: (id, manager) => manager.changeStatus(id, "Rejected")
        }
    ]
};

export default function HoldOrdersPage() {
    const manager = useOrderStatusManager(HOLD_CONFIG);
    return <BaseOrderView manager={manager} />;
}