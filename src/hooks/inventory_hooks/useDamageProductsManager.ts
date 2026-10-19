"use client";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export interface DamageProductRecord {
    id: string;
    ref: string;
    shop: string;
    date: string;
    createdAt: string;
    items: number;
    status: "Draft" | "Approved" | "Cancelled";
}

const initialDamageProducts: DamageProductRecord[] = [
    { id: "2", ref: "DMG-000002", shop: "A-Block", date: "2026-10-13", createdAt: "13-Oct-2026 01:11 PM", items: 2, status: "Draft" },
    { id: "1", ref: "DMG-000001", shop: "A-Block", date: "2026-09-28", createdAt: "28-Sep-2026 05:53 PM", items: 1, status: "Draft" },
];

export function useDamageProductsManager() {
    const { openView } = useCommandParams();

    const filterFn = useCallback((item: DamageProductRecord, query: string) => {
        const lower = query.toLowerCase();
        return (
            item.ref.toLowerCase().includes(lower) ||
            item.shop.toLowerCase().includes(lower) ||
            item.status.toLowerCase().includes(lower) ||
            item.date.toLowerCase().includes(lower)
        );
    }, []);

    const table = useTableManager<DamageProductRecord>(initialDamageProducts, filterFn);

    // Column Visibility State (matching PurchasesTable pattern)
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        ref: true,
        shop: true,
        date: true,
        createdAt: true,
        items: true,
        status: true,
    });

    const toggleColumn = (key: keyof typeof cols) => {
        setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const showAllColumns = () => {
        setCols({
            ref: true,
            shop: true,
            date: true,
            createdAt: true,
            items: true,
            status: true,
        });
    };

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.max(1, Math.ceil(table.filteredData.length / itemsPerPage));

    // Drawer Navigation Actions
    const handleView = (id: string) => {
        openView("drawer", "view-damage-product", id);
    };

    const handleCreate = () => {
        openView("drawer", "create-damage-product", undefined);
    };



    // Row & Bulk Actions
    const handleDelete = (id: string) => {
        table.setData((prev) => prev.filter((item) => item.id !== id));
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Damage record deleted successfully.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        table.setData((prev) => prev.filter((item) => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success("Selected damage records deleted.");
    };

    const handleStatusChange = (id: string, newStatus: "Draft" | "Approved" | "Cancelled") => {
        table.setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        toast.success(`Damage record status updated to ${newStatus}.`);
    };

    return {
        table: {
            ...table,
            paginatedData,
        },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        handleView,
        handleCreate,
        handleDelete,
        handleBulkDelete,
        handleStatusChange,
    };
}