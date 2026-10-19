"use client";
import * as React from "react";
import { Search, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useAddSaleReturnManager } from "@/hooks/useAddSaleReturnManager";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function AddSaleReturnForm() {
    const manager = useAddSaleReturnManager();

    return (
        <div className="flex flex-col gap-8 bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-100">

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Customer</label>
                    <CustomSelect
                        value={manager.customer}
                        onChange={manager.setCustomer}
                        options={["MD MINHAZUL ISLAM RIFAT", "Jihad", "Daraz", "Live Apple"]}
                        placeholder="Choose a Customer"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        value={manager.date}
                        onChange={(e) => manager.setDate(e.target.value)}
                        className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                </div>
            </div>

            {/* Queue Section */}
            <div className="flex flex-col gap-3">
                <label className="text-[13px] text-gray-500">Product</label>
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Product By Code"
                        className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="rounded border border-gray-200 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 bg-gray-50 font-semibold text-gray-600">SL</TableHeadCell>
                            <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Product Name</TableHeadCell>
                            <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">SKU</TableHeadCell>
                            <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                            <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Unit Price</TableHeadCell>
                            <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Received Amount</TableHeadCell>
                            <TableHeadCell className="text-right w-[80px] bg-gray-50 font-semibold text-gray-600">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {manager.stagedItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-[13px] text-gray-500">
                                        No products added
                                    </TableCell>
                                </TableRow>
                            ) : (
                                manager.stagedItems.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell><span className="font-medium text-gray-700 text-[12px]">{item.productName}</span></TableCell>
                                        <TableCell><span className="text-[12px] text-emerald-600">{item.sku}</span></TableCell>
                                        <TableCell><span className="text-[12px] text-emerald-600">{item.serial}</span></TableCell>
                                        <TableCell><span className="text-[12px] text-gray-600">{item.unitPrice.toFixed(2)}</span></TableCell>
                                        <TableCell><span className="text-[13px] text-gray-800">{item.receivedAmount.toFixed(2)}</span></TableCell>
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

            {/* Summary & Modifiers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Order Tax</label>
                        <input
                            type="number"
                            value={manager.orderTaxPct || ""}
                            onChange={(e) => manager.setOrderTaxPct(parseFloat(e.target.value) || 0)}
                            placeholder="Order Tax"
                            className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-gray-500">Shipping</label>
                        <input
                            type="number"
                            value={manager.shippingCost || ""}
                            onChange={(e) => manager.setShippingCost(parseFloat(e.target.value) || 0)}
                            placeholder="Shipping Cost"
                            className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col border border-gray-100 rounded bg-white overflow-hidden">
                    <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100">
                        <span>Sub Total</span><span>৳ {manager.totals.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100">
                        <span>Discount</span><span>{manager.totals.discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100">
                        <span>Order Tax</span><span>{manager.totals.tax} (%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] text-gray-500 px-4 py-3 border-b border-gray-100">
                        <span>Shipping</span><span>৳ {manager.totals.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center text-[13px] font-medium text-blue-500 px-4 py-4 bg-blue-50/30">
                        <span>Grand Total</span><span>৳ {manager.totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
                <Button variant="success" onClick={manager.handleSave} className="px-8">
                    Save
                </Button>
            </div>
        </div>
    );
}