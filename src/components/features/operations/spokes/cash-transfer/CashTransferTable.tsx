import * as React from "react";
import { Banknote } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { CashTransfer } from "@/types/cashTransfers";
import { CashTransferRow } from "./CashTransferRow";

const HEAD = "font-semibold text-gray-600";

export function CashTransferTable({ rows, onView }: { rows: CashTransfer[]; onView: (id: string) => void }) {
    if (rows.length === 0) {
        return (
            <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Banknote className="h-8 w-8 text-brand-subtext/60" />
                <h3 className="text-sm font-bold text-brand-text">No cash transfers found</h3>
                <p className="text-xs text-brand-subtext">Create a transfer to move cash between shops.</p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto border-b border-gray-200">
            <Table>
                <TableHeader>
                    <TableHeadCell className={`${HEAD} pl-4`}>Ref #</TableHeadCell>
                    <TableHeadCell className={HEAD}>From Shop</TableHeadCell>
                    <TableHeadCell className={HEAD}>To Shop</TableHeadCell>
                    <TableHeadCell className={`${HEAD} text-right`}>Amount</TableHeadCell>
                    <TableHeadCell className={HEAD}>Date</TableHeadCell>
                    <TableHeadCell className={HEAD}>Created At</TableHeadCell>
                    <TableHeadCell className={HEAD}>Status</TableHeadCell>
                    <TableHeadCell className={`${HEAD} text-right pr-4`}>Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => <CashTransferRow key={row.id} row={row} onView={onView} />)}
                </TableBody>
            </Table>
        </div>
    );
}
