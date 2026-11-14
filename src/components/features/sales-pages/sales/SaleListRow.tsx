import * as React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { InlineDropdown } from "@/components/ui/InlineDropdown";
import { SalePaymentStatus, SaleRow } from "@/types/sales";
import { supplierInitials } from "@/utils/purchaseMath";

interface SaleListRowProps {
    row: SaleRow;
    isSelected: boolean;
    onToggle: (id: string, checked: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onSeller: (id: string) => void;
    onCourier: (id: string, courier: string) => void;
}

const money = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_STYLES: Record<SalePaymentStatus, string> = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Due: "bg-red-100 text-red-700 border-red-200",
    Partially_paid: "bg-amber-100 text-amber-700 border-amber-200",
};
const STATUS_LABELS: Record<SalePaymentStatus, string> = { Paid: "Paid", Due: "Due", Partially_paid: "Partially paid" };
const COURIER_STYLE = () => "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";

export const SaleListRow = React.memo(function SaleListRow({ row, isSelected, onToggle, onView, onEdit, onDelete, onSeller, onCourier }: SaleListRowProps) {
    return (
        <TableRow className={isSelected ? "bg-gray-50/50" : ""}>
            <TableCell className="pl-4">
                <input type="checkbox" checked={isSelected} onChange={(e) => onToggle(row.id, e.target.checked)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">{supplierInitials(row.customerName)}</div>
                    <span className="font-medium text-[13px] text-gray-800">{row.customerName}</span>
                </div>
            </TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.invoiceNumber}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-center">{row.items.length}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-right">৳ {money(row.totals.shipping)}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-right">৳ {money(row.totals.grandTotal)}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-right">৳ {money(row.totals.due)}</TableCell>
            <TableCell className="text-[13px] text-gray-600 text-right">৳ {money(row.totals.received)}</TableCell>
            <TableCell className="text-[12px] text-gray-600">{row.paymentMethods}</TableCell>
            <TableCell>
                {/* Derived from payments vs. total (ledger); not editable. */}
                <span title="Calculated from the payments received" className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[row.status]}`}>
                    {STATUS_LABELS[row.status]}
                </span>
            </TableCell>
            <TableCell>
                <button onClick={() => onSeller(row.id)} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors group" title="Click to change seller">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white group-hover:ring-2 ring-emerald-500/30">
                        {row.seller === "AV" ? "AV" : row.seller.substring(0, 2).toUpperCase()}
                    </div>
                    {row.seller !== "AV" && <span className="text-[12px] text-gray-600 hidden xl:block">{row.seller}</span>}
                </button>
            </TableCell>
            <TableCell>
                {row.courier !== "—" ? (
                    <InlineDropdown value={row.courier} options={["Pending", "Send via Pathao", "Send via Steadfast", "Send via REDX"]} onSelect={(value) => onCourier(row.id, value)} getBadgeStyle={COURIER_STYLE} />
                ) : <span className="text-gray-400">—</span>}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button size="icon-sm" variant="ghost" onClick={() => onView(row.id)} title="View Invoice"><Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" /></Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => onEdit(row.id)} title="Edit Sale"><Edit className="h-4 w-4 text-gray-500 hover:text-emerald-600" /></Button>
                    <Button size="icon-sm" variant="destructive-ghost" onClick={() => onDelete(row.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
});

SaleListRow.displayName = "SaleListRow";
