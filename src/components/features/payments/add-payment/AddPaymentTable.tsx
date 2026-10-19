import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { AddPaymentToolbar } from "./AddPaymentToolbar";

export function AddPaymentTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const formatCurrency = (amount: number) => `৳ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <AddPaymentToolbar manager={manager} />

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
                        {cols.name && <TableHeadCell className="min-w-[200px]">Name</TableHeadCell>}
                        {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                        {cols.businessLogo && <TableHeadCell>Business Logo</TableHeadCell>}
                        {cols.phoneNumber && <TableHeadCell>Phone Number</TableHeadCell>}
                        {cols.debit && <TableHeadCell>Debit</TableHeadCell>}
                        {cols.credit && <TableHeadCell>Credit</TableHeadCell>}
                        {cols.balance && <TableHeadCell>Balance</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4 min-w-[140px]">Action</TableHeadCell>
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

                                {cols.name && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                                                {getInitials(row.name)}
                                            </div>
                                            <span className="text-[13px] font-medium text-gray-800">{row.name}</span>
                                        </div>
                                    </TableCell>
                                )}

                                {cols.businessName && <TableCell className="text-[13px] text-gray-600">{row.businessName}</TableCell>}
                                {cols.businessLogo && <TableCell className="text-[13px] text-gray-400">{row.businessLogo}</TableCell>}
                                {cols.phoneNumber && <TableCell className="text-[13px] text-gray-600">{row.phoneNumber}</TableCell>}

                                {cols.debit && <TableCell className="text-[13px] text-gray-700">{formatCurrency(row.debit)}</TableCell>}
                                {cols.credit && <TableCell className="text-[13px] text-gray-700">{formatCurrency(row.credit)}</TableCell>}

                                {cols.balance && (
                                    <TableCell className={`text-[13px] font-medium ${row.balance < 0 ? "text-gray-600" : "text-gray-900"}`}>
                                        {formatCurrency(row.balance)}
                                    </TableCell>
                                )}

                                {/* Action Column: Strictly Receive, Send, Delete */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleReceive(row.id)} className="text-emerald-600 hover:bg-emerald-50 rounded-md" title="Receive Payment">
                                            <ArrowDownLeft className="h-4 w-4" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleSend(row.id)} className="text-blue-600 hover:bg-blue-50 rounded-md" title="Send Payment">
                                            <ArrowUpRight className="h-4 w-4" />
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
                <Pagination />
            </div>

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <Button type="button" variant="destructive-ghost" size="sm" onClick={manager.handleBulkDelete} className="gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </Button>
            </BulkActionBar>
        </div>
    );
}