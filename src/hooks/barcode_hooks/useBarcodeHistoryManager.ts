"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export interface HistoryItem {
    id: string;
    productName: string;
    variant: string;
    image: string;
    serialNumber: string;
    salePrice: number | null;
    purchasePrice: number | null;
    entityName: string;
    entityType: "Supplier" | "Customer";
    warehouse: string;
    transactionType: "Purchase" | "Sale";
    date: string;
}

const MOCK_HISTORY: HistoryItem[] = [
    { id: "1", productName: "Nothing Phone 4a", variant: "White/8GB/128GB", image: "/phone.png", serialNumber: "357054044466206", salePrice: null, purchasePrice: 47400.00, entityName: "Image Collection", entityType: "Supplier", warehouse: "A-Block", transactionType: "Purchase", date: "10/4/2026, 3:32:19 PM" },
    { id: "2", productName: "Nothing Phone 4a", variant: "White/8GB/128GB", image: "/phone.png", serialNumber: "357054044466206", salePrice: 48500.00, purchasePrice: null, entityName: "Ratul Shikder", entityType: "Customer", warehouse: "A-Block", transactionType: "Sale", date: "10/4/2026, 3:45:19 PM" },
    { id: "3", productName: "Redmi 15", variant: "Midnight Black/8GB/256GB", image: "/phone.png", serialNumber: "865013000353040", salePrice: null, purchasePrice: 23500.00, entityName: "Cell Tech BD", entityType: "Supplier", warehouse: "A-Block", transactionType: "Purchase", date: "10/4/2026, 2:38:13 PM" },
    { id: "4", productName: "Redmi 15", variant: "Midnight Black/8GB/256GB", image: "/phone.png", serialNumber: "865013000353040", salePrice: 25500.00, purchasePrice: null, entityName: "Mintu Talukder", entityType: "Customer", warehouse: "A-Block", transactionType: "Sale", date: "10/4/2026, 2:40:13 PM" },
    { id: "5", productName: "Kieslect Health Tracker", variant: "Black", image: "/phone.png", serialNumber: "K403H7AN30068", salePrice: null, purchasePrice: 4700.00, entityName: "Taham Tech", entityType: "Supplier", warehouse: "A-Block", transactionType: "Purchase", date: "10/4/2026, 5:48:22 PM" },
];

export function useBarcodeHistoryManager() {
    const { openView } = useCommandParams();

    // Initialize universal table manager with search targeting product, serial, and entity names
    const table = useTableManager(MOCK_HISTORY, (item, query) =>
        item.productName.toLowerCase().includes(query.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(query.toLowerCase()) ||
        item.entityName.toLowerCase().includes(query.toLowerCase())
    );

    // Column Visibility State matching the History table structure
    const [cols, setCols] = useState({
        productName: true,
        serialNumber: true,
        pricing: true,
        entity: true,
        status: true,
    });
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    const toggleColumn = (key: keyof typeof cols) => setCols(prev => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ productName: true, serialNumber: true, pricing: true, entity: true, status: true });

    // Drawer Triggers
    const handleView = (id: string) => openView("drawer", "view-history", id);
    const handleEdit = (id: string) => openView("drawer", "edit-history", id);

    // Delete Logic
    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(item => item.id !== id));
        toast.success("History log deleted successfully");
    };

    const handleBulkDelete = () => {
        table.setData(prev => prev.filter(item => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success(`${table.selectedIds.length} logs deleted`);
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