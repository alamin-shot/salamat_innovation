import * as React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { SaleReturnRow } from "@/types/sales";
import { supplierInitials } from "@/utils/purchaseMath";

interface SaleReturnListRowProps {
    row: SaleReturnRow;
    isSelected: boolean;
    onToggle: (id: string, checked: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const SaleReturnListRow = React.memo(function SaleReturnListRow({ row, isSelected, onToggle, onView, onEdit, onDelete }: SaleReturnListRowProps) {
    return (
        <TableRow className={isSelected ? "bg-gray-50/50" : ""}>
            <TableCell className="pl-4">
                <input type="checkbox" checked={isSelected} onChange={(e) => onToggle(row.id, e.target.checked)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">{supplierInitials(row.customerName)}</div>
                    <span className="font-medium text-[13px] text-gray-800">{row.customerName}</span>
                </div>
            </TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.returnNumber}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-center">{row.items.length}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.totals.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.createdBy}</TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => onView(row.id)} title="View Return"><Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" /></Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => onEdit(row.id)} title="Edit Return"><Edit className="h-4 w-4 text-gray-500 hover:text-emerald-600" /></Button>
                    <Button size="icon-sm" variant="destructive-ghost" onClick={() => onDelete(row.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
});

SaleReturnListRow.displayName = "SaleReturnListRow";
