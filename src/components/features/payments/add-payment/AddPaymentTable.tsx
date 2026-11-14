import { Users } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { AddPaymentManagerType } from "@/hooks/finance_hooks/payments/useAddPaymentManager";
import { AddPaymentToolbar } from "./AddPaymentToolbar";
import { AddPaymentRow } from "./AddPaymentRow";

export function AddPaymentTable({ manager }: { manager: AddPaymentManagerType }) {
    const { table, cols } = manager;

    return (
        <div className="relative flex w-full flex-col bg-white">
            <AddPaymentToolbar manager={manager} />

            {table.filteredData.length === 0 ? (
                <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <Users className="h-8 w-8 text-brand-subtext/60" />
                    <h3 className="text-sm font-bold text-brand-text">No customers or suppliers found</h3>
                    <p className="text-xs text-brand-subtext">Add them from the People page; their balances appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader>
                            {cols.name && <TableHeadCell className="min-w-[220px]">Name</TableHeadCell>}
                            {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                            {cols.businessLogo && <TableHeadCell>Business Logo</TableHeadCell>}
                            {cols.phoneNumber && <TableHeadCell>Phone Number</TableHeadCell>}
                            {cols.debit && <TableHeadCell className="text-right" title="Invoices billed">Debit</TableHeadCell>}
                            {cols.credit && <TableHeadCell className="text-right" title="Payments + returns">Credit</TableHeadCell>}
                            {cols.balance && <TableHeadCell className="text-right" title="Debit − Credit (current due)">Balance</TableHeadCell>}
                            <TableHeadCell className="min-w-[110px] pr-4 text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {table.paginatedData.map((row) => (
                                <AddPaymentRow key={row.id} row={row} cols={cols} onReceive={manager.handleReceive} onSend={manager.handleSend} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />
        </div>
    );
}
