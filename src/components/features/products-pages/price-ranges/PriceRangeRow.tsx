import * as React from "react";
import { AlertTriangle, Edit, Package, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { PriceRange, PriceRangeBounds, PriceRangeOverlap, RecordStatus } from "@/types/products";
import { formatPriceSpan } from "@/utils/priceRangeRules";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusToggle } from "../shared/StatusToggle";
import { AuditCells } from "../shared/AuditCells";
import { VisualRangeBar } from "./VisualRangeBar";

interface PriceRangeRowProps {
    record: PriceRange;
    scaleMax: number;
    overlaps: PriceRangeOverlap[];
    ghosts: PriceRangeBounds[];
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PriceRangeRow = React.memo(function PriceRangeRow({
    record, scaleMax, overlaps, ghosts, isSelected, onToggleSelect, onSetStatus, onEdit, onDelete,
}: PriceRangeRowProps) {
    const isActive = record.status === "Active";
    const hasOverlap = overlaps.length > 0;

    return (
        <TableRow className={isSelected ? "bg-emerald-50/30" : ""}>
            <TableCell className="w-[48px] px-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(record.id)}
                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
            </TableCell>

            <TableCell>
                <NameWithThumbnail name={record.label} image={null} />
            </TableCell>

            <TableCell className="min-w-[208px]">
                <div className="flex w-52 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold tabular-nums ${isActive ? "text-brand-text" : "text-brand-subtext"}`}>
                            {formatPriceSpan(record.minPrice, record.maxPrice)}
                        </span>
                        {hasOverlap && (
                            <span
                                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700"
                                title={`Overlaps ${overlaps.map((overlap) => `"${overlap.label}"`).join(", ")}`}
                            >
                                <AlertTriangle className="h-3 w-3" /> Overlap
                            </span>
                        )}
                    </div>
                    <VisualRangeBar
                        minPrice={record.minPrice}
                        maxPrice={record.maxPrice}
                        scaleMax={scaleMax}
                        isActive={isActive}
                        overlaps={overlaps}
                        ghosts={ghosts}
                    />
                </div>
            </TableCell>

            <TableCell>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-primary/20 bg-brand-primary/10 px-2.5 py-1 text-xs font-semibold text-brand-primary">
                    <Package className="h-3.5 w-3.5" />
                    {record.productCount} {record.productCount === 1 ? "Product" : "Products"}
                </span>
            </TableCell>

            <TableCell>
                <StatusToggle
                    checked={isActive}
                    onChange={() => onSetStatus(record.id, isActive ? "Inactive" : "Active")}
                    label={record.status}
                />
            </TableCell>

            <AuditCells createdBy={record.createdBy} createdAt={record.createdAt} />

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(record.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit Price Range"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(record.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Price Range"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

PriceRangeRow.displayName = "PriceRangeRow";
