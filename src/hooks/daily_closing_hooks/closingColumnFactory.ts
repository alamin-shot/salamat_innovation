import { ClosingTabKey } from "./useClosingManager";

export interface ClosingColumnDef {
    id: string;
    label: string;
    type?: "text" | "currency" | "status" | "badge";
}

export function getClosingColumns(tab: ClosingTabKey): ClosingColumnDef[] {
    const baseColumns: ClosingColumnDef[] = [
        { id: "invoiceNumber", label: "Invoice / Ref" }
    ];

    // Dynamically inject the "Party" alias based on the ledger
    if (tab === "sale" || tab === "sale_return") {
        baseColumns.push({ id: "party", label: "Customer" });
    } else if (tab === "purchase" || tab === "purchase_return") {
        baseColumns.push({ id: "party", label: "Supplier" });
    } else {
        baseColumns.push({ id: "party", label: "Party" });
    }

    baseColumns.push(
        { id: "sellerOrCreator", label: "Created By" },
        { id: "paymentMethod", label: "Method", type: "badge" },
        { id: "total", label: "Total", type: "currency" },
        { id: "paidAmount", label: "Paid", type: "currency" },
        { id: "dueAmount", label: "Due", type: "currency" },
        { id: "status", label: "Status", type: "status" }
    );

    return baseColumns;
}