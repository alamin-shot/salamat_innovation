import * as React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { PurchaseReturnRow as PurchaseReturnRowData } from "@/types/purchases";

interface PurchaseReturnRowProps {
    row: PurchaseReturnRowData;
    onView: (id: string) => void;
    onEdit: (row: PurchaseReturnRowData) => void;
    onDelete: (id: string) => void;
}

const money = (value: number) => `৳ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const PurchaseReturnRow = React.memo(function PurchaseReturnRow({ row, onView, onEdit, onDelete }: PurchaseReturnRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${row.badgeColor}`}>
                        {row.supplierInitials}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-brand-text">{row.supplier}</span>
                        <span className="text-xs text-brand-subtext">{row.supplier}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.company}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.invoiceNumber}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.totalItem}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{money(row.totalAmount)}</TableCell>
            <TableCell className={`text-[13px] ${row.canEdit ? "text-gray-600" : "text-emerald-600 font-medium"}`}>{money(row.dueAmount)}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.createdBy}</TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(row.id)} title="View">
                        <Eye className="h-4 w-4" />
                    </Button>
                    {/* Editable only while a due is pending; settled returns are locked. */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(row)}
                        disabled={!row.canEdit}
                        title={row.canEdit ? "Edit" : "Settled (no due) — editing is locked"}
                        className="disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(row.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
});

PurchaseReturnRow.displayName = "PurchaseReturnRow";
