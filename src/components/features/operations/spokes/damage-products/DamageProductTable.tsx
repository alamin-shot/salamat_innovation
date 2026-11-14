import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { DamageProduct } from "@/types/damageProducts";
import { DamageProductRow } from "./DamageProductRow";

const HEAD = "font-semibold text-gray-600";

export function DamageProductTable({ rows, onView }: { rows: DamageProduct[]; onView: (id: string) => void }) {
    if (rows.length === 0) {
        return (
            <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <AlertTriangle className="h-8 w-8 text-brand-subtext/60" />
                <h3 className="text-sm font-bold text-brand-text">No damage records found</h3>
                <p className="text-xs text-brand-subtext">Record damaged units by scanning their serial numbers.</p>
            </div>
        );
    }
    return (
        <div className="overflow-x-auto border-b border-gray-200">
            <Table>
                <TableHeader>
                    <TableHeadCell className={`${HEAD} pl-4`}>Ref #</TableHeadCell>
                    <TableHeadCell className={HEAD}>Shop</TableHeadCell>
                    <TableHeadCell className={HEAD}>Date</TableHeadCell>
                    <TableHeadCell className={HEAD}>Created At</TableHeadCell>
                    <TableHeadCell className={HEAD}>Items</TableHeadCell>
                    <TableHeadCell className={HEAD}>Status</TableHeadCell>
                    <TableHeadCell className={`${HEAD} text-right pr-4`}>Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => <DamageProductRow key={row.id} row={row} onView={onView} />)}
                </TableBody>
            </Table>
        </div>
    );
}
