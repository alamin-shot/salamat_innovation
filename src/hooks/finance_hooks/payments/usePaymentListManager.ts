import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useListControls } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useRetainedValue } from "@/hooks/products_hooks/useRetainedValue";
import { useGlobalPaymentsStore } from "@/store/useGlobalPaymentsStore";
import { PaymentListFilters, PaymentListRow } from "@/types/payments";
import { SectionFilterOption } from "@/types/ui";
import { EMPTY_PAYMENT_FILTERS } from "@/constants/payments";
import { activePaymentFilterCount, matchesPaymentFilters, paymentPartyKey, toPaymentListRow } from "@/utils/paymentRules";
import { toTimestamp } from "@/utils/dateRules";

const matchesSearch = (row: PaymentListRow, query: string): boolean => {
    const q = query.toLowerCase();
    return [row.contact, row.number, row.businessName, row.invoiceRef ?? "", row.method].some((text) => text.toLowerCase().includes(q));
};

const COLUMNS = {
    contact: true,
    businessName: true,
    businessLogo: true,
    date: true,
    invoiceNumber: true,
    type: true,
    debit: true,
    credit: true,
};

/** Payment List: every Payment record (the ledger's only payment source), filtered by type, party, date and amount. */
export function usePaymentListManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const payments = useGlobalPaymentsStore((state) => state.payments);
    const deletePayments = useGlobalPaymentsStore((state) => state.deletePayments);

    const [filters, setFilters] = useState<PaymentListFilters>(EMPTY_PAYMENT_FILTERS);

    const allRows = useMemo(
        () => [...payments].sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date)).map(toPaymentListRow),
        [payments]
    );
    const rows = useMemo(() => allRows.filter((row) => matchesPaymentFilters(row, filters)), [allRows, filters]);
    const table = useListControls(rows, matchesSearch);

    /** Any filter change starts again from page 1. */
    const setFilter = <K extends keyof PaymentListFilters>(key: K, value: PaymentListFilters[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        table.setCurrentPage(1);
    };

    /** One option per party that has a payment (People profile, or the legacy name when unlinked). */
    const partyOptions = useMemo<SectionFilterOption[]>(() => {
        const seen = new Map<string, string>();
        allRows.forEach((row) => { if (!seen.has(paymentPartyKey(row))) seen.set(paymentPartyKey(row), row.contact); });
        return Array.from(seen, ([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
    }, [allRows]);

    const isVoucherOpen = activeDrawer === "view-voucher" && !!activeId;
    const voucherId = useRetainedValue(isVoucherOpen ? activeId : null, isVoucherOpen);
    const activeVoucherRecord = allRows.find((row) => row.id === voucherId) ?? null;

    const [cols, setCols] = useState(COLUMNS);
    const toggleColumn = (key: string) => {
        if (key in COLUMNS) setCols((prev) => ({ ...prev, [key]: !prev[key as keyof typeof COLUMNS] }));
    };
    const showAllColumns = () => setCols(COLUMNS);

    const { setSelectedIds } = table;
    const handleDelete = useCallback((id: string) => {
        deletePayments([id]);
        setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Payment record deleted.");
    }, [deletePayments, setSelectedIds]);

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        const count = table.selectedIds.length;
        deletePayments(table.selectedIds);
        table.clearSelection();
        toast.success(`${count} payment record(s) deleted.`);
    };

    return {
        table,
        cols,
        toggleColumn,
        showAllColumns,
        filters,
        setFilter,
        clearFilters: () => { setFilters(EMPTY_PAYMENT_FILTERS); table.setSearchQuery(""); table.setCurrentPage(1); },
        activeFilterCount: activePaymentFilterCount(filters),
        partyOptions,
        isVoucherOpen,
        activeVoucherRecord,
        handleViewVoucher: (id: string) => openView("drawer", "view-voucher", id),
        closeView,
        handleDelete,
        handleBulkDelete,
    };
}

export type PaymentListManagerType = ReturnType<typeof usePaymentListManager>;
