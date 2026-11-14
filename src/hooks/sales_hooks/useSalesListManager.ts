import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useGlobalSalesStore } from "@/store/useGlobalSalesStore";
import { SaleRow } from "@/types/sales";
import { computeSaleTotals, salePaymentStatus } from "@/utils/salesMath";
import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { invoicePaymentLines } from "@/utils/paymentRules";

const matches = (row: SaleRow, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.customerName, row.invoiceNumber, row.seller, row.date].some((text) => text.toLowerCase().includes(q));
};

/** Sale List: store-backed rows, search, selection, drawers and the seller / courier / delete actions. */
export function useSalesListManager() {
    const sales = useGlobalSalesStore((state) => state.sales);
    const deleteSales = useGlobalSalesStore((state) => state.deleteSales);
    const setSaleCourier = useGlobalSalesStore((state) => state.setSaleCourier);
    const setSaleSeller = useGlobalSalesStore((state) => state.setSaleSeller);
    const records = useGlobalPaymentsStore((state) => state.payments);
    const deleteInvoicePayments = useGlobalPaymentsStore((state) => state.deleteInvoicePayments);
    const { activeDrawer, activeModal, activeId, openView, closeView } = useCommandParams();

    // Paid / due come from the Payment records that reference each invoice.
    const rows = useMemo<SaleRow[]>(() => sales.map((sale) => {
        const payments = invoicePaymentLines(records, sale.invoiceNumber);
        const totals = computeSaleTotals({ ...sale, payments });
        const methods = Array.from(new Set(payments.map((payment) => payment.method).filter((method) => method && method !== "-")));
        return { ...sale, payments, totals, status: salePaymentStatus(totals), paymentMethods: methods.join(", ") || "—" };
    }), [sales, records]);

    const table = useListControls(rows, matches);

    const isViewOpen = activeDrawer === "view-sale" && !!activeId;
    const isEditOpen = activeDrawer === "edit-sale" && !!activeId;
    const viewId = useRetainedValue(isViewOpen ? activeId : null, isViewOpen);
    const editId = useRetainedValue(isEditOpen ? activeId : null, isEditOpen);

    const { setSelectedIds } = table;
    /** A deleted sale takes the payments it posted with it. */
    const removeSales = useCallback((ids: string[]) => {
        deleteInvoicePayments(sales.filter((sale) => ids.includes(sale.id)).map((sale) => sale.invoiceNumber));
        deleteSales(ids);
    }, [sales, deleteSales, deleteInvoicePayments]);

    const handleDelete = useCallback((id: string) => {
        removeSales([id]);
        setSelectedIds((prev) => prev.filter((selected) => selected !== id));
        toast.success("Sale deleted.");
    }, [removeSales, setSelectedIds]);

    const handleBulkDelete = () => {
        const count = table.selectedIds.length;
        removeSales(table.selectedIds);
        table.clearSelection();
        toast.success(`${count} sale(s) deleted.`);
    };

    const handleSellerSave = (saleId: string, seller: string) => {
        setSaleSeller(saleId, seller);
        toast.success("Seller updated.");
        closeView();
    };

    return {
        table,
        isViewOpen, isEditOpen,
        viewed: rows.find((row) => row.id === viewId) ?? null,
        editing: rows.find((row) => row.id === editId) ?? null,
        isSellerModalOpen: activeModal === "update-seller",
        sellerModalSaleId: activeModal === "update-seller" ? activeId : null,
        openView: (id: string) => openView("drawer", "view-sale", id),
        openEdit: (id: string) => openView("drawer", "edit-sale", id),
        openSellerModal: (id: string) => openView("modal", "update-seller", id),
        closeView,
        handleDelete,
        handleBulkDelete,
        handleSellerSave,
        setCourier: setSaleCourier,
    };
}

export type SalesListManager = ReturnType<typeof useSalesListManager>;
