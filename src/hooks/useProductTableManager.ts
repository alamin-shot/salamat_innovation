"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useDataTable } from "@/hooks/useDataTable";
import { ProductExtended } from "@/components/features/products/ProductTable";

type ModalType = "warranty" | "variants" | "specs" | "care";

export function useProductTableManager(initialData: ProductExtended[]) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = React.useState<ProductExtended[]>(initialData);

    const { data, searchQuery, setSearchQuery, sortKey, sortDirection, handleSort } =
        useDataTable<ProductExtended>(products, ["name", "category", "brand"]);

    const [selectedStatus, setSelectedStatus] = React.useState<string>("");
    const [selectedBrand, setSelectedBrand] = React.useState<string>("");
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = React.useState<{ type: ModalType; id: string } | null>(null);

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
        name: true, category: true, brand: true, tags: true, status: true, ecommerce: true,
        variants: false, specs: false, care: false, warranty: true, createdAt: true,
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedRows(new Set(data.map(p => p.id)));
        else setSelectedRows(new Set());
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedRows);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedRows(newSet);
    };

    const updateProductField = (id: string, field: keyof ProductExtended, value: any) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        toast.success(`Product updated successfully.`);
    };

    const handleToggleColumn = (key: string) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));

    const handleResetColumns = () => setVisibleColumns({
        name: true, category: true, brand: true, tags: true, status: true, ecommerce: true,
        variants: false, specs: false, care: false, warranty: true, createdAt: true,
    });

    const handleBulkAction = (actionName: string) => {
        toast.success(`${actionName} applied to ${selectedRows.size} products.`);
        setSelectedRows(new Set());
    };

    const handleAdvancedEdit = () => {
        if (!activeModal) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", "edit");
        params.set("tab", activeModal.type);
        params.set("id", activeModal.id);
        setActiveModal(null);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getModalTitle = () => {
        if (!activeModal) return "";
        switch (activeModal.type) {
            case "warranty": return "Warranty Details";
            case "variants": return "Product Variants";
            case "specs": return "Specifications";
            case "care": return "Care Instructions";
        }
    };

    return {
        data,
        searchQuery,
        setSearchQuery,
        sortKey,
        sortDirection,
        handleSort,
        selectedStatus,
        setSelectedStatus,
        selectedBrand,
        setSelectedBrand,
        selectedRows,
        setSelectedRows,
        activeModal,
        setActiveModal,
        visibleColumns,
        handleSelectAll,
        handleSelectRow,
        updateProductField,
        handleToggleColumn,
        handleResetColumns,
        handleBulkAction,
        handleAdvancedEdit,
        getModalTitle
    };
}