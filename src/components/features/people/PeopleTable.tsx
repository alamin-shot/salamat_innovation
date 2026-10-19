import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { PeopleToolbar } from "./PeopleToolbar";
import { InlineNoteCell, InlinePriceDocCell, InlineAddressCell } from "./PeopleInlineCells";

export function PeopleTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    const getTypeSelectStyle = (type: string) => {
        if (type === "Online Customer") return "bg-sky-100/70 text-sky-700 border-sky-200 hover:bg-sky-100";
        if (type === "Offline Customer") return "bg-emerald-100/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
        return "bg-amber-100/70 text-amber-700 border-amber-200 hover:bg-amber-100";
    };

    const getStatusSelectStyle = (status: string) => {
        if (status === "Active") return "bg-emerald-100/70 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
        return "bg-red-100/70 text-red-700 border-red-200 hover:bg-red-100";
    };

    const getRatingSelectStyle = (rating: string) => {
        if (rating === "Unrated") return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200/60";
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
    };

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <PeopleToolbar manager={manager} />

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
                        {cols.type && <TableHeadCell>Type</TableHeadCell>}
                        {cols.status && <TableHeadCell>Status</TableHeadCell>}
                        {cols.businessName && <TableHeadCell className="min-w-[150px]">Business Name</TableHeadCell>}
                        {cols.phoneNumber && <TableHeadCell>Phone Number</TableHeadCell>}
                        {cols.email && <TableHeadCell>Email</TableHeadCell>}
                        {cols.address && <TableHeadCell>Address</TableHeadCell>}
                        {cols.district && <TableHeadCell>District</TableHeadCell>}
                        {cols.area && <TableHeadCell>Area</TableHeadCell>}
                        {cols.rating && <TableHeadCell>Rating</TableHeadCell>}
                        {cols.note && <TableHeadCell>Note</TableHeadCell>}
                        {cols.priceDocument && <TableHeadCell className="min-w-[140px]">Price Document</TableHeadCell>}
                        {cols.history && <TableHeadCell>History</TableHeadCell>}
                        {cols.createdAt && <TableHeadCell className="min-w-[110px]">Created at</TableHeadCell>}
                        {cols.dateOfBirth && <TableHeadCell className="min-w-[110px]">Date of Birth</TableHeadCell>}
                        {cols.gender && <TableHeadCell>Gender</TableHeadCell>}
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

                                {/* Name + Emerald Initials Circle */}
                                {cols.name && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                                                {row.initials}
                                            </div>
                                            <span className="text-[13px] font-medium text-gray-800 whitespace-nowrap">
                                                {row.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                )}

                                {/* Type Dropdown via CustomSelect */}
                                {cols.type && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.type}
                                            onChange={(val) => manager.handleTypeChange(row.id, val)}
                                            options={["Online Customer", "Offline Customer", "Supplier"]}
                                            triggerClassName={getTypeSelectStyle(row.type)}
                                        />
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

                                {/* Business Name */}
                                {cols.businessName && (
                                    <TableCell>
                                        {row.businessName !== "—" ? (
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-[10px] font-bold text-emerald-700">
                                                    MT
                                                </span>
                                                <span className="text-[13px] text-gray-700">{row.businessName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                )}

                                {cols.phoneNumber && (
                                    <TableCell className="text-[13px] text-gray-600 whitespace-nowrap">
                                        {row.phoneNumber}
                                    </TableCell>
                                )}

                                {cols.email && (
                                    <TableCell className="text-[13px] text-gray-600 whitespace-nowrap">
                                        {row.email}
                                    </TableCell>
                                )}

                                {cols.address && (
                                    <TableCell>
                                        <InlineAddressCell
                                            rowId={row.id}
                                            address={row.address}
                                            manager={manager}
                                        />
                                    </TableCell>
                                )}

                                {cols.district && (
                                    <TableCell className="text-[13px] text-gray-500">{row.district}</TableCell>
                                )}

                                {cols.area && (
                                    <TableCell className="text-[13px] text-gray-500">{row.area}</TableCell>
                                )}

                                {/* Rating Dropdown via CustomSelect */}
                                {cols.rating && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.rating}
                                            onChange={(val) => manager.handleRatingChange(row.id, val)}
                                            options={["Unrated", "1 ★", "2 ★", "3 ★", "4 ★", "5 ★"]}
                                            triggerClassName={`min-w-[92px] ${getRatingSelectStyle(row.rating)}`}
                                        />
                                    </TableCell>
                                )}

                                {/* Inline Note Popover */}
                                {cols.note && (
                                    <TableCell>
                                        <InlineNoteCell
                                            rowId={row.id}
                                            note={row.note}
                                            manager={manager}
                                        />
                                    </TableCell>
                                )}

                                {/* Inline Price Document Upload */}
                                {cols.priceDocument && (
                                    <TableCell>
                                        <InlinePriceDocCell
                                            fileName={row.priceDocument}
                                            onUpload={(name) => manager.handlePriceDocChange(row.id, name)}
                                        />
                                    </TableCell>
                                )}

                                {/* History Quick Button */}
                                {cols.history && (
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => manager.handleViewHistory(row.id)}
                                            className="h-7 gap-1 rounded-md border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                        >
                                            <History className="h-3 w-3" />
                                            <span>History</span>
                                        </Button>
                                    </TableCell>
                                )}

                                {cols.createdAt && (
                                    <TableCell className="text-[13px] text-gray-500 whitespace-nowrap">
                                        {row.createdAt}
                                    </TableCell>
                                )}

                                {cols.dateOfBirth && (
                                    <TableCell className="text-[13px] text-gray-500">{row.dateOfBirth}</TableCell>
                                )}

                                {cols.gender && (
                                    <TableCell className="text-[13px] text-gray-500">{row.gender}</TableCell>
                                )}

                                {/* Action Column: Strictly View, Edit, Delete using <Button> */}
                                <TableCell className="text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleView(row.id)}
                                            className="text-brand-subtext hover:text-emerald-600 hover:bg-emerald-50 rounded-md"
                                            title="View details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleEdit(row.id)}
                                            className="text-brand-subtext hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                            title="Edit person"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleDelete(row.id)}
                                            className="text-brand-subtext rounded-md"
                                            title="Delete record"
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