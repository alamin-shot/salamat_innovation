import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { RetailerToolbar } from "./RetailerToolbar";

export function RetailerTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <RetailerToolbar manager={manager} />
            <div className="overflow-x-auto custom-scrollbar flex-1 flex flex-col justify-between">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12 text-center">
                            <input type="checkbox" checked={table.isAllSelected} onChange={(e) => table.handleSelectAll(e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                        </TableHeadCell>
                        {cols.customer && <TableHeadCell>Customer</TableHeadCell>}
                        {cols.businessName && <TableHeadCell>Business Name</TableHeadCell>}
                        {cols.primaryPhone && <TableHeadCell>Primary Phone</TableHeadCell>}
                        {cols.email && <TableHeadCell>Email</TableHeadCell>}
                        {cols.address && <TableHeadCell>Address</TableHeadCell>}
                        {cols.status && <TableHeadCell>Status</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4 min-w-[100px]">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {table.paginatedData.map((row: any) => (
                            <TableRow key={row.id} className={table.selectedIds.includes(row.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="text-center">
                                    <input type="checkbox" checked={table.selectedIds.includes(row.id)} onChange={(e) => table.handleSelectRow(row.id, e.target.checked)} className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 cursor-pointer" />
                                </TableCell>
                                {cols.customer && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {row.logo ? (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-800 text-xs font-bold text-white">{row.logo}</div>
                                            ) : (
                                                <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">No IMG</div>
                                            )}
                                            <span className="text-[13px] font-medium text-gray-800">{row.name}</span>
                                        </div>
                                    </TableCell>
                                )}
                                {cols.businessName && <TableCell className="text-[13px] text-gray-600">{row.businessName}</TableCell>}
                                {cols.primaryPhone && <TableCell className="text-[13px] text-gray-600">{row.primaryPhone}</TableCell>}
                                {cols.email && <TableCell className="text-[13px] text-gray-600">{row.email}</TableCell>}
                                {cols.address && <TableCell className="text-[13px] text-gray-600 truncate max-w-[150px]" title={row.address}>{row.address}</TableCell>}

                                {cols.status && (
                                    <TableCell>
                                        {/* Inline native select for fast table editing */}
                                        <select
                                            value={row.status}
                                            onChange={(e) => manager.handleStatusChange(row.id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2.5 py-1 border outline-none cursor-pointer ${row.status === "Active"
                                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                }`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </TableCell>
                                )}

                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleEdit(row.id)} className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="Edit Retailer"><Edit className="h-4 w-4" /></Button>
                                        <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(row.id)} className="text-brand-subtext rounded-md" title="Delete Retailer"><Trash2 className="h-4 w-4" /></Button>
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