"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const PENDING_CONFIG: OrderPageConfig = {
    title: "Pending Orders",
    targetStatus: "Pending",
    emptyStateMessage: "No pending orders at this time.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        { label: "Confirm Order", icon: CheckCircle, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Confirmed") },
        { label: "Cancel Order", icon: XCircle, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => m.changeStatus(id, "Rejected") }
    ]
};

export default function PendingOrdersPage() {
    const manager = useOrderStatusManager(PENDING_CONFIG);
    return <BaseOrderView manager={manager} />;
}