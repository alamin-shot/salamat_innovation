"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2, Tag, CheckCircle2, Globe } from "lucide-react";
import { toast } from "sonner";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { ProductsQuickViewType } from "@/types/products";
import { ProductRow } from "./ProductRow";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";

interface ProductTableProps {
    manager: ProductsManager<"products">;
}

const DEFAULT_COLUMNS: Record<string, boolean> = {
    name: true, category: true, brand: true, tags: true, status: true, ecommerce: true,
    variants: false, specs: false, care: false, warranty: true, createdAt: true,
};

export function ProductTable({ manager }: ProductTableProps) {
    const { toggleSelection, handleSetStatus, handleToggleEcommerce, handleDelete, openDrawer, setQuickView, store, sortKey, sortDirection, handleSort } = manager;

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(DEFAULT_COLUMNS);
    const handleToggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleResetColumns = () => setVisibleColumns(DEFAULT_COLUMNS);

    const handleToggleWarranty = React.useCallback((id: string) => {
        store.toggleProductWarranty(id);
        toast.success("Warranty status updated.");
    }, [store]);

    const handleTagsChange = React.useCallback((id: string, tags: string[]) => {
        store.updateProduct(id, { tags });
    }, [store]);

    const handleOpenQuickView = React.useCallback((type: ProductsQuickViewType, id: string) => setQuickView({ type, id }), [setQuickView]);
    const handlePreview = React.useCallback((id: string) => openDrawer("drawer", "preview", id), [openDrawer]);
    const handleEdit = React.useCallback((id: string) => openDrawer("drawer", "edit", id), [openDrawer]);
    const handleDeleteOne = React.useCallback((id: string) => handleDelete([id]), [handleDelete]);

    const handleBulkAction = (actionName: string) => {
        toast.success(`${actionName} applied to ${manager.selectedIds.length} products.`);
        manager.clearSelection();
    };

    const rows = manager.activeTabData;

    return (
        <div className="flex flex-col w-full h-full">
            <div className="border-b border-brand-subtext/20 bg-white">
                <ProductsFilterBar manager={manager}
                    actions={
                        <ColumnsVisibilityDropdown
                            columns={[
                                { key: "name", label: "Name" },
                                { key: "category", label: "Category" },
                                { key: "brand", label: "Brand" },
                                { key: "status", label: "Status" },
                                { key: "ecommerce", label: "Ecommerce" },
                                { key: "tags", label: "Tags" },
                                { key: "variants", label: "Variants" },
                                { key: "specs", label: "Specs" },
                                { key: "care", label: "Care" },
                                { key: "warranty", label: "Warranty" },
                                { key: "createdAt", label: "Created By / At" }
                            ]}
                            visibleColumns={visibleColumns}
                            onToggleColumn={handleToggleColumn}
                            onReset={handleResetColumns}
                        />
                    }
                />
            </div>

            <div className="overflow-x-auto mt-0">
                {rows.length === 0 ? (
                    <ProductsEmptyState title="No products found" subtitle="Add a product or adjust your search and filters to see results here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-[48px] px-4">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-brand-primary transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
                                        onChange={() => toggleSelection("ALL")}
                                        checked={manager.isAllSelected}
                                    />
                                </div>
                            </TableHeadCell>

                            {visibleColumns.name !== false && <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>Name</TableHeadCell>}
                            {visibleColumns.category !== false && <TableHeadCell sortable activeDirection={sortKey === "category" ? sortDirection : null} onClick={() => handleSort("category")}>Category</TableHeadCell>}
                            {visibleColumns.brand !== false && <TableHeadCell sortable activeDirection={sortKey === "brand" ? sortDirection : null} onClick={() => handleSort("brand")}>Brand</TableHeadCell>}
                            {visibleColumns.status !== false && <TableHeadCell>Status</TableHeadCell>}
                            {visibleColumns.ecommerce !== false && <TableHeadCell>Ecommerce</TableHeadCell>}
                            {visibleColumns.tags !== false && <TableHeadCell>Tags</TableHeadCell>}
                            {visibleColumns.variants !== false && <TableHeadCell>Variants</TableHeadCell>}
                            {visibleColumns.specs !== false && <TableHeadCell>Specs</TableHeadCell>}
                            {visibleColumns.care !== false && <TableHeadCell>Care</TableHeadCell>}
                            {visibleColumns.warranty !== false && <TableHeadCell>Warranty</TableHeadCell>}
                            {visibleColumns.createdAt !== false && <AuditHeadCells />}
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {rows.map((product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    isSelected={manager.selectedIds.includes(product.id)}
                                    visibleColumns={visibleColumns}
                                    onToggleSelect={toggleSelection}
                                    onSetStatus={handleSetStatus}
                                    onToggleEcommerce={handleToggleEcommerce}
                                    onToggleWarranty={handleToggleWarranty}
                                    onTagsChange={handleTagsChange}
                                    onOpenQuickView={handleOpenQuickView}
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
                <button onClick={() => handleBulkAction("Status Update")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> <span className="hidden sm:inline-block">Status</span>
                </button>
                <button onClick={() => handleBulkAction("Tags Applied")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <Tag className="h-4 w-4 text-brand-primary" /> <span className="hidden sm:inline-block">Tags</span>
                </button>
                <button onClick={() => handleBulkAction("Global Flags Applied")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <Globe className="h-4 w-4 text-blue-400" /> <span className="hidden sm:inline-block">Flags</span>
                </button>
                <div className="mx-1 h-4 w-px bg-brand-subtext/30"></div>
                <button onClick={manager.handleBulkDelete} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline-block">Delete</span>
                </button>
            </BulkActionBar>
        </div>
    );
}
