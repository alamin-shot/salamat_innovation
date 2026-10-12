"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Search, Columns, Eye, Edit, Trash2 } from "lucide-react";
import { usePurchasesManager } from "@/hooks/usePurchasesManager";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

export function PurchasesTable() {
    const manager = usePurchasesManager();
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-brand-subtext/20 bg-white px-4 py-3">
                <div className="relative w-64">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-brand-subtext" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search purchases..."
                        value={table.searchQuery}
                        onChange={(e) => table.setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-10 pr-4 text-sm text-brand-text focus:border-emerald-500 focus:outline-none"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => manager.setShowColumnsMenu(!manager.showColumnsMenu)}
                        className="flex items-center gap-2 rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm font-medium text-brand-text hover:bg-brand-bg transition-colors"
                    >
                        <Columns className="h-4 w-4 text-brand-subtext" /> Columns
                    </button>

                    {manager.showColumnsMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => manager.setShowColumnsMenu(false)} />
                            <div className="absolute right-0 mt-2 w-48 z-20 rounded-lg border border-brand-subtext/20 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                                <div className="flex flex-col gap-2 mb-2">
                                    {Object.entries(cols).map(([key, isVisible]) => (
                                        <label key={key} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-brand-bg rounded-md">
                                            <input
                                                type="checkbox"
                                                checked={isVisible}
                                                onChange={() => manager.toggleColumn(key as keyof typeof cols)}
                                                className="rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-brand-text capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    onClick={manager.showAllColumns}
                                    className="w-full rounded-md bg-emerald-600 py-1.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                                >
                                    Show All
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Main Table Container */}
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
                        {cols.supplier && <TableHeadCell>Supplier</TableHeadCell>}
                        {cols.warehouse && <TableHeadCell>Warehouse</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.invoiceNumber && <TableHeadCell>Invoice Number</TableHeadCell>}
                        {cols.totalItem && <TableHeadCell>Total Item</TableHeadCell>}
                        {cols.totalAmount && <TableHeadCell>Total Amount</TableHeadCell>}
                        {cols.createdBy && <TableHeadCell>Created By</TableHeadCell>}
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.map((item) => (
                            <TableRow key={item.id} className={table.selectedIds.includes(item.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(item.id)}
                                        onChange={(e) => table.handleSelectRow(item.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                </TableCell>

                                {cols.supplier && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${item.badgeColor}`}>
                                                {item.supplierInitials}
                                            </div>
                                            <span className="text-sm font-medium text-brand-text">{item.supplier}</span>
                                        </div>
                                    </TableCell>
                                )}

                                {cols.warehouse && <TableCell><span className="text-sm text-brand-text">{item.warehouse}</span></TableCell>}
                                {cols.date && <TableCell><span className="text-sm text-brand-subtext">{item.date}</span></TableCell>}
                                {cols.invoiceNumber && <TableCell><span className="text-sm font-mono text-brand-subtext">{item.invoiceNumber}</span></TableCell>}
                                {cols.totalItem && <TableCell><span className="text-sm text-brand-text">{item.totalItem}</span></TableCell>}
                                {cols.totalAmount && <TableCell><span className="text-sm font-medium text-brand-text">৳ {item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></TableCell>}
                                {cols.createdBy && <TableCell><span className="text-sm text-brand-subtext">{item.createdBy}</span></TableCell>}

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => manager.handleView(item.id)} className="p-1.5 text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="View details">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => manager.handleEdit(item.id)} className="p-1.5 text-brand-subtext hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit purchase">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => manager.handleDelete(item.id)} className="p-1.5 text-brand-subtext hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete record">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {/* NATIVE TABLE FOOTER TO GUARANTEE PIXEL-PERFECT COLUMN ALIGNMENT */}
                    <tfoot className="border-t-2 border-brand-subtext/20 bg-brand-bg/5 font-bold text-brand-text text-sm">
                        <tr className="border-b-2 border-brand-subtext/20">
                            <td className="p-3"></td>
                            {cols.supplier && <td className="p-3"></td>}
                            {cols.warehouse && <td className="p-3"></td>}
                            {cols.date && <td className="p-3 text-brand-text font-bold">Total</td>}
                            {cols.invoiceNumber && <td className="p-3">20</td>}
                            {cols.totalItem && <td className="p-3 text-left font-bold">55</td>}
                            {cols.totalAmount && <td className="p-3 text-left font-bold">৳ 3,67,250.00</td>}
                            {cols.createdBy && <td className="p-3"></td>}
                            <td className="p-3"></td>
                        </tr>
                        <tr className="text-emerald-600">
                            <td className="p-3"></td>
                            {cols.supplier && <td className="p-3"></td>}
                            {cols.warehouse && <td className="p-3"></td>}
                            {cols.date && <td className="p-3 font-bold">Grand Total</td>}
                            {cols.invoiceNumber && <td className="p-3">20</td>}
                            {cols.totalItem && <td className="p-3 text-left font-bold">363</td>}
                            {cols.totalAmount && <td className="p-3 text-left font-bold">৳ 1,82,78,8.80</td>}
                            {cols.createdBy && <td className="p-3"></td>}
                            <td className="p-3"></td>
                        </tr>
                    </tfoot>
                </Table>
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