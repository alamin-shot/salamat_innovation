"use client";
import { useOrderStatusManager, OrderPageConfig } from "@/hooks/order_hooks/useOrderStatusManager";
import { BaseOrderView } from "@/components/features/orders/shared/BaseOrderView";
import { Eye, PackageSearch, CheckCheck } from "lucide-react";

const APPROVE_CONFIG: OrderPageConfig = {
    title: "Approve Orders",
    targetStatus: "Approved",
    emptyStateMessage: "No approved orders waiting for processing.",
    actions: [
        { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) },
        { label: "Send to Processing", icon: PackageSearch, colorClass: "text-amber-600 hover:bg-amber-50", onClick: (id, m) => m.changeStatus(id, "Processing") },
        { label: "Direct Complete", icon: CheckCheck, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Complete") }
    ]
};

export default function ApproveOrdersPage() {
    const manager = useOrderStatusManager(APPROVE_CONFIG);
    return <BaseOrderView manager={manager} />;
}