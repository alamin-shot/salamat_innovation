import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { OrderListToolbar } from "./OrderListToolbar";
import { OrderInlineAddressCell, OrderInlineNoteCell } from "./OrderInlineCells";

export function OrderListTable({ manager }: { manager: any }) {
    const { table, cols } = manager;

    return (
        <div className="flex flex-col w-full h-full relative bg-white">
            <OrderListToolbar manager={manager} />

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
                        {cols.customer && <TableHeadCell className="min-w-[170px]">Customer</TableHeadCell>}
                        {cols.date && <TableHeadCell>Date</TableHeadCell>}
                        {cols.confirmationDate && <TableHeadCell>Confirmation Date</TableHeadCell>}
                        {cols.product && <TableHeadCell className="min-w-[180px]">Product</TableHeadCell>}
                        {cols.address && <TableHeadCell>Address</TableHeadCell>}
                        {cols.orderMedia && <TableHeadCell>Order Media</TableHeadCell>}
                        {cols.onlineOffline && <TableHeadCell>Online / Offline</TableHeadCell>}
                        {cols.orderPerson && <TableHeadCell className="min-w-[160px]">Order Person</TableHeadCell>}
                        {cols.advanceMedia && <TableHeadCell>Advance Media</TableHeadCell>}
                        {cols.advanceAmount && <TableHeadCell>Advance Amount</TableHeadCell>}
                        {cols.sellingPrice && <TableHeadCell>Selling Price</TableHeadCell>}
                        {cols.cod && <TableHeadCell>COD</TableHeadCell>}
                        {cols.note && <TableHeadCell>Note</TableHeadCell>}
                        {cols.deliveryStatus && <TableHeadCell className="min-w-[140px]">Delivery Status</TableHeadCell>}
                        {cols.invoiceNo && <TableHeadCell>Invoice No</TableHeadCell>}
                        {cols.deliveryBy && <TableHeadCell>Delivery By</TableHeadCell>}
                        {cols.track && <TableHeadCell>Track</TableHeadCell>}
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

                                {cols.customer && (
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-medium text-gray-800">{row.customer}</span>
                                            <span className="text-[11px] text-gray-500">{row.customerPhone}</span>
                                        </div>
                                    </TableCell>
                                )}

                                {cols.date && <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>}
                                {cols.confirmationDate && (
                                    <TableCell className="text-[13px] text-gray-600">{row.confirmationDate}</TableCell>
                                )}
                                {cols.product && (
                                    <TableCell className="text-[13px] font-medium text-gray-800">{row.product}</TableCell>
                                )}

                                {cols.address && (
                                    <TableCell>
                                        <OrderInlineAddressCell rowId={row.id} address={row.address} manager={manager} />
                                    </TableCell>
                                )}

                                {cols.orderMedia && (
                                    <TableCell>
                                        {row.orderMedia !== "-" ? (
                                            <span className="inline-flex rounded bg-sky-100/75 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                                {row.orderMedia}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                )}

                                {cols.onlineOffline && (
                                    <TableCell>
                                        <span
                                            className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${row.onlineOffline === "Online"
                                                ? "bg-emerald-100/75 text-emerald-700"
                                                : "bg-red-100/75 text-red-700"
                                                }`}
                                        >
                                            {row.onlineOffline}
                                        </span>
                                    </TableCell>
                                )}

                                {cols.orderPerson && (
                                    <TableCell className="text-[13px] text-gray-600">{row.orderPerson}</TableCell>
                                )}

                                {cols.advanceMedia && (
                                    <TableCell>
                                        {row.advanceMedia !== "-" ? (
                                            <span className="inline-flex rounded bg-pink-100/75 px-2 py-0.5 text-[11px] font-semibold text-pink-700">
                                                {row.advanceMedia}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </TableCell>
                                )}

                                {cols.advanceAmount && (
                                    <TableCell className="text-[13px] text-gray-700">
                                        {row.advanceAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                )}
                                {cols.sellingPrice && (
                                    <TableCell className="text-[13px] text-gray-700">
                                        {row.sellingPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                )}
                                {cols.cod && (
                                    <TableCell className="text-[13px] text-gray-700 font-semibold">
                                        {row.cod.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                )}

                                {cols.note && (
                                    <TableCell>
                                        <OrderInlineNoteCell rowId={row.id} note={row.note} manager={manager} />
                                    </TableCell>
                                )}

                                {/* Delivery Status CustomSelect */}
                                {cols.deliveryStatus && (
                                    <TableCell>
                                        <CustomSelect
                                            size="sm"
                                            value={row.deliveryStatus}
                                            onChange={(val) => manager.handleDeliveryStatusChange(row.id, val)}
                                            options={["-", "Pending", "Processing", "Delivered", "Cancelled"]}
                                            triggerClassName="min-w-[110px]"
                                        />
                                    </TableCell>
                                )}

                                {cols.invoiceNo && <TableCell className="text-[13px] text-gray-500">{row.invoiceNo}</TableCell>}
                                {cols.deliveryBy && <TableCell className="text-[13px] text-gray-500">{row.deliveryBy}</TableCell>}
                                {cols.track && <TableCell className="text-[13px] text-gray-500">{row.track}</TableCell>}

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
                                            title="Edit Order"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleDelete(row.id)}
                                            className="text-brand-subtext rounded-md"
                                            title="Delete Order"
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

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
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