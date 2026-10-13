"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useCommandParams } from "@/hooks/useCommandParams";
import { Button } from "@/components/ui/button";

export function PurchaseReturnTable() {
    const { openView } = useCommandParams();

    const returns = [
        { id: "108", initials: "WC", supplier: "World Trade Center", company: "World Trade Center", invoice: "PR-000107", items: 4, date: "2026-10-08", total: "1,13,840.00", due: "1,13,840.00", paid: "0.00", status: "Due", creator: "Md Zihadul Islam Sazzad", color: "bg-emerald-700" },
        { id: "107", initials: "X", supplier: "Xeero Sojib", company: "Sojib", invoice: "PR-000106", items: 6, date: "2026-10-04", total: "0.00", due: "0.00", paid: "0.00", status: "Due", creator: "Md Zihadul Islam Sazzad", color: "bg-emerald-600" },
        { id: "106", initials: "GH", supplier: "Gadget Home", company: "Gadget Home", invoice: "PR-000105", items: 14, date: "2026-09-14", total: "8,98,000.00", due: "8,98,000.00", paid: "0.00", status: "Due", creator: "Md Zihadul Islam Sazzad", color: "bg-teal-700" }
    ];

    return (
        <div className="rounded-lg border border-brand-subtext/20 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="font-semibold text-gray-600">Supplier</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Company Name</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Invoice Number</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Total Item</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Date</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Total Amount</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Due Amount</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Paid Amount</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Status</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600">Created By</TableHeadCell>
                        <TableHeadCell className="font-semibold text-gray-600 text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {returns.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${row.color}`}>
                                            {row.initials}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-brand-text">{row.supplier.split('\n')[0]}</span>
                                            <span className="text-xs text-brand-subtext">{row.supplier}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[13px] text-gray-600">{row.company}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">{row.invoice}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">{row.items}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">৳ {row.total}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">৳ {row.due}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">৳ {row.paid}</TableCell>
                                <TableCell><span className="text-[12px] font-medium text-red-500">{row.status}</span></TableCell>
                                <TableCell className="text-[13px] text-gray-600">{row.creator}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => openView("drawer", "view-return", row.id)}
                                            title="View"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => openView("drawer", "edit-return", row.id)}
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {/* Exact Pixel-Perfect Footer Match */}
                    <tfoot className="border-t-2 border-brand-subtext/20 bg-brand-bg/5 text-[13px]">
                        <tr className="border-b border-brand-subtext/10">
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3 font-bold text-brand-text">Total</td>
                            <td className="p-3 font-bold text-gray-700">৳ 24,01,00</td>
                            <td className="p-3 font-bold text-gray-700">৳ 24,01,00</td>
                            <td className="p-3 font-bold text-gray-700">৳ 0.00</td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                        </tr>
                        <tr>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3 font-bold text-brand-text">Grand Total</td>
                            <td className="p-3 font-bold text-brand-text">৳ 35,66,6.00</td>
                            <td className="p-3 font-bold text-brand-text">৳ 10,01,00</td>
                            <td className="p-3 font-bold text-brand-text">৳ 0.00</td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                            <td className="p-3"></td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
}