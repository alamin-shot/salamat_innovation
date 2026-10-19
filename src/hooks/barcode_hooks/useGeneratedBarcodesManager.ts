"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useTableManager } from "@/hooks/shared_hooks/useTableManager";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export interface GeneratedBarcode {
    id: string;
    productName: string;
    variant: string;
    image: string;
    serialNumber: string;
    mrp: number;
    warehouse: string;
    generatedBy: string;
}

const MOCK_GENERATED: GeneratedBarcode[] = [
    { id: "1", productName: "VOLTME Revo 140W", variant: "Black", image: "/phone.png", serialNumber: "S/N:V2&7510D43&00&A", mrp: 6500.00, warehouse: "-", generatedBy: "-" },
    { id: "2", productName: "VOLTME Revo 140W", variant: "Black", image: "/phone.png", serialNumber: "S/N:V207510D43000NX", mrp: 6500.00, warehouse: "-", generatedBy: "-" },
    { id: "3", productName: "Redmi Turbo 4 Pro", variant: "White/12GB/256GB", image: "/phone.png", serialNumber: "865066060847547", mrp: 42000.00, warehouse: "A-Block", generatedBy: "Md Zihadul Islam Sazzad" },
];

export function useGeneratedBarcodesManager() {
    const { openView } = useCommandParams();

    const table = useTableManager(MOCK_GENERATED, (item, query) =>
        item.productName.toLowerCase().includes(query.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(query.toLowerCase())
    );

    const [cols, setCols] = useState({
        productName: true,
        serialNumber: true,
        mrp: true,
        warehouse: true,
        generatedBy: true,
    });
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);

    const toggleColumn = (key: keyof typeof cols) => setCols(prev => ({ ...prev, [key]: !prev[key] }));
    const showAllColumns = () => setCols({ productName: true, serialNumber: true, mrp: true, warehouse: true, generatedBy: true });

    // Using your exact useCommandParams structure
    const handleView = (id: string) => openView("drawer", "view-barcode", id);
    const handleEdit = (id: string) => openView("drawer", "edit-barcode", id);

    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(item => item.id !== id));
        toast.success("Barcode deleted successfully");
    };

    const handleBulkDelete = () => {
        table.setData(prev => prev.filter(item => !table.selectedIds.includes(item.id)));
        table.clearSelection();
        toast.success(`${table.selectedIds.length} barcodes deleted`);
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