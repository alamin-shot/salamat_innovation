import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Printer, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ExpensesToolbar } from "./ExpensesToolbar";
import { ExpenseInlineNoteCell } from "./ExpenseInlineCells";
import { ExpensesManagerType } from "@/hooks/finance_hooks/expenses/useExpensesManager";
import { formatCurrency } from "@/utils/formatters";

export function ExpensesTable({ manager }: { manager: ExpensesManagerType }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <ExpensesToolbar manager={manager} />

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
                        {cols.shopName && <TableHeadCell>Shop Name</TableHeadCell>}
                        {cols.title && <TableHeadCell>Title</TableHeadCell>}
                        {cols.invoiceNumber && <TableHeadCell>Invoice Number</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.category && <TableHeadCell>Category</TableHeadCell>}
                        {cols.attachments && <TableHeadCell>Attachments</TableHeadCell>}
                        {cols.note && <TableHeadCell>Note</TableHeadCell>}
                        {cols.paymentMethod && <TableHeadCell>Payment Method</TableHeadCell>}
                        {cols.amount && <TableHeadCell>Amount</TableHeadCell>}
                        {cols.createdBy && <TableHeadCell>Created By</TableHeadCell>}
                        <TableHeadCell className="w-28 text-right pr-4">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.paginatedData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(row.id)}
                                        onChange={(e) => table.handleSelectRow(row.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                </TableCell>
                                {cols.shopName && <TableCell className="text-[13px] text-gray-700">{row.shopName}</TableCell>}
                                {cols.title && <TableCell className="text-[13px] text-gray-900 font-medium">{row.title}</TableCell>}
                                {cols.invoiceNumber && <TableCell className="text-[13px] text-emerald-700 font-medium">{row.invoiceNumber}</TableCell>}
                                {cols.date && <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>}

                                {cols.category && (
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {row.category}
                                        </span>
                                    </TableCell>
                                )}

                                {cols.attachments && <TableCell className="text-[13px] text-gray-400">{row.attachments > 0 ? row.attachments : "-"}</TableCell>}
                                {cols.note && <TableCell><ExpenseInlineNoteCell rowId={row.id} note={row.note} manager={manager} /></TableCell>}

                                {cols.paymentMethod && (
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-[12px] text-gray-700 font-medium bg-gray-50 px-2 py-0.5 rounded w-fit">
                                            💵 {row.paymentMethod}
                                        </div>
                                    </TableCell>
                                )}

                                {cols.amount && <TableCell className="text-[13px] text-gray-700 font-medium">{formatCurrency(row.amount)}</TableCell>}
                                {cols.createdBy && <TableCell className="text-[13px] text-gray-600">{row.createdBy}</TableCell>}

                                {/* Action Column: Strictly Print, Edit, Delete */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handlePrintVoucher(row.id)} className="text-blue-600 hover:bg-blue-50 rounded-md" title="Print Voucher">
                                            <Printer className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleEdit(row.id)} className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="Edit Expense">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(row.id)} className="text-brand-subtext rounded-md" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    currentPage={manager.currentPage}
                    totalPages={Math.max(1, Math.ceil(table.filteredData.length / manager.itemsPerPage))}
                    onPageChange={manager.setCurrentPage}
                    itemsPerPage={manager.itemsPerPage}
                    onItemsPerPageChange={manager.setItemsPerPage}
                />
            </div>

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <Button type="button" variant="outline" size="sm" onClick={manager.handleBulkReport} className="gap-2 rounded-lg border-white/20 bg-transparent px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download Report ({table.selectedIds.length})</span>
                </Button>
                <Button type="button" variant="destructive-ghost" size="sm" onClick={manager.handleBulkDelete} className="gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </Button>
            </BulkActionBar>
        </div>
    );
}