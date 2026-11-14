"use client";
import * as React from "react";
import { Undo2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { usePurchaseReturnsManager } from "@/hooks/purchases_hooks/usePurchaseReturnsManager";
import { PurchaseReturnRow } from "./PurchaseReturnRow";

type Manager = ReturnType<typeof usePurchaseReturnsManager>;

const HEAD = "font-semibold text-gray-600";
const money = (value: number) => `৳ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Paid Amount and Status were removed by the CEO; Due Amount stays and drives the edit lock. */
export function PurchaseReturnTable({ manager }: { manager: Manager }) {
    const { table, listTotal } = manager;

    if (table.filteredData.length === 0) {
        return (
            <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <Undo2 className="h-8 w-8 text-brand-subtext/60" />
                <h3 className="text-sm font-bold text-brand-text">No purchase returns found</h3>
                <p className="text-xs text-brand-subtext">Returns you save from Add Purchase Return appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableHeadCell className={HEAD}>Supplier</TableHeadCell>
                    <TableHeadCell className={HEAD}>Company Name</TableHeadCell>
                    <TableHeadCell className={HEAD}>Invoice Number</TableHeadCell>
                    <TableHeadCell className={HEAD}>Total Item</TableHeadCell>
                    <TableHeadCell className={HEAD}>Date</TableHeadCell>
                    <TableHeadCell className={HEAD}>Total Amount</TableHeadCell>
                    <TableHeadCell className={HEAD}>Due Amount</TableHeadCell>
                    <TableHeadCell className={HEAD}>Created By</TableHeadCell>
                    <TableHeadCell className={`${HEAD} text-right`}>Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {table.filteredData.map((row) => (
                        <PurchaseReturnRow key={row.id} row={row} onView={manager.handleView} onEdit={manager.handleEdit} onDelete={manager.handleDelete} />
                    ))}
                </TableBody>

                {/* Single Total over the listed returns (no Grand Total). */}
                <tfoot className="border-t-2 border-brand-subtext/20 bg-brand-bg/5 text-[13px]">
                    <tr>
                        <td className="p-3"></td>
                        <td className="p-3"></td>
                        <td className="p-3"></td>
                        <td className="p-3 font-bold text-gray-700">{listTotal.totalItem}</td>
                        <td className="p-3 font-bold text-brand-text">Total</td>
                        <td className="p-3 font-bold text-gray-700">{money(listTotal.totalAmount)}</td>
                        <td className="p-3 font-bold text-gray-700">{money(listTotal.dueAmount)}</td>
                        <td className="p-3"></td>
                        <td className="p-3"></td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
}
