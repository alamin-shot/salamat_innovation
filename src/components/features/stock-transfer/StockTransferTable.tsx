"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCommandParams } from "@/hooks/useCommandParams";

export function StockTransferTable({ transfers }: { transfers: any[] }) {
    const { openView } = useCommandParams();

    return (
        <div className="overflow-x-auto border-b border-gray-200">
            <Table>
                <TableHeader>
                    <TableHeadCell className="font-semibold text-gray-600 pl-4">Ref #</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">From Shop</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">To Shop</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">Date</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">Created At</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">Items</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600">Status</TableHeadCell>
                    <TableHeadCell className="font-semibold text-gray-600 text-right pr-4">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {transfers.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="pl-4 text-[13px] font-medium text-gray-700">{row.ref}</TableCell>
                            <TableCell className="text-[13px] text-gray-600">{row.fromShop}</TableCell>
                            <TableCell className="text-[13px] text-gray-600">{row.toShop}</TableCell>
                            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
                            <TableCell className="text-[13px] text-gray-600">{row.createdAt}</TableCell>
                            <TableCell className="text-[13px] text-gray-600">{row.items}</TableCell>
                            <TableCell>
                                <Badge variant={row.status === "Approved" ? "success" : "destructive"}>
                                    {row.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4">
                                {/* Triggers View Drawer via Command Params */}
                                <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "view-stock-transfer", row.id)} title="View Details">
                                    <Eye className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}