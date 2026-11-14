import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, ReceiptText, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { PaymentListRow as Row } from "@/types/payments";
import { formatDay } from "@/utils/dateDisplay";

const money = (amount: number) => `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").substring(0, 2).toUpperCase();
const AVATAR = ["bg-emerald-800", "bg-sky-800", "bg-indigo-800", "bg-rose-800", "bg-amber-700"];

export type PaymentColumns = Record<"contact" | "businessName" | "businessLogo" | "date" | "invoiceNumber" | "type" | "debit" | "credit", boolean>;

interface PaymentListRowProps {
    row: Row;
    cols: PaymentColumns;
    isSelected: boolean;
    onToggle: (id: string, checked: boolean) => void;
    onVoucher: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PaymentListRow = React.memo(function PaymentListRow({ row, cols, isSelected, onToggle, onVoucher, onDelete }: PaymentListRowProps) {
    const isReceived = row.type === "payment received";
    const hasBusiness = row.businessName && !["-", "—"].includes(row.businessName);

    return (
        <TableRow className={isSelected ? "bg-emerald-50/50" : ""}>
            <TableCell className="text-center">
                <input type="checkbox" checked={isSelected} onChange={(e) => onToggle(row.id, e.target.checked)} className="h-4 w-4 cursor-pointer rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500" />
            </TableCell>

            {cols.contact && (
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${AVATAR[row.contact.length % AVATAR.length]}`}>{initials(row.contact)}</div>
                        <span className="text-sm font-semibold text-gray-800">{row.contact}</span>
                    </div>
                </TableCell>
            )}
            {cols.businessName && <TableCell className="text-sm text-gray-600">{hasBusiness ? row.businessName : "—"}</TableCell>}
            {cols.businessLogo && (
                <TableCell>
                    {hasBusiness ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-900 text-[10px] font-bold text-amber-500">{initials(row.businessName)}</div>
                    ) : (
                        <span className="text-gray-400">—</span>
                    )}
                </TableCell>
            )}
            {cols.date && <TableCell className="whitespace-nowrap text-sm text-gray-600">{formatDay(row.date)}</TableCell>}
            {cols.invoiceNumber && (
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-gray-800">{row.number}</span>
                        <span className="text-xs text-gray-500">{row.invoiceRef ? `for ${row.invoiceRef}` : "On account"}</span>
                    </div>
                </TableCell>
            )}
            {cols.type && (
                <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${isReceived ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {isReceived ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                        {row.type}
                    </span>
                </TableCell>
            )}
            {cols.debit && <TableCell className={`whitespace-nowrap text-right text-base font-semibold tabular-nums ${row.debit ? "text-gray-900" : "text-gray-400"}`}>{money(row.debit)}</TableCell>}
            {cols.credit && <TableCell className={`whitespace-nowrap text-right text-base font-semibold tabular-nums ${row.credit ? "text-gray-900" : "text-gray-400"}`}>{money(row.credit)}</TableCell>}

            <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onVoucher(row.id)} className="rounded-md text-blue-600 hover:bg-blue-50" title={isReceived ? "Credit Voucher" : "Debit Voucher"}>
                        <ReceiptText className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(row.id)} className="rounded-md text-brand-subtext" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
});
PaymentListRow.displayName = "PaymentListRow";
