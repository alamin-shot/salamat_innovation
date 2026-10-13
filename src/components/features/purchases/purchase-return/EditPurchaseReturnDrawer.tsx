"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Image as ImageIcon, Search, Trash2, FileText, ChevronDown } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";

export function EditPurchaseReturnDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    if (!id && !isOpen) return null;

    return (
        <Drawer
            title="Update Purchase Return"
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            <div className="flex flex-col gap-8 bg-white p-4 sm:p-6 lg:p-8 min-h-full">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left: Supplier & Upload */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500">Supplier</label>
                            <p className="text-[14px] font-medium text-gray-800 mt-1">World Trade Center</p>
                        </div>

                        <div className="flex flex-col gap-1.5 mt-2">
                            <label className="text-[13px] text-gray-500">Invoice/Bill</label>
                            <div className="flex items-center gap-4 rounded border border-dashed border-gray-300 bg-gray-50/50 p-4 w-max pr-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-white border border-gray-200 text-gray-400 shadow-sm">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col text-[12px] text-gray-500">
                                    <span>Recommended size: 300 X 90 PX</span>
                                    <span>Max file size: 2MB</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Date */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                            <input type="date" defaultValue="2026-10-08" className="w-full rounded border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-600 focus:border-emerald-500 focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* Product Search & Table */}
                <div className="flex flex-col gap-3 mt-4">
                    <label className="text-[13px] text-gray-500">Product</label>
                    <div className="relative mb-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" placeholder="Search Product By Code" className="w-full rounded border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none" />
                    </div>

                    <div className="rounded border border-gray-200 overflow-hidden mt-2">
                        <Table>
                            <TableHeader>
                                <TableHeadCell className="w-12 bg-gray-50 font-semibold text-gray-600">SL</TableHeadCell>
                                <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Product Name</TableHeadCell>
                                <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">SKU</TableHeadCell>
                                <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Serial/IMEI no.</TableHeadCell>
                                <TableHeadCell className="bg-gray-50 font-semibold text-gray-600">Unit Price</TableHeadCell>
                                <TableHeadCell className="text-center w-[120px] bg-gray-50 font-semibold text-gray-600">Quantity</TableHeadCell>
                                <TableHeadCell className="text-right bg-gray-50 font-semibold text-gray-600">Total Price</TableHeadCell>
                                <TableHeadCell className="text-right w-[100px] bg-gray-50 font-semibold text-gray-600">Action</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-700 text-[13px]">Oppo A6x</span>
                                            <span className="text-[10px] text-emerald-600 mt-0.5">4GB/64GB/Plum Purple</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-[12px] text-emerald-600">SI-546447530</span></TableCell>
                                    <TableCell><span className="text-[12px] text-emerald-600">862672084151797</span></TableCell>
                                    <TableCell>
                                        <input type="text" defaultValue="18990.00" className="w-24 rounded border border-gray-200 text-[13px] py-1.5 px-2 focus:outline-none focus:border-emerald-500" />
                                    </TableCell>
                                    <TableCell className="text-center font-medium">1</TableCell>
                                    <TableCell className="text-right text-[13px]">18990</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button type="button" variant="success" size="icon-sm"><FileText className="h-3.5 w-3.5" /></Button>
                                            <Button type="button" variant="destructive-ghost" size="icon-sm"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Calculation Footer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-6 h-max">
                        <div>
                            <label className="text-[13px] text-gray-500 mb-2 block">Discount Type</label>
                            <div className="relative w-full">
                                <Button type="button" variant="outline" className="w-full justify-between font-normal">
                                    <span>Choose a Discount Type</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <label className="text-[13px] text-gray-500 mb-2 block">Discount Amount</label>
                            <input type="text" defaultValue="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[13px] text-gray-500 mb-2 block">Order Tax</label>
                            <input type="text" defaultValue="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[13px] text-gray-500 mb-2 block">Shipping</label>
                            <input type="text" defaultValue="0.00" className="w-full rounded border border-gray-200 px-3 py-2 text-[13px] text-gray-600 focus:outline-none" />
                        </div>
                    </div>

                    <div className="flex flex-col border border-gray-100 rounded bg-white">
                        <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                            <span>Sub Total</span><span>৳ 1,13,840.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                            <span>Discount</span><span>0</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                            <span>Order Tax</span><span>0 (%)</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] text-gray-600 p-3.5 border-b border-gray-100">
                            <span>Shipping</span><span>৳ 0.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px] text-blue-500 p-3.5">
                            <span>Grand Total</span><span>৳ 1,13,840.00</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 mb-4">
                    <Button type="button" variant="success" onClick={onClose} className="px-8">
                        Save
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}