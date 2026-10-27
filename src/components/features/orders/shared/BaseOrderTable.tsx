"use client";
import { OrderStatusManagerType } from "@/hooks/order_hooks/useOrderStatusManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";

export function BaseOrderTable({ manager }: { manager: OrderStatusManagerType }) {
    const { table, config } = manager;

    return (
        <div className="overflow-x-auto flex-1 min-h-[350px]">
            <Table>
                <TableHeader>
                    <TableHeadCell>Customer</TableHeadCell>
                    <TableHeadCell>PM</TableHeadCell>
                    <TableHeadCell>Discount Amount</TableHeadCell>
                    <TableHeadCell>Grand Total</TableHeadCell>
                    <TableHeadCell>Payable Amount</TableHeadCell>
                    <TableHeadCell>Due</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {table.paginatedData.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">{order.customerName}</span>
                                    <span className="text-xs text-gray-500">{order.customerPhone}</span>
                                    <span className="text-[10px] text-gray-400">{order.date}</span>
                                </div>
                            </TableCell>
                            <TableCell className="uppercase text-xs font-semibold text-gray-600">
                                {order.pm}
                            </TableCell>
                            <TableCell>৳{(order.billAmount - order.grandTotal).toFixed(2)}</TableCell>
                            <TableCell className="font-medium">৳{order.grandTotal.toFixed(2)}</TableCell>
                            <TableCell>৳{order.payableAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-red-600 font-medium">৳{order.dueAmount.toFixed(2)}</TableCell>

                            {/* Static Status Badge (Since this table is filtered by status) */}
                            <TableCell>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                                    {order.status}
                                </span>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    {/* Map dynamic Ghost Buttons from the Config array instead of a 3-dot dropdown */}
                                    {config.actions.map((action, idx) => {
                                        const Icon = action.icon;
                                        return (
                                            <Button
                                                key={idx}
                                                variant="ghost"
                                                size="icon-sm"
                                                className={action.colorClass}
                                                title={action.label}
                                                onClick={() => action.onClick(order.id, manager)}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </Button>
                                        );
                                    })}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                    {table.paginatedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-16">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <span className="text-2xl opacity-50">📄</span>
                                    </div>
                                    <p className="text-gray-500 font-medium">{config.emptyStateMessage}</p>
                                </div>
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