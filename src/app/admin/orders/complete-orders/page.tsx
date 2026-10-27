"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, Undo2 } from "lucide-react";

const COMPLETE_CONFIG: OrderPageConfig = {
    title: "Complete Orders",
    targetStatus: "Complete",
    emptyStateMessage: "No completed orders found.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        { label: "Revert to Return", icon: Undo2, colorClass: "text-orange-600 hover:bg-orange-50", onClick: (id, m) => m.changeStatus(id, "Return" as any) }
    ]
};

export default function CompleteOrdersPage() {
    const manager = useOrderStatusManager(COMPLETE_CONFIG);
    return <BaseOrderView manager={manager} />;
}