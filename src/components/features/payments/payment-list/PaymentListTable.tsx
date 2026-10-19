import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { PaymentListToolbar } from "./PaymentListToolbar";

export function PaymentListTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const formatCurrency = (amount: number) => `৳ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

    const getAvatarColor = (name: string) => {
        const colors = ["bg-emerald-800", "bg-sky-800", "bg-indigo-800", "bg-rose-800", "bg-amber-700"];
        return colors[name.length % colors.length];
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <PaymentListToolbar manager={manager} />

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
                        {cols.contact && <TableHeadCell className="min-w-[180px]">Contact</TableHeadCell>}
                        {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                        {cols.businessLogo && <TableHeadCell>Business Logo</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.invoiceNumber && <TableHeadCell>Invoice Number</TableHeadCell>}
                        {cols.type && <TableHeadCell>Type</TableHeadCell>}
                        {cols.debit && <TableHeadCell>Debit</TableHeadCell>}
                        {cols.credit && <TableHeadCell>Credit</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4 min-w-[100px]">Action</TableHeadCell>
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

                                {cols.contact && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(row.contact)}`}>
                                                {getInitials(row.contact)}
                                            </div>
                                            <span className="text-[13px] font-medium text-gray-800">{row.contact}</span>
                                        </div>
                                    </TableCell>
                                )}

                                {cols.businessName && <TableCell className="text-[13px] text-gray-600">{row.businessName}</TableCell>}

                                {cols.businessLogo && (
                                    <TableCell>
                                        {row.businessLogo !== "-" ? (
                                            <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-900 text-[10px] font-bold text-amber-500">
                                                {row.businessLogo}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                )}

                                {cols.date && <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>}
                                {cols.invoiceNumber && <TableCell className="text-[13px] text-gray-600">{row.invoiceNumber}</TableCell>}

                                {cols.type && (
                                    <TableCell>
                                        <span className={`inline-flex rounded px-2.5 py-0.5 text-[11px] font-medium ${row.type === "payment received" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {row.type}
                                        </span>
                                    </TableCell>
                                )}

                                {cols.debit && <TableCell className="text-[13px] text-gray-700">{formatCurrency(row.debit)}</TableCell>}
                                {cols.credit && <TableCell className="text-[13px] text-gray-700">{formatCurrency(row.credit)}</TableCell>}

                                {/* Action Column: Strictly Voucher & Delete */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleViewVoucher(row.id)} className="text-blue-600 hover:bg-blue-50 rounded-md" title="Debit Voucher">
                                            <FileText className="h-4 w-4" />
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