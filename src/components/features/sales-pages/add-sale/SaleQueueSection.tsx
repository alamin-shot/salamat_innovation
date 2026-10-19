"use client";
import * as React from "react";
import { Search, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useAddSaleManager } from "@/hooks/useAddSaleManager";

type Manager = ReturnType<typeof useAddSaleManager>;

export function SaleQueueSection({ manager }: { manager: Manager }) {
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
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">P.Price</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">MRP</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600 w-[120px]">Sale Price</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600 w-[120px]">Discount</TableHeadCell>
                        <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Total Price</TableHeadCell>
                        <TableHeadCell className="text-right w-[80px] bg-gray-50 font-semibold text-gray-600">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.stagedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-[13px] text-gray-500">Cart is empty</TableCell>
                            </TableRow>
                        ) : (
                            manager.stagedItems.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700 text-[12px]">{item.productName}</span>
                                            <span className="text-[10px] text-emerald-600">{item.variant}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-[12px] text-emerald-600">{item.serial}</span></TableCell>
                                    <TableCell><span className="text-[12px] text-gray-600">{item.purchasePrice}</span></TableCell>
                                    <TableCell><span className="text-[12px] text-gray-600">{item.mrp.toFixed(2)}</span></TableCell>
                                    <TableCell>
                                        <input type="number" value={item.salePrice} onChange={(e) => manager.handleUpdateItem(item.id, "salePrice", parseFloat(e.target.value) || 0)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-[12px] focus:outline-none focus:border-emerald-500" />
                                    </TableCell>
                                    <TableCell>
                                        <input type="number" value={item.discount} onChange={(e) => manager.handleUpdateItem(item.id, "discount", parseFloat(e.target.value) || 0)} className="w-full rounded border border-gray-200 px-2 py-1.5 text-[12px] focus:outline-none focus:border-emerald-500" />
                                    </TableCell>
                                    <TableCell><span className="text-[13px] text-gray-800">{item.salePrice}</span></TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon-sm" variant="destructive-ghost" onClick={() => manager.handleRemoveItem(item.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}