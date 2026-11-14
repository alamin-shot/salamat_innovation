import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useGlobalPurchasesStore } from "@/store/useGlobalPurchasesStore";
import { PurchaseReturnListTotal, PurchaseReturnRow } from "@/types/purchases";
import { PURCHASE_FORM_ERRORS } from "@/constants/purchases";
import { canEditReturn, computePurchaseTotals, countItems, sumTaka } from "@/utils/purchaseMath";

const matchesReturn = (item: PurchaseReturnRow, query: string): boolean => {
    const q = query.toLowerCase();
    return item.supplier.toLowerCase().includes(q)
        || item.company.toLowerCase().includes(q)
        || item.invoiceNumber.toLowerCase().includes(q);
};

/** Purchase Return list. Paid Amount and Status no longer exist; Due Amount drives the edit lock. */
export function usePurchaseReturnsManager() {
    const { openView } = useCommandParams();
    const purchaseReturns = useGlobalPurchasesStore((state) => state.purchaseReturns);
    const deletePurchaseReturns = useGlobalPurchasesStore((state) => state.deletePurchaseReturns);

    const rows = useMemo<PurchaseReturnRow[]>(
        () => purchaseReturns.map((record) => ({
            ...record,
            totalItem: countItems(record.items),
            totalAmount: computePurchaseTotals(record.items, record.costing).total,
            canEdit: canEditReturn(record.dueAmount),
        })),
        [purchaseReturns]
    );

    const table = useListControls(rows, matchesReturn);

    const listTotal = useMemo<PurchaseReturnListTotal>(() => ({
        totalItem: table.filteredData.reduce((sum, row) => sum + row.totalItem, 0),
        totalAmount: sumTaka(table.filteredData.map((row) => row.totalAmount)),
        dueAmount: sumTaka(table.filteredData.map((row) => row.dueAmount)),
    }), [table.filteredData]);

    // Stable handlers so the memoised rows re-render only when their own data changes.
    const handleView = useCallback((id: string) => openView("drawer", "view-return", id), [openView]);

    /** Opens the editor only while the return still has a due. */
    const handleEdit = useCallback((row: PurchaseReturnRow) => {
        if (!row.canEdit) {
            toast.error(PURCHASE_FORM_ERRORS.return_locked);
            return;
        }
        openView("drawer", "edit-return", row.id);
    }, [openView]);

    const { setSelectedIds } = table;
    const handleDelete = useCallback((id: string) => {
        deletePurchaseReturns([id]);
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        toast.success("Purchase return deleted successfully");
    }, [deletePurchaseReturns, setSelectedIds]);

    return { table, listTotal, handleView, handleEdit, handleDelete };
}
