"use client";
import * as React from "react";
import { Eye, Edit, Trash2, Tag, Settings, Package, Heart } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Product, ProductsQuickViewType, RecordStatus } from "@/types/products";
import { ProductTagsDropdown } from "./ProductTagsDropdown";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusDropdown } from "../shared/StatusDropdown";
import { StatusToggle } from "../shared/StatusToggle";
import { AuditCells } from "../shared/AuditCells";

interface ProductRowProps {
    product: Product;
    isSelected: boolean;
    visibleColumns: Record<string, boolean>;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onToggleEcommerce: (id: string) => void;
    onToggleWarranty: (id: string) => void;
    onTagsChange: (id: string, tags: string[]) => void;
    onOpenQuickView: (type: ProductsQuickViewType, id: string) => void;
    onPreview: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const ProductRow = React.memo(function ProductRow({
    product, isSelected, visibleColumns, onToggleSelect, onSetStatus, onToggleEcommerce, onToggleWarranty,
    onTagsChange, onOpenQuickView, onPreview, onEdit, onDelete
}: ProductRowProps) {
    return (
        <TableRow className={isSelected ? "bg-brand-primary/5 transition-colors" : "transition-colors"}>
            <TableCell className="w-[48px] px-4">
                <div className="flex items-center justify-center">
                    <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-brand-primary transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
                        checked={isSelected}
                        onChange={() => onToggleSelect(product.id)}
                    />
                </div>
            </TableCell>

            {visibleColumns.name !== false && (
                <TableCell>
                    <NameWithThumbnail name={product.name} image={product.image} />
                </TableCell>
            )}
            {visibleColumns.category !== false && <TableCell>{product.category}</TableCell>}
            {visibleColumns.brand !== false && <TableCell>{product.brand}</TableCell>}

            {/* 1. STATUS INLINE DROPDOWN CELL */}
            {visibleColumns.status !== false && (
                <TableCell>
                    <StatusDropdown status={product.status} onChange={(status) => onSetStatus(product.id, status)} />
                </TableCell>
            )}

            {/* 2. ECOMMERCE ON/OFF SWITCH */}
            {visibleColumns.ecommerce !== false && (
                <TableCell>
                    <StatusToggle
                        checked={product.ecommerce}
                        onChange={() => onToggleEcommerce(product.id)}
                        label={product.ecommerce ? "Enabled" : "Disabled"}
                    />
                </TableCell>
            )}

            {visibleColumns.tags !== false && (
                <TableCell>
                    <ProductTagsDropdown initialTags={product.tags} onChange={(tags) => onTagsChange(product.id, tags)} />
                </TableCell>
            )}

            {visibleColumns.variants !== false && (
                <TableCell>
                    <button onClick={() => onOpenQuickView("variants", product.id)} className="flex items-center gap-1.5 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 py-1 text-xs font-medium text-brand-text transition-colors hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary">
                        <Package className="h-3 w-3" /> {product.variantsCount > 0 ? `${product.variantsCount} Variants` : "+ Setup"}
                    </button>
                </TableCell>
            )}

            {visibleColumns.specs !== false && (
                <TableCell>
                    <button onClick={() => onOpenQuickView("specs", product.id)} className="flex items-center gap-1.5 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 py-1 text-xs font-medium text-brand-text transition-colors hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary">
                        <Tag className="h-3 w-3" /> {product.specsCount > 0 ? `${product.specsCount} Specs` : "+ Setup"}
                    </button>
                </TableCell>
            )}

            {visibleColumns.care !== false && (
                <TableCell>
                    <button onClick={() => onOpenQuickView("care", product.id)} className={`flex items-center gap-1.5 rounded-md border border-brand-subtext/20 px-2 py-1 text-xs font-medium transition-colors hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 ${product.hasCare ? 'bg-brand-bg text-brand-text' : 'bg-transparent text-brand-subtext border-dashed'}`}>
                        <Heart className={`h-3 w-3 ${product.hasCare ? 'text-pink-500' : ''}`} /> {product.hasCare ? "View Care" : "+ Add Care"}
                    </button>
                </TableCell>
            )}

            {/* 3. WARRANTY ON/OFF SWITCH + DETAILS */}
            {visibleColumns.warranty !== false && (
                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <StatusToggle
                            checked={product.warrantyActive}
                            onChange={() => onToggleWarranty(product.id)}
                            label={product.warrantyActive ? "Active" : "Inactive"}
                            title="Warranty status"
                        />
                        <button onClick={() => onOpenQuickView("warranty", product.id)} className="flex h-6 items-center gap-1 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 text-xs font-medium text-brand-text transition-colors hover:bg-brand-subtext/10 hover:text-brand-primary hover:border-brand-primary/30">
                            <Settings className="h-3 w-3" /> Details
                        </button>
                    </div>
                </TableCell>
            )}

            {visibleColumns.createdAt !== false && (
                <AuditCells createdBy={product.createdBy} createdAt={product.createdAt} />
            )}

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                    <button
                        onClick={() => onPreview(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
                        title="Live Preview"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEdit(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none"
                        title="Advanced Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none"
                        title="Delete Product"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

ProductRow.displayName = "ProductRow";
