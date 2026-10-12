"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/useTableManager";
import { useCommandParams } from "@/hooks/useCommandParams";

export interface PurchaseItem {
    id: string;
    supplier: string;
    supplierInitials: string;
    badgeColor: string;
    warehouse: string;
    date: string;
    invoiceNumber: string;
    totalItem: number;
    totalAmount: number;
    createdBy: string;
}

const MOCK_PURCHASES: PurchaseItem[] = [
    { id: "1", supplier: "Rasel Raj", supplierInitials: "RR", badgeColor: "bg-emerald-600", warehouse: "A-Block", date: "2026-10-11", invoiceNumber: "PP-001603", totalItem: 1, totalAmount: 82000.00, createdBy: "Md Zihadul Islam Sazzad" },
    { id: "2", supplier: "Bina Ambix", supplierInitials: "B", badgeColor: "bg-emerald-700", warehouse: "A-Block", date: "2026-10-10", invoiceNumber: "PP-001602", totalItem: 1, totalAmount: 60000.00, createdBy: "Md Zihadul Islam Sazzad" },
    { id: "3", supplier: "Gadget Opia", supplierInitials: "GO", badgeColor: "bg-gray-900", warehouse: "A-Block", date: "2026-10-10", invoiceNumber: "PP-001601", totalItem: 1, totalAmount: 13000.00, createdBy: "Md Zihadul Islam Sazzad" },
    { id: "4", supplier: "huge Collection", supplierInitials: "HC", badgeColor: "bg-emerald-500", warehouse: "A-Block", date: "2026-10-09", invoiceNumber: "PP-001599", totalItem: 1, totalAmount: 47400.00, createdBy: "Md Zihadul Islam Sazzad" },
    { id: "5", supplier: "Cell Tech BD", supplierInitials: "CB", badgeColor: "bg-emerald-600", warehouse: "A-Block", date: "2026-10-09", invoiceNumber: "PP-001598", totalItem: 1, totalAmount: 23000.00, createdBy: "Md Zihadul Islam Sazzad" },
];

export function usePurchasesManager() {
    const { openView } = useCommandParams();

    const table = useTableManager(MOCK_PURCHASES, (item, query) =>
        item.supplier.toLowerCase().includes(query.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(query.toLowerCase())
    );

    const [cols, setCols] = useState({
        supplier: true,
        warehouse: true,
        date: true,
        invoiceNumber: true,
        totalItem: true,
        totalAmount: true,
        createdBy: true,
    });
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    const toggleColumn = (key: keyof typeof cols) => setCols(prev => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ supplier: true, warehouse: true, date: true, invoiceNumber: true, totalItem: true, totalAmount: true, createdBy: true });

    // Correctly wired to URL drawers
    const handleView = (id: string) => openView("drawer", "view-purchase", id);
    const handleEdit = (id: string) => openView("drawer", "edit-purchase", id);

    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(item => item.id !== id));
        toast.success("Purchase record deleted successfully");
    };

    const handleBulkDelete = () => {
        table.setData(prev => prev.filter(item => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success(`${table.selectedIds.length} purchase records deleted`);
    };

    return {
        table,
        cols,
        showColumnsMenu,
        setShowColumnsMenu,
        toggleColumn,
        showAllColumns,
        handleView,
        handleEdit,
        handleDelete,
        handleBulkDelete
    };
}