"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2, CheckCircle2, PackageX } from "lucide-react";
import { toast } from "sonner";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { UsedProductRow } from "./UsedProductRow";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";

interface UsedProductTableProps {
    manager: ProductsManager<"used_products">;
}

const DEFAULT_COLUMNS: Record<string, boolean> = {
    name: true, variant: true, price: true, serialNumber: true, carePlan: true, isSold: true, status: true, ecommerce: true, audit: true
};

export function UsedProductTable({ manager }: UsedProductTableProps) {
    const { toggleSelection, handleSetStatus, handleToggleEcommerce, handleDelete, openDrawer, setQuickView, store, sortKey, sortDirection, handleSort } = manager;

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(DEFAULT_COLUMNS);

    const handleToggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleResetColumns = () => setVisibleColumns(DEFAULT_COLUMNS);

    const handleSetSold = React.useCallback((id: string, isSold: boolean) => {
        store.updateUsedProduct(id, { isSold });
        toast.success(`Product marked as ${isSold ? 'Sold' : 'Available'}.`);
    }, [store]);

    const handleBulkSold = (isSold: boolean) => {
        manager.selectedIds.forEach((id) => store.updateUsedProduct(id, { isSold }));
        toast.success(`${isSold ? "Marked Sold" : "Marked Available"} applied to ${manager.selectedIds.length} products.`);
        manager.clearSelection();
    };

    const handleOpenPrice = React.useCallback((id: string) => setQuickView({ type: "price", id }), [setQuickView]);
    const handleOpenCare = React.useCallback((id: string) => setQuickView({ type: "care", id }), [setQuickView]);
    const handlePreview = React.useCallback((id: string) => openDrawer("drawer", "preview", id), [openDrawer]);
    const handleEdit = React.useCallback((id: string) => openDrawer("drawer", "edit-used", id), [openDrawer]);
    const handleDeleteOne = React.useCallback((id: string) => handleDelete([id]), [handleDelete]);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-brand-subtext/20 bg-white">
                <div className="w-full overflow-x-auto custom-scrollbar">
                    <ProductsFilterBar manager={manager} />
                </div>
                <div className="w-full lg:w-auto flex lg:justify-end shrink-0 px-4 pb-3 pt-0 lg:px-4 lg:py-3">
                    <ColumnsVisibilityDropdown
                        columns={[
                            { key: "name", label: "Product Name" },
                            { key: "variant", label: "Variant" },
                            { key: "price", label: "Price" },
                            { key: "serialNumber", label: "Serial Number" },
                            { key: "carePlan", label: "Care Plan" },
                            { key: "isSold", label: "Is Sold" },
                            { key: "status", label: "Status" },
                            { key: "ecommerce", label: "Ecommerce" },
                            { key: "audit", label: "Created By / At" },
                        ]}
                        visibleColumns={visibleColumns}
                        onToggleColumn={handleToggleColumn}
                        onReset={handleResetColumns}
                    />
                </div>
            </div>

            <div className="overflow-x-auto mt-0">
                {manager.activeTabData.length === 0 ? (
                    <ProductsEmptyState title="No used products found" subtitle="Add a used product or adjust your search and filters to see results here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-[48px] px-4">
                                <div className="flex items-center justify-center">
                                    <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-emerald-600 focus:ring-emerald-600" onChange={() => toggleSelection("ALL")} checked={manager.isAllSelected} />
                                </div>
                            </TableHeadCell>
                            {visibleColumns.name !== false && <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>Name</TableHeadCell>}
                            {visibleColumns.variant !== false && <TableHeadCell sortable activeDirection={sortKey === "variant" ? sortDirection : null} onClick={() => handleSort("variant")}>Variant</TableHeadCell>}
                            {visibleColumns.price !== false && <TableHeadCell sortable activeDirection={sortKey === "sellingPrice" ? sortDirection : null} onClick={() => handleSort("sellingPrice")}>Price</TableHeadCell>}
                            {visibleColumns.serialNumber !== false && <TableHeadCell sortable activeDirection={sortKey === "serialNumber" ? sortDirection : null} onClick={() => handleSort("serialNumber")}>Serial Number</TableHeadCell>}
                            {visibleColumns.carePlan !== false && <TableHeadCell>Care Plan</TableHeadCell>}
                            {visibleColumns.isSold !== false && <TableHeadCell>Is Sold</TableHeadCell>}
                            {visibleColumns.status !== false && <TableHeadCell>Status</TableHeadCell>}
                            {visibleColumns.ecommerce !== false && <TableHeadCell>Ecommerce</TableHeadCell>}
                            {visibleColumns.audit !== false && <AuditHeadCells />}
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((product) => (
                                <UsedProductRow
                                    key={product.id}
                                    product={product}
                                    isSelected={manager.selectedIds.includes(product.id)}
                                    visibleColumns={visibleColumns}
                                    onToggleSelect={toggleSelection}
                                    onSetStatus={handleSetStatus}
                                    onToggleEcommerce={handleToggleEcommerce}
                                    onSetSold={handleSetSold}
                                    onOpenPrice={handleOpenPrice}
                                    onOpenCare={handleOpenCare}
                                    onPreview={handlePreview}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteOne}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={manager.clearSelection}>
                <button onClick={() => handleBulkSold(false)} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> <span className="hidden sm:inline-block">Mark Available</span>
                </button>
                <button onClick={() => handleBulkSold(true)} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <PackageX className="h-4 w-4 text-amber-400" /> <span className="hidden sm:inline-block">Mark Sold</span>
                </button>
                <div className="mx-1 h-4 w-px bg-brand-subtext/30"></div>
                <button onClick={manager.handleBulkDelete} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline-block">Delete</span>
                </button>
            </BulkActionBar>
        </div>
    );
}
