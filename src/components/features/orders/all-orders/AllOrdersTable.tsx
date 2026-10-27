"use client";
import { OrderManagerType } from "@/hooks/order_hooks/useOrderManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Edit, DollarSign, FileText, Trash2 } from "lucide-react";
import { OrderStatus, PaymentStatus } from "@/store/useOrderStore";

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Approved", "Processing", "Onway", "Complete", "Rejected"];
const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Partial", "Paid"];

export function AllOrdersTable({ manager }: { manager: OrderManagerType }) {
    const { table } = manager;

    return (
        <div className="overflow-x-auto flex-1 min-h-[350px] pb-32">
            <Table>
                <TableHeader>
                    <TableHeadCell className="w-12">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            checked={table.isAllSelected}
                            onChange={(e) => table.handleSelectAll(e.target.checked)}
                        />
                    </TableHeadCell>
                    <TableHeadCell>Customer</TableHeadCell>
                    <TableHeadCell>Order Number</TableHeadCell>
                    <TableHeadCell>Warehouse</TableHeadCell>
                    <TableHeadCell>PM</TableHeadCell>
                    <TableHeadCell>B.Amount</TableHeadCell>
                    <TableHeadCell>Grand Total</TableHeadCell>
                    <TableHeadCell>Payable</TableHeadCell>
                    <TableHeadCell>Due</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>P.Status</TableHeadCell>
                    <TableHeadCell>C.Note</TableHeadCell>
                    <TableHeadCell>Fraud Check</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {table.paginatedData.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    checked={table.selectedIds.includes(order.id)}
                                    onChange={(e) => table.handleSelectRow(order.id, e.target.checked)}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{order.customerName}</span>
                                    <span className="text-xs text-gray-500">{order.customerPhone}</span>
                                    <span className="text-[10px] text-gray-400">{order.date}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-gray-600">{order.orderNumber}</TableCell>
                            <TableCell className="text-gray-600">{order.warehouse}</TableCell>
                            <TableCell className="text-gray-600 uppercase text-xs font-semibold">{order.pm}</TableCell>
                            <TableCell>৳{order.billAmount.toFixed(2)}</TableCell>
                            <TableCell className="font-medium">৳{order.grandTotal.toFixed(2)}</TableCell>
                            <TableCell>৳{order.payableAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-red-600 font-medium">৳{order.dueAmount.toFixed(2)}</TableCell>

                            {/* Inline CustomSelect for Order Status */}
                            <TableCell>
                                <CustomSelect
                                    value={order.status}
                                    onChange={(val) => manager.handleInlineStatusChange(order.id, val as OrderStatus)}
                                    options={ORDER_STATUSES}
                                    size="sm"
                                />
                            </TableCell>

                            {/* Inline CustomSelect for Payment Status */}
                            <TableCell>
                                <CustomSelect
                                    value={order.pStatus}
                                    onChange={(val) => manager.handleInlinePaymentStatusChange(order.id, val as PaymentStatus)}
                                    options={PAYMENT_STATUSES}
                                    size="sm"
                                />
                            </TableCell>

                            <TableCell>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800">
                                    {order.cNote || "-"}
                                </span>
                            </TableCell>

                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-[11px] gap-1 px-2 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => manager.openDrawer("fraud", order.id)}
                                >
                                    <ShieldAlert className="h-3 w-3" />
                                    Check Fraud
                                </Button>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    {/* Action Ghost Buttons (Replaces 3-dot dropdown) */}
                                    <Button variant="ghost" size="icon-sm" className="text-blue-600 hover:bg-blue-50" title="Invoice" onClick={() => manager.openDrawer("invoice", order.id)}>
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" className="text-emerald-600 hover:bg-emerald-50" title="Receive Payment" onClick={() => manager.openDrawer("payment", order.id)}>
                                        <DollarSign className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" className="text-amber-600 hover:bg-amber-50" title="Edit Items" onClick={() => manager.openDrawer("update-item", order.id)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" className="text-red-600 hover:bg-red-50" title="Delete" onClick={() => { table.handleSelectRow(order.id, true); manager.handleBulkDelete(); }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {table.paginatedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={14} className="text-center py-8 text-gray-400">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="border-t border-gray-100 p-4 sm:px-6 mt-auto">
                <Pagination
                    currentPage={table.currentPage}
                    totalPages={table.totalPages}
                    onPageChange={table.setCurrentPage}
                    itemsPerPage={table.itemsPerPage}
                    onItemsPerPageChange={table.setItemsPerPage}
                />
            </div>
        </div>
    );
}