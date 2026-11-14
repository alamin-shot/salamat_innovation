import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { SaleReturnRow } from "@/types/sales";
import { computeSaleReturnTotals } from "@/utils/salesMath";

const matches = (row: SaleReturnRow, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.customerName, row.returnNumber, row.date].some((text) => text.toLowerCase().includes(q))
        || row.items.some((item) => item.serial.toLowerCase().includes(q) || (item.saleInvoice ?? "").toLowerCase().includes(q));
};

/** Sale Return list: store-backed rows, search, selection, view / edit drawers and delete. */
export function useSaleReturnsListManager() {
    const saleReturns = useGlobalSalesStore((state) => state.saleReturns);
    const deleteSaleReturns = useGlobalSalesStore((state) => state.deleteSaleReturns);
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    const rows = useMemo<SaleReturnRow[]>(() => saleReturns.map((record) => ({ ...record, totals: computeSaleReturnTotals(record) })), [saleReturns]);
    const table = useListControls(rows, matches);

    const isViewOpen = activeDrawer === "view-return" && !!activeId;
    const isEditOpen = activeDrawer === "edit-return" && !!activeId;
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);
    const editId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    const { setSelectedIds } = table;
    const handleDelete = useCallback((id: string) => {
        deleteSaleReturns([id]);
        setSelectedIds((prev) => prev.filter((selected) => selected !== id));
        toast.success("Sale return deleted.");
    }, [deleteSaleReturns, setSelectedIds]);

    const handleBulkDelete = () => {
        const count = table.selectedIds.length;
        deleteSaleReturns(table.selectedIds);
        table.clearSelection();
        toast.success(`${count} sale return(s) deleted.`);
    };

    return {
        table,
        isViewOpen, isEditOpen,
        viewed: rows.find((row) => row.id === viewId) ?? null,
        editing: saleReturns.find((record) => record.id === editId) ?? null,
        openView: (id: string) => openView("drawer", "view-return", id),
        openEdit: (id: string) => openView("drawer", "edit-return", id),
        closeView,
        handleDelete,
        handleBulkDelete,
    };
}

export type SaleReturnsListManager = ReturnType<typeof useSaleReturnsListManager>;
