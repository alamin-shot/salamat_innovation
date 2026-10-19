"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

export function SaleReturnListTable({ returns, setReturns }: { returns: any[], setReturns: any }) {
    const { openView } = useCommandParams();
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

    const toggleAll = () => {
        if (selectedRows.length === returns.length) setSelectedRows([]);
        else setSelectedRows(returns.map(r => r.id));
    };

    const toggleRow = (id: string) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const handleDelete = (id: string) => {
        setReturns((prev: any[]) => prev.filter(r => r.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id));
    };

    const handleBulkDelete = () => {
        setReturns((prev: any[]) => prev.filter(r => !selectedRows.includes(r.id)));
        setSelectedRows([]);
    };

    return (
        <div className="flex flex-col gap-4">
            {selectedRows.length > 0 && (
                <BulkActionBar selectedCount={selectedRows.length} onClearSelection={() => setSelectedRows([])}>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-10 pl-4">
                                <input type="checkbox" checked={selectedRows.length === returns.length && returns.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            </TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Customer</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Invoice Number</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Date</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-center">Total Item</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Total Amount</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Created By</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {returns.map((row) => (
                                <TableRow key={row.id} className={selectedRows.includes(row.id) ? "bg-gray-50/50" : ""}>
                                    <TableCell className="pl-4">
                                        <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRow(row.id)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${row.color}`}>
                                                {row.initials}
                                            </div>
                                            <span className="font-medium text-[13px] text-gray-800">{row.customer}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[13px] text-gray-600">{row.invoice}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-center">{row.items}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.total}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600">{row.createdBy}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "view-return", row.id)} title="View Return">
                                                <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                                            </Button>
                                            <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "edit-return", row.id)} title="Edit Return">
                                                <Edit className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                                            </Button>
                                            <Button size="icon-sm" variant="destructive-ghost" onClick={() => handleDelete(row.id)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        {/* Meticulously aligned double-footer */}
                        <tfoot className="border-t-2 border-gray-100 bg-gray-50/50 text-[13px]">
                            <tr>
                                <td colSpan={3} className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">Total</td>
                                <td className="p-3 font-bold text-gray-700 text-center">8</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 1,03,764.00</td>
                                <td colSpan={2} className="p-3"></td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">Grand Total</td>
                                <td className="p-3 font-bold text-gray-700 text-center">45</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 5,42,890.00</td>
                                <td colSpan={2} className="p-3"></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        </div>
    );
}