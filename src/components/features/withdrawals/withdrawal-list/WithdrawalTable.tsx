import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { WithdrawalToolbar } from "./WithdrawalToolbar";
import { WithdrawalInlineNoteCell } from "./WithdrawalInlineCells";

export function WithdrawalTable({ manager }: { manager: any }) {
    const { table, cols } = manager;
    const formatCurrency = (amount: number) => `৳ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <WithdrawalToolbar manager={manager} />
            <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col justify-between">
                <Table>
                    {/* ... TableHeader is unchanged ... */}
                    <TableHeader>
                        <TableHeadCell className="w-12 text-center">
                            <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                        </TableHeadCell>
                        {cols.director && <TableHeadCell className="min-w-[200px]">Director</TableHeadCell>}
                        {cols.shopName && <TableHeadCell>Shop Name</TableHeadCell>}
                        {cols.title && <TableHeadCell className="min-w-[200px]">Title</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.contact && <TableHeadCell>Contact</TableHeadCell>}
                        {cols.attachments && <TableHeadCell>Attachments</TableHeadCell>}
                        {cols.note && <TableHeadCell>Note</TableHeadCell>}
                        {cols.amount && <TableHeadCell>Amount</TableHeadCell>}
                        {cols.createdBy && <TableHeadCell className="min-w-[160px]">Created By</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4 min-w-[100px]">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {table.paginatedData.map((row: any) => (
                            <TableRow key={row.id} className={table.selectedIds.includes(row.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="text-center">
                                    <input type="checkbox" checked={table.selectedIds.includes(row.id)} onChange={(e) => table.handleSelectRow(row.id, e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 cursor-pointer" />
                                </TableCell>
                                {cols.director && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-xs font-bold text-white">{row.directorAvatar}</div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-medium text-gray-800">{row.directorName}</span>
                                                <span className="text-[10px] text-gray-400">WTH-{row.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                )}
                                {cols.shopName && <TableCell className="text-[13px] text-gray-600">{row.shopName}</TableCell>}
                                {cols.title && <TableCell className="text-[13px] text-gray-700">{row.title}</TableCell>}
                                {cols.date && <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>}
                                {cols.contact && <TableCell className="text-[13px] text-gray-600">{row.contact}</TableCell>}

                                {/* FIXED: Attachment Button */}
                                {cols.attachments && (
                                    <TableCell>
                                        {row.attachments > 0 ? (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => manager.handleViewAttachment(row.id)}
                                                className="text-blue-600 hover:bg-blue-50 rounded-md"
                                                title="View Attachment"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <span className="text-[13px] text-gray-400 pl-2">-</span>
                                        )}
                                    </TableCell>
                                )}

                                {cols.note && <TableCell><WithdrawalInlineNoteCell rowId={row.id} note={row.note} manager={manager} /></TableCell>}
                                {cols.amount && <TableCell className="text-[13px] text-gray-700 font-medium">{formatCurrency(row.amount)}</TableCell>}
                                {cols.createdBy && <TableCell className="text-[13px] text-gray-600">{row.createdBy}</TableCell>}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleEdit(row.id)} className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="Edit Withdrawal"><Edit className="h-4 w-4" /></Button>
                                        <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(row.id)} className="text-brand-subtext rounded-md" title="Delete"><Trash2 className="h-4 w-4" /></Button>
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