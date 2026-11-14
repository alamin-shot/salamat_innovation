"use client";
import * as React from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Pagination } from "@/components/ui/Pagination";
import { SalesListManager } from "@/hooks/sales_hooks/useSalesListManager";
import { SaleListRow } from "./SaleListRow";

const HEAD = "font-semibold text-gray-600";

export function SaleListTable({ manager }: { manager: SalesListManager }) {
    const { table } = manager;

    return (
        <div className="flex flex-col gap-4">
            {table.selectedIds.length > 0 && (
                <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                    <Button variant="destructive" size="sm" onClick={manager.handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="border-b border-gray-100 p-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} placeholder="Search customer, invoice or seller" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
                    </div>
                </div>

                {table.filteredData.length === 0 ? (
                    <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <ShoppingCart className="h-8 w-8 text-brand-subtext/60" />
                        <h3 className="text-sm font-bold text-brand-text">No sales found</h3>
                        <p className="text-xs text-brand-subtext">Sales saved from Add Sale appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableHeadCell className="w-10 pl-4">
                                    <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                </TableHeadCell>
                                <TableHeadCell className={HEAD}>Customer</TableHeadCell>
                                <TableHeadCell className={HEAD}>Date</TableHeadCell>
                                <TableHeadCell className={HEAD}>Invoice Number</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-center`}>Total Item</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-right`}>S.Cost</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-right`}>Total Amount</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-right`}>Due Amount</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-right`}>Received Amount</TableHeadCell>
                                <TableHeadCell className={HEAD}>Payment Method</TableHeadCell>
                                <TableHeadCell className={HEAD}>Status</TableHeadCell>
                                <TableHeadCell className={HEAD}>Seller</TableHeadCell>
                                <TableHeadCell className={HEAD}>Courier Order</TableHeadCell>
                                <TableHeadCell className={`${HEAD} text-right`}>Action</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                {table.paginatedData.map((row) => (
                                    <SaleListRow
                                        key={row.id}
                                        row={row}
                                        isSelected={table.selectedIds.includes(row.id)}
                                        onToggle={table.handleSelectRow}
                                        onView={manager.openView}
                                        onEdit={manager.openEdit}
                                        onDelete={manager.handleDelete}
                                        onSeller={manager.openSellerModal}
                                        onCourier={manager.setCourier}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />
            </div>
        </div>
    );
}
