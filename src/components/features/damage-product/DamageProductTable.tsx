"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { ChevronDown, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { DamageProductToolbar } from "./DamageProductToolbar";

export function DamageProductTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const getBadgeVariant = (status: string) => {
        if (status === "Approved") return "success";
        if (status === "Cancelled") return "destructive";
        return "default";
    };

    const getStatusSelectStyle = (status: string) => {
        if (status === "Approved") return "bg-emerald-100/60 text-emerald-700 border-emerald-200";
        if (status === "Cancelled") return "bg-red-100/60 text-red-700 border-red-200";
        return "bg-gray-100 text-gray-700 border-gray-200"; // "Draft"
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <DamageProductToolbar manager={manager} />

            <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col justify-between">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12 text-center">
                            <input
                                type="checkbox"
                                checked={table.isAllSelected}
                                onChange={(e) => table.handleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                        </TableHeadCell>
                        {cols.ref && <TableHeadCell>Ref #</TableHeadCell>}
                        {cols.shop && <TableHeadCell>Shop</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.createdAt && <TableHeadCell>Created At</TableHeadCell>}
                        {cols.items && <TableHeadCell>Items</TableHeadCell>}
                        {cols.status && <TableHeadCell>Status</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.paginatedData.map((row: any) => (
                            <TableRow key={row.id} className={table.selectedIds.includes(row.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(row.id)}
                                        onChange={(e) => table.handleSelectRow(row.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                </TableCell>
                                {cols.ref && <TableCell className="text-sm font-medium text-brand-text">{row.ref}</TableCell>}
                                {cols.shop && <TableCell className="text-sm text-brand-subtext">{row.shop}</TableCell>}
                                {cols.date && <TableCell className="text-sm text-brand-subtext">{row.date}</TableCell>}
                                {cols.createdAt && <TableCell className="text-sm text-brand-subtext">{row.createdAt}</TableCell>}
                                {cols.items && <TableCell className="text-sm text-brand-text">{row.items}</TableCell>}
                                {cols.status && (
                                    <TableCell>
                                        <div className="relative inline-flex items-center">
                                            <select
                                                value={row.status}
                                                onChange={(e) =>
                                                    manager.handleStatusChange(
                                                        row.id,
                                                        e.target.value as "Draft" | "Approved" | "Cancelled"
                                                    )
                                                }
                                                className={`appearance-none rounded-full border pl-2.5 pr-6 py-0.5 text-[11px] font-medium cursor-pointer focus:outline-none ${getStatusSelectStyle(row.status)}`}
                                            >
                                                <option value="Draft" className="bg-white text-gray-700">Draft</option>
                                                <option value="Approved" className="bg-white text-emerald-700">Approved</option>
                                                <option value="Cancelled" className="bg-white text-red-700">Cancelled</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2 h-3 w-3 opacity-60" />
                                        </div>
                                    </TableCell>
                                )}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => manager.handleView(row.id)}
                                            className="p-1.5 text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                            title="View details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => manager.handleDelete(row.id)}
                                            className="p-1.5 text-brand-subtext hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete record"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination />
            </div>

            <BulkActionBar
                selectedCount={table.selectedIds.length}
                onClearSelection={table.clearSelection}
            >
                <button
                    onClick={manager.handleBulkDelete}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </button>
            </BulkActionBar>
        </div>
    );
}