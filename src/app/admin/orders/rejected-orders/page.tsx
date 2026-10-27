"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, Trash2 } from "lucide-react";

const REJECTED_CONFIG: OrderPageConfig = {
    title: "Rejected Orders",
    targetStatus: "Rejected",
    emptyStateMessage: "No rejected orders found.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        {
            label: "Delete Permanently", icon: Trash2, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => {
                alert("Delete action triggered");
            }
        }
    ]
};

export default function RejectedOrdersPage() {
    const manager = useOrderStatusManager(REJECTED_CONFIG);
    return <BaseOrderView manager={manager} />;
}