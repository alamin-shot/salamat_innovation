"use client";
import * as React from "react";
import { Search, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { usePrintQueueManager } from "@/hooks/barcode_hooks/usePrintQueueManager";

export function PrintQueueTable() {
    const manager = usePrintQueueManager();

    return (
        <>
            {/* Search Input Area */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                    Product
                </label>
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-brand-subtext" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Product By Code (Press Enter to add)"
                        value={manager.searchCode}
                        onChange={(e) => manager.setSearchCode(e.target.value)}
                        onKeyDown={manager.handleAddByCode}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white py-2.5 pl-10 pr-4 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Print Queue Table */}
            <div className="rounded-lg border border-brand-subtext/20 bg-brand-bg/30 overflow-hidden flex-1 flex flex-col mt-2">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-[60px]">SL</TableHeadCell>
                            <TableHeadCell>Product Name</TableHeadCell>
                            <TableHeadCell>Serial/IMEI no.</TableHeadCell>
                            <TableHeadCell>MRP</TableHeadCell>
                            <TableHeadCell className="text-right w-[100px]">Action</TableHeadCell>
                        </TableHeader>

                        <TableBody>
                            {manager.printQueue.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-brand-subtext">
                                        No products added
                                    </TableCell>
                                </TableRow>
                            ) : (
                                manager.printQueue.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell><span className="font-medium text-brand-subtext">{index + 1}</span></TableCell>
                                        <TableCell><span className="font-medium text-brand-text">{item.productName}</span></TableCell>
                                        <TableCell><span className="text-sm font-mono text-brand-subtext">{item.serialNumber}</span></TableCell>
                                        <TableCell><span className="text-sm text-brand-text">৳ {item.mrp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                onClick={() => manager.handleRemoveFromQueue(item.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={manager.handlePrint}
                    disabled={manager.printQueue.length === 0}
                    className="rounded-md bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Print
                </button>
            </div>
        </>
    );
}