"use client";
import { ReelsManagerType } from "@/hooks/reels_hooks/useReelsManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2 } from "lucide-react";

export function ReelsTable({ manager }: { manager: ReelsManagerType }) {
    const { table, openEditDrawer, handleDelete } = manager;

    return (
        <div className="overflow-x-auto flex-1 min-h-[400px] flex flex-col">
            <Table>
                <TableHeader>
                    <TableHeadCell className="w-12">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            checked={table.selectedIds.length === table.paginatedData.length && table.paginatedData.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    table.setSelectedIds(table.paginatedData.map(r => r.id));
                                } else {
                                    table.setSelectedIds([]);
                                }
                            }}
                        />
                    </TableHeadCell>
                    <TableHeadCell>Product</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {table.paginatedData.map((reel) => (
                        <TableRow key={reel.id}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    checked={table.selectedIds.includes(reel.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            table.setSelectedIds([...table.selectedIds, reel.id]);
                                        } else {
                                            table.setSelectedIds(table.selectedIds.filter(id => id !== reel.id));
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">{reel.productName}</TableCell>
                            <TableCell>
                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${reel.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                    }`}>
                                    {reel.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                        title="Edit"
                                        onClick={() => openEditDrawer(reel.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-red-600 hover:bg-red-50"
                                        title="Delete"
                                        onClick={() => handleDelete(reel.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                    {table.paginatedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-16 text-gray-500">
                                No reels videos found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="border-t border-gray-100 p-4 sm:px-6 mt-auto shrink-0">
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    onPageChange={table.setCurrentPage}
                    itemsPerPage={table.itemsPerPage}
                    onItemsPerPageChange={table.setItemsPerPage}
                />
            </div>
        </div>
    );
}