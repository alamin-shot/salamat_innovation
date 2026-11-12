"use client";
import * as React from "react";
import { Edit, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { RecordStatus, WarrantyCareText } from "@/types/products";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusDropdown } from "../shared/StatusDropdown";
import { AuditCells } from "../shared/AuditCells";

interface WarrantyCareTextRowProps {
    record: WarrantyCareText;
    usageCount: number;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const WarrantyCareTextRow = React.memo(function WarrantyCareTextRow({
    record, usageCount, isSelected, onToggleSelect, onSetStatus, onEdit, onDelete
}: WarrantyCareTextRowProps) {
    // A text still selected on a product cannot be deleted, only deactivated.
    const isInUse = usageCount > 0;

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
                <NameWithThumbnail name={record.text} image={null} />
            </TableCell>

            <TableCell>
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${isInUse ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-brand-subtext/20 bg-brand-bg text-brand-subtext"}`}>
                    {usageCount} {usageCount === 1 ? "Product" : "Products"}
                </span>
            </TableCell>

            <TableCell>
                <StatusDropdown status={record.status} onChange={(status) => onSetStatus(record.id, status)} />
            </TableCell>

            <AuditCells createdBy={record.createdBy} createdAt={record.createdAt} />

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={() => onEdit(record.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit Warranty Care Text"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(record.id)}
                        disabled={isInUse}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-subtext"
                        title={isInUse ? "In use by products — deactivate it instead" : "Delete Warranty Care Text"}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

WarrantyCareTextRow.displayName = "WarrantyCareTextRow";
