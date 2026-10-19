import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { TelesaleResultsToolbar } from "./TelesaleResultsToolbar";

export function TelesaleResultsTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const getBadgeColorStyle = (color: string) => {
        if (color === "Green") return "bg-emerald-100/70 text-emerald-700 border-emerald-200";
        if (color === "Yellow") return "bg-amber-100/70 text-amber-700 border-amber-200";
        if (color === "Red") return "bg-red-100/70 text-red-700 border-red-200";
        if (color === "Blue") return "bg-sky-100/70 text-sky-700 border-sky-200";
        return "bg-gray-100 text-gray-700 border-gray-200"; // Grey
    };

    const getStatusSelectStyle = (status: string) => {
        if (status === "Active") return "bg-emerald-100/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
        return "bg-red-100/70 text-red-700 border-red-200 hover:bg-red-100";
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <TelesaleResultsToolbar manager={manager} />

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
                        {cols.name && <TableHeadCell>Name</TableHeadCell>}
                        {cols.color && <TableHeadCell>Color</TableHeadCell>}
                        {cols.sortOrder && <TableHeadCell>Sort Order</TableHeadCell>}
                        {cols.status && <TableHeadCell>Status</TableHeadCell>}
                        <TableHeadCell className="text-right pr-4">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.paginatedData.map((row: any) => (
                            <TableRow
                                key={row.id}
                                className={table.selectedIds.includes(row.id) ? "bg-emerald-50/50" : ""}
                            >
                                <TableCell className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(row.id)}
                                        onChange={(e) => table.handleSelectRow(row.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                </TableCell>

                                {/* Name Badge */}
                                {cols.name && (
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[12px] font-semibold ${getBadgeColorStyle(
                                                row.color
                                            )}`}
                                        >
                                            {row.name}
                                        </span>
                                    </TableCell>
                                )}

                                {/* Color Dropdown via CustomSelect */}
                                {cols.color && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.color}
                                            onChange={(val) => manager.handleColorChange(row.id, val)}
                                            options={["Grey", "Green", "Yellow", "Red", "Blue"]}
                                            triggerClassName="min-w-[100px]"
                                        />
                                    </TableCell>
                                )}

                                {cols.sortOrder && (
                                    <TableCell className="text-[13px] font-medium text-gray-700">
                                        {row.sortOrder}
                                    </TableCell>
                                )}

                                {/* Status Dropdown via CustomSelect */}
                                {cols.status && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.status}
                                            onChange={(val) => manager.handleStatusChange(row.id, val)}
                                            options={["Active", "Inactive"]}
                                            triggerClassName={`min-w-[95px] ${getStatusSelectStyle(row.status)}`}
                                        />
                                    </TableCell>
                                )}

                                {/* Action Column: Strictly View, Edit, Delete */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleView(row.id)}
                                            className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleEdit(row.id)}
                                            className="text-brand-subtext hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                            title="Edit Result"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleDelete(row.id)}
                                            className="text-brand-subtext rounded-md"
                                            title="Delete Result"
                                        >
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

            <BulkActionBar
                selectedCount={table.selectedIds.length}
                onClearSelection={table.clearSelection}
            >
                <Button
                    type="button"
                    variant="destructive-ghost"
                    size="sm"
                    onClick={manager.handleBulkDelete}
                    className="gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Selected</span>
                </Button>
            </BulkActionBar>
        </div>
    );
}