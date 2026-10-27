"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, ArchiveRestore } from "lucide-react";

const RETURN_CONFIG: OrderPageConfig = {
    title: "Return Orders",
    targetStatus: "Return" as any, // Add "Return" to OrderStatus type if missing
    emptyStateMessage: "No returned orders to process.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        { label: "Restock & Archive", icon: ArchiveRestore, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Rejected") }
    ]
};

export default function ReturnOrdersPage() {
    const manager = useOrderStatusManager(RETURN_CONFIG);
    return <BaseOrderView manager={manager} />;
}