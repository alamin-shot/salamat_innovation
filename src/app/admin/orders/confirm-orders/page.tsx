"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const CONFIRM_CONFIG: OrderPageConfig = {
    title: "Confirm Orders",
    targetStatus: "Confirmed",
    emptyStateMessage: "No orders are waiting for confirmation.",
    actions: [
        {
            label: "Order Details",
            icon: Eye,
            colorClass: "text-blue-600 hover:bg-blue-50",
            onClick: (id, manager) => manager.openInvoice(id)
        },
        {
            label: "Approve",
            icon: CheckCircle,
            colorClass: "text-emerald-600 hover:bg-emerald-50",
            onClick: (id, manager) => manager.changeStatus(id, "Approved")
        },
        {
            label: "Cancel",
            icon: XCircle,
            colorClass: "text-red-600 hover:bg-red-50",
            onClick: (id, manager) => manager.changeStatus(id, "Rejected")
        }
    ]
};

export default function ConfirmOrdersPage() {
    const manager = useOrderStatusManager(CONFIRM_CONFIG);
    return <BaseOrderView manager={manager} />;
}