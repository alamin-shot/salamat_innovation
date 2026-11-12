"use client";
import * as React from "react";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Tag, Heart, Eye, Edit, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { RecordStatus, UsedProduct } from "@/types/products";
import { formatTaka } from "@/utils/productRules";
import { StatusToggle } from "../shared/StatusToggle";
import { StatusDropdown } from "../shared/StatusDropdown";
import { AuditCells } from "../shared/AuditCells";

interface UsedProductRowProps {
    product: UsedProduct;
    isSelected: boolean;
    visibleColumns: Record<string, boolean>;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onToggleEcommerce: (id: string) => void;
    onSetSold: (id: string, isSold: boolean) => void;
    onOpenPrice: (id: string) => void;
    onOpenCare: (id: string) => void;
    onPreview: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const UsedProductRow = React.memo(function UsedProductRow({
    product, isSelected, visibleColumns, onToggleSelect, onSetStatus, onToggleEcommerce, onSetSold,
    onOpenPrice, onOpenCare, onPreview, onEdit, onDelete
}: UsedProductRowProps) {
    return (
        <TableRow className={isSelected ? "bg-emerald-50/50" : ""}>
            <TableCell className="w-[48px] px-4">
                <div className="flex items-center justify-center">
                    <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-emerald-600 focus:ring-emerald-600" checked={isSelected} onChange={() => onToggleSelect(product.id)} />
                </div>
            </TableCell>

            {visibleColumns.name !== false && (
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-brand-subtext/10 bg-brand-bg shrink-0">
                            {product.image && <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />}
                        </div>
                        <span className="font-medium text-brand-text">{product.name}</span>
                    </div>
                </TableCell>
            )}
            {visibleColumns.variant !== false && <TableCell>{product.variant}</TableCell>}

            {/* INTERACTIVE PRICE CELL (shows the Selling Price) */}
            {visibleColumns.price !== false && (
                <TableCell>
                    <button
                        onClick={() => onOpenPrice(product.id)}
                        className="group inline-flex items-center gap-1.5 font-medium text-brand-text hover:text-emerald-600 transition-colors cursor-pointer"
                        title="Click to update price"
                    >
                        <Tag className="h-3.5 w-3.5 text-brand-subtext group-hover:text-emerald-600" />
                        <span>{product.sellingPrice !== null ? formatTaka(product.sellingPrice) : "—"}</span>
                    </button>
                </TableCell>
            )}

            {visibleColumns.serialNumber !== false && <TableCell><span className="font-mono text-xs">{product.serialNumber}</span></TableCell>}

            {/* INTERACTIVE CARE CELL */}
            {visibleColumns.carePlan !== false && (
                <TableCell>
                    <button
                        onClick={() => onOpenCare(product.id)}
                        className="group inline-flex items-center gap-1.5 rounded-md bg-brand-bg/60 px-2.5 py-1 text-xs font-medium text-brand-text border border-brand-subtext/10 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 transition-all cursor-pointer"
                        title="Click to manage care plan"
                    >
                        <Heart className="h-3.5 w-3.5 text-brand-subtext group-hover:text-pink-600" />
                        <span className="truncate max-w-[160px]">{product.carePlan}</span>
                    </button>
                </TableCell>
            )}

            {/* INLINE SOLD DROPDOWN */}
            {visibleColumns.isSold !== false && (
                <TableCell>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition-colors outline-none cursor-pointer ${!product.isSold
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                            : "bg-brand-bg text-brand-subtext border border-brand-subtext/20 hover:bg-brand-subtext/10"
                            }`}>
                            <span>{!product.isSold ? "Available" : "Sold"}</span>
                            <ChevronDown className="h-3 w-3 opacity-80" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                <DropdownMenu.Item onClick={() => onSetSold(product.id, false)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 outline-none">
                                    Available
                                </DropdownMenu.Item>
                                <DropdownMenu.Item onClick={() => onSetSold(product.id, true)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-brand-subtext hover:bg-brand-bg outline-none">
                                    Sold
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </TableCell>
            )}

            {visibleColumns.status !== false && (
                <TableCell>
                    <StatusDropdown status={product.status} onChange={(status) => onSetStatus(product.id, status)} />
                </TableCell>
            )}

            {visibleColumns.ecommerce !== false && (
                <TableCell>
                    <StatusToggle
                        checked={product.ecommerce}
                        onChange={() => onToggleEcommerce(product.id)}
                        label={product.ecommerce ? "Enabled" : "Disabled"}
                    />
                </TableCell>
            )}

            {visibleColumns.audit !== false && (
                <AuditCells createdBy={product.createdBy} createdAt={product.createdAt} />
            )}

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                    <button onClick={() => onPreview(product.id)} className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none" title="Live Preview">
                        <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => onEdit(product.id)} className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none" title="Advanced Edit">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none" title="Delete Product">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

UsedProductRow.displayName = "UsedProductRow";
