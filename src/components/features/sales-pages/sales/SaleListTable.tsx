"use client";
import * as React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";
import { Button } from "@/components/ui/Button";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { InlineDropdown } from "@/components/ui/InlineDropdown";

export function SaleListTable({ sales, setSales, onOpenSellerModal }: { sales: any[], setSales: any, onOpenSellerModal: (id: string) => void }) {
    const { openView } = useCommandParams();
    const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

    const toggleAll = () => {
        if (selectedRows.length === sales.length) setSelectedRows([]);
        else setSelectedRows(sales.map(s => s.id));
    };

    const toggleRow = (id: string) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const updateStatus = (id: string, field: "status" | "courier", newValue: string) => {
        setSales((prev: any[]) => prev.map(s => s.id === id ? { ...s, [field]: newValue } : s));
    };

    // --- New Delete Handlers ---
    const handleDelete = (id: string) => {
        setSales((prev: any[]) => prev.filter(s => s.id !== id));
        setSelectedRows(prev => prev.filter(r => r !== id)); // Remove from selection if checked
    };

    const handleBulkDelete = () => {
        setSales((prev: any[]) => prev.filter(s => !selectedRows.includes(s.id)));
        setSelectedRows([]); // Clear selection after deletion
    };

    // --- Styling Maps passed to the Generic Dropdown ---
    const statusStyleMap = (s: string) => {
        if (s === "Paid") return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (s === "Due") return "bg-red-100 text-red-700 border-red-200";
        return "bg-blue-100 text-blue-700 border-blue-200";
    };

    const courierStyleMap = () => {
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
    };

    return (
        <div className="flex flex-col gap-4">

            {selectedRows.length > 0 && (
                <BulkActionBar selectedCount={selectedRows.length} onClearSelection={() => setSelectedRows([])}>
                    {/* Kept only the Delete button and wired up the handler */}
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
                </BulkActionBar>
            )}

            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-10 pl-4">
                                <input type="checkbox" checked={selectedRows.length === sales.length && sales.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            </TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Customer</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Date</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Invoice Number</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-center">Total Item</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">S.Cost</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Total Amount</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Due Amount</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Received Amount</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Payment Method</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Status</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Seller</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600">Courier Order</TableHeadCell>
                            <TableHeadCell className="font-semibold text-gray-600 text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {sales.map((row) => (
                                <TableRow key={row.id} className={selectedRows.includes(row.id) ? "bg-gray-50/50" : ""}>
                                    <TableCell className="pl-4">
                                        <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRow(row.id)} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${row.color}`}>
                                                {row.initials}
                                            </div>
                                            <span className="font-medium text-[13px] text-gray-800">{row.customer}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600">{row.invoice}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-center">{row.items}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.sCost}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.total}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.due}</TableCell>
                                    <TableCell className="text-[13px] text-gray-600 text-right">৳ {row.received}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-[12px] text-gray-600">
                                            {row.payment !== "—" && <span className="h-4 w-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px]">💳</span>}
                                            {row.payment}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <InlineDropdown
                                            value={row.status}
                                            options={["Paid", "Due", "Partially_paid"]}
                                            onSelect={(val) => updateStatus(row.id, "status", val)}
                                            getBadgeStyle={statusStyleMap}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => onOpenSellerModal(row.id)}
                                            className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors group"
                                            title="Click to change seller"
                                        >
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-bold text-white group-hover:ring-2 ring-emerald-500/30">
                                                {row.seller === "AV" ? "AV" : row.seller.substring(0, 2).toUpperCase()}
                                            </div>
                                            {row.seller !== "AV" && <span className="text-[12px] text-gray-600 hidden xl:block">{row.seller}</span>}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        {row.courier !== "—" ? (
                                            <InlineDropdown
                                                value={row.courier}
                                                options={["Pending", "Send via Pathao", "Send via Steadfast", "Send via REDX"]}
                                                onSelect={(val) => updateStatus(row.id, "courier", val)}
                                                getBadgeStyle={courierStyleMap}
                                            />
                                        ) : <span className="text-gray-400">—</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "view-sale", row.id)} title="View Invoice">
                                                <Eye className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                                            </Button>
                                            <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "edit-sale", row.id)} title="Edit Sale">
                                                <Edit className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                                            </Button>

                                            {/* Wired up single delete handler */}
                                            <Button size="icon-sm" variant="destructive-ghost" onClick={() => handleDelete(row.id)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                        <tfoot className="border-t-2 border-gray-100 bg-gray-50/50 text-[13px]">
                            <tr>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">Total</td>
                                <td className="p-3 font-bold text-gray-700 text-center">55</td>
                                <td className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 3,43,706.00</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 30,106.00</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 3,13,600.00</td>
                                <td colSpan={5}></td>
                            </tr>
                            <tr>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">Grand Total</td>
                                <td className="p-3 font-bold text-gray-700 text-center">752</td>
                                <td className="p-3"></td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 1,70,48,114.00</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 33,12,502.00</td>
                                <td className="p-3 font-bold text-gray-700 text-right">৳ 1,37,35,612.00</td>
                                <td colSpan={5}></td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        </div>
    );
}