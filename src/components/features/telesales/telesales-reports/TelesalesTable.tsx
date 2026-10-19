import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { TelesalesToolbar } from "./TelesalesToolbar";
import { TelesalesNoteCell } from "./TelesalesNoteCell";

export function TelesalesTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const getResultSelectStyle = (result: string) => {
        if (result === "Shop Visit") return "bg-emerald-100/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
        if (result === "Follow Up") return "bg-amber-100/70 text-amber-700 border-amber-200 hover:bg-amber-100";
        return "bg-yellow-100/70 text-yellow-800 border-yellow-200 hover:bg-yellow-100"; // Waiting
    };

    const getMediaSelectStyle = (media: string) => {
        if (media === "-") return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200/60";
        return "bg-emerald-100/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <TelesalesToolbar manager={manager} />

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
                        {cols.date && <TableHeadCell className="min-w-[115px]">Date</TableHeadCell>}
                        {cols.customer && <TableHeadCell className="min-w-[160px]">Customer</TableHeadCell>}
                        {cols.customerNumber && <TableHeadCell className="min-w-[170px]">Customer Number</TableHeadCell>}
                        {cols.address && <TableHeadCell>Address</TableHeadCell>}
                        {cols.customerDemand && <TableHeadCell className="min-w-[160px]">Customer Demand</TableHeadCell>}
                        {cols.media && <TableHeadCell>Media</TableHeadCell>}
                        {cols.note && <TableHeadCell>Note</TableHeadCell>}
                        {cols.result && <TableHeadCell>Result</TableHeadCell>}
                        {cols.salesmanName && <TableHeadCell className="min-w-[170px]">Salesman Name</TableHeadCell>}
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

                                {cols.date && (
                                    <TableCell className="text-[13px] text-gray-600 whitespace-nowrap">
                                        {row.date}
                                    </TableCell>
                                )}

                                {cols.customer && (
                                    <TableCell className="text-[13px] font-medium text-gray-800 whitespace-nowrap">
                                        {row.customer}
                                    </TableCell>
                                )}

                                {/* Customer Number + New Badge */}
                                {cols.customerNumber && (
                                    <TableCell>
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="text-[13px] text-gray-700">{row.customerNumber}</span>
                                            <span className="rounded bg-emerald-100/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                {row.customerType}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}

                                {cols.address && (
                                    <TableCell className="text-[13px] text-gray-500">{row.address}</TableCell>
                                )}

                                {cols.customerDemand && (
                                    <TableCell className="text-[13px] text-gray-700 whitespace-nowrap">
                                        {row.customerDemand}
                                    </TableCell>
                                )}

                                {/* Media Pill Dropdown via CustomSelect */}
                                {cols.media && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.media}
                                            onChange={(val) => manager.handleMediaChange(row.id, val)}
                                            options={["Messenger", "WhatsApp", "Phone Call", "-"]}
                                            triggerClassName={`min-w-[110px] ${getMediaSelectStyle(row.media)}`}
                                        />
                                    </TableCell>
                                )}

                                {/* Note Eye Popover Cell */}
                                {cols.note && (
                                    <TableCell>
                                        <TelesalesNoteCell
                                            rowId={row.id}
                                            note={row.note}
                                            manager={manager}
                                        />
                                    </TableCell>
                                )}

                                {/* Result Pill Dropdown via CustomSelect (Replaces Update Result Modal) */}
                                {cols.result && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.result}
                                            onChange={(val) => manager.handleResultChange(row.id, val)}
                                            options={["Shop Visit", "Follow Up", "Waiting"]}
                                            triggerClassName={`min-w-[110px] ${getResultSelectStyle(row.result)}`}
                                        />
                                    </TableCell>
                                )}

                                {cols.salesmanName && (
                                    <TableCell className="text-[13px] text-gray-600 whitespace-nowrap">
                                        {row.salesmanName}
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
                                            title="Edit Telesale"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleDelete(row.id)}
                                            className="text-brand-subtext rounded-md"
                                            title="Delete Telesale"
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