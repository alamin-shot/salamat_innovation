"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { ProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { PageRow } from "./PageRow";
import { AuditHeadCells } from "../shared/AuditCells";
import { ProductsEmptyState } from "../shared/ProductsEmptyState";
import { ProductsFilterBar } from "../shared/ProductsFilterBar";

interface PagesTableProps {
    manager: ProductsManager<"pages">;
}

export function PagesTable({ manager }: PagesTableProps) {
    const { handleSetStatus, handleToggleEcommerce, openDrawer } = manager;

    const handleEdit = React.useCallback((id: string) => openDrawer("modal", "edit", id), [openDrawer]);

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <ProductsFilterBar manager={manager} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
                {manager.activeTabData.length === 0 ? (
                    <ProductsEmptyState title="No pages found" subtitle="Adjust your search to see storefront pages here." />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHeadCell>Title</TableHeadCell>
                            <TableHeadCell>Slug</TableHeadCell>
                            <TableHeadCell>Shop</TableHeadCell>
                            <TableHeadCell className="text-center">Shop Banner</TableHeadCell>
                            <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Ecommerce</TableHeadCell>
                            <AuditHeadCells />
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.activeTabData.map((page) => (
                                <PageRow
                                    key={page.id}
                                    page={page}
                                    onSetStatus={handleSetStatus}
                                    onToggleEcommerce={handleToggleEcommerce}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
