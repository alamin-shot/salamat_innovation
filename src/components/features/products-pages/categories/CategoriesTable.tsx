"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { CategoryRow } from "./CategoryRow";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";

interface CategoriesTableProps {
    manager: ProductsManager<"categories">;
}

export function CategoriesTable({ manager }: CategoriesTableProps) {
    const { toggleSelection, handleSetStatus, handleToggleEcommerce, store } = manager;

    const handleRename = React.useCallback((id: string, name: string) => {
        store.updateCategory(id, { name });
        toast.success("Category name updated");
    }, [store]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <ProductsFilterBar manager={manager} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                {manager.activeTabData.length === 0 ? (
                    <ProductsEmptyState title="No categories found" subtitle="Create a category or adjust your search to see results here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-[48px] px-4">
                                <input
                                    type="checkbox"
                                    checked={manager.isAllSelected}
                                    onChange={() => toggleSelection("ALL")}
                                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                />
                            </TableHeadCell>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Parent Category</TableHeadCell>
                            <TableHeadCell className="text-center">Total Products</TableHeadCell>
                            <TableHeadCell className="text-center">Sec. Logo</TableHeadCell>
                            <TableHeadCell className="text-center">Banner</TableHeadCell>
                            <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Ecommerce</TableHeadCell>
                            <AuditHeadCells />
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    isSelected={manager.selectedIds.includes(category.id)}
                                    onToggleSelect={toggleSelection}
                                    onSetStatus={handleSetStatus}
                                    onToggleEcommerce={handleToggleEcommerce}
                                    onRename={handleRename}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <BulkActionBar selectedCount={manager.selectedIds.length} onClearSelection={manager.clearSelection}>
                <button
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Delete All</span>
                </button>
            </BulkActionBar>
        </div>
    );
}
