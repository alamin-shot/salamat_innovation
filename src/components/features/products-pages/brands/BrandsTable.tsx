"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Trash2 } from "lucide-react";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { BrandRow } from "./BrandRow";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";

interface BrandsTableProps {
    manager: ProductsManager<"brands">;
}

export function BrandsTable({ manager }: BrandsTableProps) {
    const { toggleSelection, handleSetStatus, handleToggleEcommerce, handleDelete, openDrawer } = manager;

    const handleEdit = React.useCallback((id: string) => openDrawer("drawer", "edit", id), [openDrawer]);
    const handleDeleteOne = React.useCallback((id: string) => handleDelete([id]), [handleDelete]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <ProductsFilterBar manager={manager} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                {manager.activeTabData.length === 0 ? (
                    <ProductsEmptyState title="No brands found" subtitle="Add a brand or adjust your search to see results here." />
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
                            <TableHeadCell className="text-center">Total Products</TableHeadCell>
                            <TableHeadCell>Tagline</TableHeadCell>
                            <TableHeadCell className="text-center">Primary Logo</TableHeadCell>
                            <TableHeadCell className="text-center">Shop Banner</TableHeadCell>
                            <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Ecommerce</TableHeadCell>
                            <AuditHeadCells />
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((brand) => (
                                <BrandRow
                                    key={brand.id}
                                    brand={brand}
                                    isSelected={manager.selectedIds.includes(brand.id)}
                                    onToggleSelect={toggleSelection}
                                    onSetStatus={handleSetStatus}
                                    onToggleEcommerce={handleToggleEcommerce}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteOne}
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
