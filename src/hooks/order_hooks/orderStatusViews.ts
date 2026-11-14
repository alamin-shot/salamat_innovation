import { ArchiveRestore, CheckCheck, CheckCircle, Eye, PackageSearch, RefreshCcw, Trash2, Truck, Undo2, XCircle } from "lucide-react";
import { OrderStatus } from "@/store/useOrderStore";
import { OrderActionConfig, OrderPageConfig } from "./useOrderStatusManager";

// One config per order status, moved unchanged from the nine old /admin/orders/<status> pages.
// The Orders spoke renders the matching config when `?status=` is set.

const details: OrderActionConfig = { label: "Order Details", icon: Eye, colorClass: "text-blue-600 hover:bg-blue-50", onClick: (id, m) => m.openInvoice(id) };

export const ORDER_STATUS_VIEWS: Readonly<Record<OrderStatus, OrderPageConfig>> = {
    Pending: {
        title: "Pending Orders",
        targetStatus: "Pending",
        emptyStateMessage: "No pending orders at this time.",
        actions: [
            details,
            { label: "Confirm Order", icon: CheckCircle, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Confirmed") },
            { label: "Cancel Order", icon: XCircle, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => m.changeStatus(id, "Rejected") },
        ],
    },
    Hold: {
        title: "Hold Orders",
        targetStatus: "Hold",
        emptyStateMessage: "No orders are currently on hold.",
        actions: [
            details,
            { label: "Resume Order", icon: RefreshCcw, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Pending") },
            { label: "Cancel Order", icon: XCircle, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => m.changeStatus(id, "Rejected") },
        ],
    },
    Confirmed: {
        title: "Confirm Orders",
        targetStatus: "Confirmed",
        emptyStateMessage: "No orders are waiting for confirmation.",
        actions: [
            details,
            { label: "Approve", icon: CheckCircle, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Approved") },
            { label: "Cancel", icon: XCircle, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => m.changeStatus(id, "Rejected") },
        ],
    },
    Approved: {
        title: "Approve Orders",
        targetStatus: "Approved",
        emptyStateMessage: "No approved orders waiting for processing.",
        actions: [
            details,
            { label: "Send to Processing", icon: PackageSearch, colorClass: "text-amber-600 hover:bg-amber-50", onClick: (id, m) => m.changeStatus(id, "Processing") },
            { label: "Direct Complete", icon: CheckCheck, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Complete") },
        ],
    },
    Processing: {
        title: "Processing Orders",
        targetStatus: "Processing",
        emptyStateMessage: "No orders are currently processing.",
        actions: [
            details,
            { label: "Send OnWay", icon: Truck, colorClass: "text-amber-600 hover:bg-amber-50", onClick: (id, m) => m.changeStatus(id, "Onway") },
            { label: "Mark Complete", icon: CheckCheck, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Complete") },
        ],
    },
    Onway: {
        title: "Onway Orders",
        targetStatus: "Onway",
        emptyStateMessage: "No orders are currently out for delivery.",
        actions: [
            details,
            { label: "Delivery Complete", icon: CheckCheck, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Complete") },
            { label: "Customer Returned", icon: Undo2, colorClass: "text-orange-600 hover:bg-orange-50", onClick: (id, m) => m.changeStatus(id, "Return") },
        ],
    },
    Return: {
        title: "Return Orders",
        targetStatus: "Return",
        emptyStateMessage: "No returned orders to process.",
        actions: [
            details,
            { label: "Restock & Archive", icon: ArchiveRestore, colorClass: "text-emerald-600 hover:bg-emerald-50", onClick: (id, m) => m.changeStatus(id, "Rejected") },
        ],
    },
    Complete: {
        title: "Complete Orders",
        targetStatus: "Complete",
        emptyStateMessage: "No completed orders found.",
        actions: [
            details,
            { label: "Revert to Return", icon: Undo2, colorClass: "text-orange-600 hover:bg-orange-50", onClick: (id, m) => m.changeStatus(id, "Return") },
        ],
    },
    Rejected: {
        title: "Rejected Orders",
        targetStatus: "Rejected",
        emptyStateMessage: "No rejected orders found.",
        actions: [
            details,
            // Was an alert() placeholder; now deletes after a confirmation.
            { label: "Delete Permanently", icon: Trash2, colorClass: "text-red-600 hover:bg-red-50", onClick: (id, m) => m.requestDelete(id) },
        ],
    },
};
