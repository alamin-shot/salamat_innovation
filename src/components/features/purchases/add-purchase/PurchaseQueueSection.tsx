"use client";
import * as React from "react";
import { Search, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { useAddPurchaseManager } from "@/hooks/useAddPurchaseManager";
import { CustomSelect } from "./CustomSelect";
import { Button } from "@/components/ui/Button";

type Manager = ReturnType<typeof useAddPurchaseManager>;

export function PurchaseQueueSection({ manager }: { manager: Manager }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[13px] text-gray-600">Search by Barcode</label>

            {/* Toggled Manual Entry Row */}
            {manager.isManualEntryOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-1 mt-2 p-4 border border-gray-100 bg-gray-50 rounded">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Product <span className="text-red-500">*</span></label>
                        <CustomSelect value={manager.manualProduct} onChange={manager.setManualProduct} options={["Galaxy S25 Ultra", "iPhone 15 Pro", "Nothing Phone 4a"]} placeholder="Choose a product" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Variant <span className="text-red-500">*</span></label>
                        <CustomSelect value={manager.manualVariant} onChange={manager.setManualVariant} options={["Titanium Black", "White", "12GB/512GB"]} placeholder="Choose a Variant" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-600">Serial/IMEI no.</label>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Serial/IMEI no." value={manager.manualSerial} onChange={(e) => manager.setManualSerial(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none" />
                            <Button type="button" variant="warning" onClick={manager.handleSuggestSerial} className="shrink-0">Suggest</Button>
                            <Button type="button" variant="success" onClick={manager.handleApplyManualItem} className="shrink-0">Apply</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative mb-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" placeholder="Search Product By Code" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>

            {/* Queue Table */}
            <div className="rounded border border-gray-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-12 bg-gray-50/80 font-semibold text-gray-600">SL</TableHeadCell>
                        <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Product Name</TableHeadCell>
                        <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">SKU</TableHeadCell>
                        <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                        <TableHeadCell className="bg-gray-50/80 font-semibold text-gray-600">Unit Price</TableHeadCell>
                        <TableHeadCell className="text-center w-[120px] bg-gray-50/80 font-semibold text-gray-600">Quantity</TableHeadCell>
                        <TableHeadCell className="text-right bg-gray-50/80 font-semibold text-gray-600">Total Price</TableHeadCell>
                        <TableHeadCell className="text-right w-[80px] bg-gray-50/80 font-semibold text-gray-600">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.stagedItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-[13px] text-gray-500">No products added</TableCell>
                            </TableRow>
                        ) : (
                            manager.stagedItems.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700">{item.productName}</span>
                                            <span className="text-[10px] text-emerald-600">{item.variant}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-[13px] text-gray-600">{item.sku}</span></TableCell>
                                    <TableCell><span className="text-[13px] text-gray-600">{item.serial}</span></TableCell>
                                    <TableCell><span className="text-[13px] text-gray-600">{item.unitPrice}</span></TableCell>
                                    <TableCell className="text-center">
                                        <input type="number" min="1" value={item.quantity} onChange={(e) => manager.handleQuantityChange(item.id, parseInt(e.target.value) || 1)} className="w-16 rounded border border-gray-200 text-center text-[13px] py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-right"><span className="text-[13px] text-gray-700 font-medium">{(item.unitPrice * item.quantity).toLocaleString()}</span></TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="destructive-ghost"
                                            size="icon-sm"
                                            onClick={() => manager.handleRemoveItem(item.id)}
                                        >
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