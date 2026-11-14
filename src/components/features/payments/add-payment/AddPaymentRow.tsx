import * as React from "react";
import Image from "next/image";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { PaymentPartyRow } from "@/types/payments";

const money = (amount: number) => `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").substring(0, 2).toUpperCase();
const hasText = (value: string) => !!value && !["-", "—"].includes(value.trim());

export type AddPaymentColumns = Record<"name" | "businessName" | "businessLogo" | "phoneNumber" | "debit" | "credit" | "balance", boolean>;

/** Balance colour: rose = still owed, emerald = settled, amber = advance (negative). */
const balanceTone = (balance: number) => (balance > 0 ? "text-rose-600" : balance < 0 ? "text-amber-600" : "text-emerald-600");

interface AddPaymentRowProps {
    row: PaymentPartyRow;
    cols: AddPaymentColumns;
    onReceive: (id: string) => void;
    onSend: (id: string) => void;
}

export const AddPaymentRow = React.memo(function AddPaymentRow({ row, cols, onReceive, onSend }: AddPaymentRowProps) {
    return (
        <TableRow>
            {cols.name && (
                <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">{initials(row.name)}</div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">{row.name}</span>
                            <span className="text-xs text-gray-500">{row.type}</span>
                        </div>
                    </div>
                </TableCell>
            )}
            {cols.businessName && <TableCell className="text-sm text-gray-600">{hasText(row.businessName) ? row.businessName : "—"}</TableCell>}
            {cols.businessLogo && (
                <TableCell>
                    {row.businessLogoUrl
                        ? <Image src={row.businessLogoUrl} alt={`${row.businessName} logo`} width={28} height={28} unoptimized className="h-7 w-7 rounded object-cover" />
                        : <span className="text-gray-400">—</span>}
                </TableCell>
            )}
            {cols.phoneNumber && <TableCell className="text-sm text-gray-600">{hasText(row.phoneNumber) ? row.phoneNumber : "—"}</TableCell>}
            {cols.debit && <TableCell className="whitespace-nowrap text-right text-base font-semibold tabular-nums text-gray-800">{money(row.debit)}</TableCell>}
            {cols.credit && <TableCell className="whitespace-nowrap text-right text-base font-semibold tabular-nums text-gray-800">{money(row.credit)}</TableCell>}
            {cols.balance && (
                <TableCell className={`whitespace-nowrap text-right text-base font-bold tabular-nums ${balanceTone(row.balance)}`}>
                    {money(Math.abs(row.balance))}{row.balance < 0 && <span className="ml-1 text-xs font-semibold">adv.</span>}
                </TableCell>
            )}
            <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onReceive(row.id)} className="rounded-md text-emerald-600 hover:bg-emerald-50" title="Receive Payment">
                        <ArrowDownLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onSend(row.id)} className="rounded-md text-blue-600 hover:bg-blue-50" title="Send Payment">
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
});
AddPaymentRow.displayName = "AddPaymentRow";
