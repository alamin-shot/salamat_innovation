import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { ExpenseCategoriesToolbar } from "./ExpenseCategoriesToolbar";

export function ExpenseCategoriesTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <ExpenseCategoriesToolbar manager={manager} />

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
                        {cols.logo && <TableHeadCell>Logo</TableHeadCell>}
                        {cols.totalCount && <TableHeadCell>Total Expense Count</TableHeadCell>}
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

                                {cols.name && <TableCell className="text-[13px] font-medium text-gray-700">{row.name}</TableCell>}

                                {cols.logo && (
                                    <TableCell>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-lg shadow-sm">
                                            {row.logo || "📁"}
                                        </div>
                                    </TableCell>
                                )}

                                {cols.totalCount && <TableCell className="text-[13px] text-gray-600">{row.totalCount}</TableCell>}

                                {/* Action Column: Strictly Edit & Delete */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => manager.handleEdit(row.id)} className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md" title="Edit Category">
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