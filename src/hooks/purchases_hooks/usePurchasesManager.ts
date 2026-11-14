"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseListTotal, PurchaseRow } from "@/types/purchases";
import { computePurchaseTotals, countItems, sumTaka } from "@/utils/purchaseMath";

const DEFAULT_COLUMNS = {
    supplier: true,
    warehouse: true,
    date: true,
    invoiceNumber: true,
    totalItem: true,
    totalAmount: true,
    createdBy: true,
};

const matchesPurchase = (item: PurchaseRow, query: string): boolean => {
    const q = query.toLowerCase();
    return item.supplier.toLowerCase().includes(q) || item.invoiceNumber.toLowerCase().includes(q);
};

export function usePurchasesManager() {
    const { openView } = useCommandParams();
    const purchases = useGlobalPurchasesStore((state) => state.purchases);
    const deletePurchases = useGlobalPurchasesStore((state) => state.deletePurchases);

    // Item count and amount are always derived from the invoice lines (Subtotal - Discount + Tax + Shipping).
    const rows = useMemo<PurchaseRow[]>(
        () => purchases.map((purchase) => ({
            ...purchase,
            totalItem: countItems(purchase.items),
            totalAmount: computePurchaseTotals(purchase.items, purchase.costing).total,
        })),
        [purchases]
    );

    const table = useListControls(rows, matchesPurchase);

    /** Single footer Total over the rows currently listed (no Grand Total). */
    const listTotal = useMemo<PurchaseListTotal>(() => ({
        totalItem: table.filteredData.reduce((sum, row) => sum + row.totalItem, 0),
        totalAmount: sumTaka(table.filteredData.map((row) => row.totalAmount)),
    }), [table.filteredData]);

    const [cols, setCols] = useState(DEFAULT_COLUMNS);
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols(DEFAULT_COLUMNS);

    const handleView = (id: string) => openView("drawer", "view-purchase", id);
    const handleEdit = (id: string) => openView("drawer", "edit-purchase", id);

    const handleDelete = (id: string) => {
        deletePurchases([id]);
        table.setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        toast.success("Purchase record deleted successfully");
    };

    const handleBulkDelete = () => {
        const count = table.selectedIds.length;
        deletePurchases(table.selectedIds);
        table.clearSelection();
        toast.success(`${count} purchase records deleted`);
    };

    return {
        table,
        listTotal,
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        handleView,
        handleEdit,
        handleDelete,
        handleBulkDelete,
    };
}
