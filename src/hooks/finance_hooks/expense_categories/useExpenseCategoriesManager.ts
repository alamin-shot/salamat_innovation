"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { useExpenseCategoryStore, ExpenseCategory } from "@/hooks/finance_hooks/expense_categories/useExpenseCategoryStore";

export function useExpenseCategoriesManager() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();
    const { categories, deleteCategory, bulkDeleteCategories } = useExpenseCategoryStore();

    const [retainedEditId, setRetainedEditId] = useState<string | null>(null);

    useEffect(() => {
        if (activeDrawer === "edit-expense-category" && activeId) {
            setRetainedEditId(activeId);
        }
    }, [activeDrawer, activeId]);

    const filterFn = useCallback((item: ExpenseCategory, query: string) => {
        return item.name.toLowerCase().includes(query.toLowerCase());
    }, []);

    const table = useTableManager<ExpenseCategory>(categories, filterFn);

    useEffect(() => {
        table.setData(categories);
    }, [categories]);

    const activeEditRecord = useMemo(
        () => categories.find((c) => c.id === retainedEditId) || null,
        [categories, retainedEditId]
    );

    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [cols, setCols] = useState({
        name: true,
        logo: true,
        totalCount: true,
    });

    const toggleColumn = (key: keyof typeof cols) => setCols((prev) => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ name: true, logo: true, totalCount: true });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return table.filteredData.slice(start, start + itemsPerPage);
    }, [table.filteredData, currentPage, itemsPerPage]);

    const handleEdit = (id: string) => openView("drawer", "edit-expense-category", id);

    const handleDelete = (id: string) => {
        deleteCategory(id);
        table.setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("Category deleted.");
    };

    const handleBulkDelete = () => {
        if (table.selectedIds.length === 0) return;
        bulkDeleteCategories(table.selectedIds);
        table.clearSelection();
        toast.success("Selected categories deleted.");
    };

    return {
        activeDrawer,
        closeView,
        retainedEditId,
        activeEditRecord,
        table: { ...table, paginatedData },
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        handleEdit,
        handleDelete,
        handleBulkDelete,
    };
}