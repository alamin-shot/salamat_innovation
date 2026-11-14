import { Wallet, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { PaymentListManagerType } from "@/hooks/finance_hooks/payments/usePaymentListManager";
import { PaymentListToolbar } from "./PaymentListToolbar";
import { PaymentListRow } from "./PaymentListRow";

const money = (amount: number) => `৳ ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function PaymentListTable({ manager }: { manager: PaymentListManagerType }) {
    const { table, cols } = manager;
    const totalDebit = table.filteredData.reduce((sum, row) => sum + row.debit, 0);
    const totalCredit = table.filteredData.reduce((sum, row) => sum + row.credit, 0);

    return (
        <div className="relative flex w-full flex-col bg-white">
            <PaymentListToolbar manager={manager} />

            {table.filteredData.length === 0 ? (
                <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <Wallet className="h-8 w-8 text-brand-subtext/60" />
                    <h3 className="text-sm font-bold text-brand-text">No payments match</h3>
                    <p className="text-xs text-brand-subtext">Change or clear the filters to see more records.</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 text-center">
                                <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="h-4 w-4 cursor-pointer rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500" />
                            </TableHeadCell>
                            {cols.contact && <TableHeadCell className="min-w-[200px]">Contact</TableHeadCell>}
                            {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                            {cols.businessLogo && <TableHeadCell>Business Logo</TableHeadCell>}
                            {cols.date && <TableHeadCell>Date</TableHeadCell>}
                            {cols.invoiceNumber && <TableHeadCell>Payment / Invoice</TableHeadCell>}
                            {cols.type && <TableHeadCell>Type</TableHeadCell>}
                            {cols.debit && <TableHeadCell className="text-right">Debit</TableHeadCell>}
                            {cols.credit && <TableHeadCell className="text-right">Credit</TableHeadCell>}
                            <TableHeadCell className="min-w-[100px] pr-4 text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {table.paginatedData.map((row) => (
                                <PaymentListRow
                                    key={row.id}
                                    row={row}
                                    cols={cols}
                                    isSelected={table.selectedIds.includes(row.id)}
                                    onToggle={table.handleSelectRow}
                                    onVoucher={manager.handleViewVoucher}
                                    onDelete={manager.handleDelete}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Totals of everything the filters and search currently match. */}
            {table.filteredData.length > 0 && (
                <div className="flex flex-wrap items-center justify-end gap-6 border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                    <span className="text-sm text-gray-500">Total Debit <b className="ml-2 text-lg tabular-nums text-gray-900">{money(totalDebit)}</b></span>
                    <span className="text-sm text-gray-500">Total Credit <b className="ml-2 text-lg tabular-nums text-gray-900">{money(totalCredit)}</b></span>
                </div>
            )}

            <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <Button type="button" variant="destructive-ghost" size="sm" onClick={manager.handleBulkDelete} className="gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </Button>
            </BulkActionBar>
        </div>
    );
}
