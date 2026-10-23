import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ApplicationToolbar } from "./ApplicationToolbar";

export function ApplicationTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <ApplicationToolbar manager={manager} />
            <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col justify-between">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12 text-center">
                            <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                        </TableHeadCell>
                        {cols.name && <TableHeadCell>Name</TableHeadCell>}
                        {cols.phone && <TableHeadCell>Primary Phone</TableHeadCell>}
                        {cols.email && <TableHeadCell>Email</TableHeadCell>}
                        {cols.address && <TableHeadCell>Address</TableHeadCell>}
                        {cols.status && <TableHeadCell className="w-36">Status</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4 min-w-[120px]">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {table.paginatedData.map((row: any) => (
                            <TableRow key={row.id} className={table.selectedIds.includes(row.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="text-center">
                                    <input type="checkbox" checked={table.selectedIds.includes(row.id)} onChange={(e) => table.handleSelectRow(row.id, e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 cursor-pointer" />
                                </TableCell>
                                {cols.name && (
                                    <TableCell>
                                        <span className="text-[13px] font-medium text-gray-800">{row.name}</span>
                                    </TableCell>
                                )}
                                {cols.phone && <TableCell className="text-[13px] text-gray-600">{row.phone}</TableCell>}
                                {cols.email && <TableCell className="text-[13px] text-gray-600">{row.email}</TableCell>}
                                {cols.address && <TableCell className="text-[13px] text-gray-600 truncate max-w-[200px]" title={row.address}>{row.address}</TableCell>}

                                {cols.status && (
                                    <TableCell>
                                        <select
                                            value={row.status}
                                            onChange={(e) => manager.handleStatusChange(row.id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer ${row.status === "Approved" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" :
                                                row.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" :
                                                    "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </TableCell>
                                )}

                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleView(row.id)} className="text-brand-subtext hover:text-blue-600 hover:bg-blue-50 rounded-md" title="View"><Eye className="h-4 w-4" /></Button>
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleEdit(row.id)} className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="Edit"><Edit className="h-4 w-4" /></Button>
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