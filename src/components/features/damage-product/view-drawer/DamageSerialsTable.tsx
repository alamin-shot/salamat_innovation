"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function DamageSerialsTable({ serials }: { serials: any[] }) {
    return (
        <div className="flex flex-col rounded-lg border border-gray-200 overflow-hidden mt-6 bg-white shadow-sm">
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200">
                <h3 className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">
                    Damaged Serials ({serials.length})
                </h3>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider w-12 pl-4">#</TableHeadCell>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Serial No.</TableHeadCell>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Product</TableHeadCell>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">SKU</TableHeadCell>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Variant</TableHeadCell>
                        <TableHeadCell className="font-bold text-[11px] text-gray-400 uppercase tracking-wider">Status</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {serials.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="pl-4 text-[13px] text-gray-500">{index + 1}</TableCell>
                                <TableCell className="text-[13px] font-medium text-blue-600">{item.serialNo}</TableCell>
                                <TableCell className="text-[13px] font-medium text-gray-800">{item.product}</TableCell>
                                <TableCell className="text-[13px] text-gray-600">{item.sku}</TableCell>
                                <TableCell>
                                    <span className="rounded border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-600">
                                        {item.variant}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="success">{item.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <tfoot className="bg-gray-50/50 border-t border-gray-100">
                        <tr>
                            <td colSpan={6} className="px-4 py-3 text-[12px] font-semibold text-gray-600">
                                Total: {serials.length} serials
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
}