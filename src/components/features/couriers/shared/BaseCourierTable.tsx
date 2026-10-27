"use client";
import { CourierManagerType } from "@/hooks/courier_hooks/useCourierManager";
import { CourierColumnKey } from "@/config/courier.config";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { AddressPopover } from "@/components/ui/AddressPopover";

const COLUMN_HEADERS: Record<CourierColumnKey, string> = {
    date: "Date",
    provider: "Provider",
    invoiceNumber: "Invoice Number",
    trackingId: "Tracking",
    consignmentId: "Consignment ID",
    store: "Store",
    recipient: "Recipient",
    address: "Address",
    itemType: "Item Type",
    deliveryType: "Delivery Type",
    deliveryArea: "Delivery Area",
    amountToCollect: "Amount to Collect",
    codAmount: "COD Amount",
    discount: "Discount",
    weightKg: "Weight (KG)",
    exchange: "Exchange",
    status: "Status",
    paymentStatus: "Payment",
    createdBy: "Created By"
};

export function BaseCourierTable({ manager }: { manager: CourierManagerType }) {
    const { table, config } = manager;

    // Helper to render specific cell formats based on the column key
    const renderCell = (shipment: any, key: CourierColumnKey) => {
        switch (key) {
            case "provider":
                return <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${shipment.provider === "Pathao" ? "bg-blue-100 text-blue-700" :
                    shipment.provider === "Steadfast" ? "bg-emerald-100 text-emerald-700" :
                        "bg-red-100 text-red-700"
                    }`}>{shipment.provider}</span>;
            case "date":
                return <span className="text-xs text-gray-500 whitespace-nowrap">{shipment.date}</span>;
            case "recipient":
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{shipment.recipientName}</span>
                        <span className="text-xs text-gray-500">{shipment.recipientPhone}</span>
                    </div>
                );
            case "address":
                return <AddressPopover address={shipment.address} />;
            case "amountToCollect":
            case "codAmount":
                const amt = shipment.amountToCollect || shipment.codAmount || 0;
                return <span className="font-medium">৳{amt.toFixed(2)}</span>;
            case "discount":
                return <span>৳{(shipment.discount || 0).toFixed(2)}</span>;
            case "status":
                return <span className="text-emerald-600 font-semibold text-xs">{shipment.status}</span>;
            case "trackingId":
            case "consignmentId":
                return <span className="text-blue-600 text-xs font-mono">{shipment[key] || "-"}</span>;
            default:
                return <span className="text-gray-600 text-sm">{shipment[key] || "-"}</span>;
        }
    };

    // Calculate totals for the footer if enabled in config
    const totalAmount = table.filteredData.reduce((acc, curr) => acc + (curr.amountToCollect || curr.codAmount || 0), 0);
    const totalDiscount = table.filteredData.reduce((acc, curr) => acc + (curr.discount || 0), 0);

    return (
        <div className="overflow-x-auto flex-1 min-h-[400px] flex flex-col">
            <Table>
                <TableHeader>
                    {config.columns.map(key => (
                        <TableHeadCell key={key} className={
                            key === "amountToCollect" || key === "codAmount" || key === "discount" ? "text-right" : ""
                        }>
                            {COLUMN_HEADERS[key]}
                        </TableHeadCell>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.paginatedData.map((shipment) => (
                        <TableRow key={shipment.id}>
                            {config.columns.map(key => (
                                <TableCell key={key} className={
                                    key === "amountToCollect" || key === "codAmount" || key === "discount" ? "text-right" : ""
                                }>
                                    {renderCell(shipment, key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}

                    {/* Empty State */}
                    {table.paginatedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={config.columns.length} className="text-center py-16">
                                <div className="text-gray-400 font-medium">{config.emptyStateMessage}</div>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Conditional Totals Row */}
                    {config.showTotals && table.paginatedData.length > 0 && (
                        <TableRow className="bg-gray-50 font-bold border-t-2 border-gray-200">
                            {config.columns.map((key, index) => {
                                if (key === "amountToCollect" || key === "codAmount") {
                                    return <TableCell key={key} className="text-right text-gray-900">৳{totalAmount.toFixed(2)}</TableCell>;
                                }
                                if (key === "discount") {
                                    return <TableCell key={key} className="text-right text-gray-900">৳{totalDiscount.toFixed(2)}</TableCell>;
                                }
                                if (index === config.columns.length - 3) {
                                    return <TableCell key={key} className="text-right text-gray-700">Total</TableCell>;
                                }
                                if (index === config.columns.length - 2) {
                                    return <TableCell key={key} className="text-right text-gray-700">Grand Total</TableCell>;
                                }
                                if (index === config.columns.length - 1) {
                                    return <TableCell key={key} className="text-right text-emerald-600">৳{(totalAmount - totalDiscount).toFixed(2)}</TableCell>;
                                }
                                return <TableCell key={key}></TableCell>;
                            })}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="border-t border-gray-100 p-4 sm:px-6 mt-auto shrink-0">
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