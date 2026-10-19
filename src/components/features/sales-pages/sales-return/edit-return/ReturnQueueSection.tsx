"use client";
import * as React from "react";
import { Search, Trash2, FileText } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useSaleReturnManager } from "@/hooks/sales_hooks/useSaleReturnManager";

type Manager = ReturnType<typeof useSaleReturnManager>;

export function ReturnQueueSection({ manager }: { manager: Manager }) {
    return (
        <div className="flex flex-col gap-3 mt-4">
            <label className="text-[13px] text-gray-500">Product</label>
            <div className="relative mb-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search Product By Code" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
            </div>

            <div className="rounded border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12 bg-gray-50 font-semibold text-gray-600">SL</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Product Name</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">SKU</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Unit Price</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600 w-[100px]">Quantity</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600 w-[200px]">Discount</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Total Price</TableHeadCell>
                        <TableHeadCell className="text-right w-[80px] bg-gray-50 font-semibold text-gray-600">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.stagedItems.map((item, index) => {
                            const rowGross = item.unitPrice * item.quantity;
                            const rowDiscount = item.isFixedDiscount ? item.discount : rowGross * (item.discount / 100);
                            const rowTotal = rowGross - rowDiscount;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700 text-[12px]">{item.productName}</span>
                                            <span className="text-[10px] text-emerald-600">{item.variant}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-[12px] text-emerald-600">{item.sku}</span></TableCell>
                                    <TableCell><span className="text-[12px] text-emerald-600">{item.serial}</span></TableCell>
                                    <TableCell><span className="text-[12px] text-gray-600">{item.unitPrice.toFixed(2)}</span></TableCell>
                                    <TableCell>
                                        <input type="number" value={item.quantity} onChange={(e) => manager.handleUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)} className="w-full rounded border border-gray-200 px-2 py-1 text-[12px] focus:outline-none focus:border-emerald-500" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-3 text-[11px] text-gray-600">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input type="checkbox" checked={item.isFixedDiscount} onChange={() => manager.handleUpdateItem(item.id, "isFixedDiscount", true)} className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Fixed
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input type="checkbox" checked={!item.isFixedDiscount} onChange={() => manager.handleUpdateItem(item.id, "isFixedDiscount", false)} className="rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500" /> Percent
                                                </label>
                                            </div>
                                            <input type="number" value={item.discount} onChange={(e) => manager.handleUpdateItem(item.id, "discount", parseFloat(e.target.value) || 0)} className="w-full rounded border border-gray-200 px-2 py-1 text-[12px] focus:outline-none focus:border-emerald-500" />
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-[13px] text-gray-800">{rowTotal.toLocaleString()}</span></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button size="icon-sm" variant="ghost" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-1 rounded-sm"><FileText className="h-3.5 w-3.5" /></Button>
                                            <Button size="icon-sm" variant="destructive-ghost" onClick={() => manager.handleRemoveItem(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 p-1 rounded-sm"><Trash2 className="h-3.5 w-3.5" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}