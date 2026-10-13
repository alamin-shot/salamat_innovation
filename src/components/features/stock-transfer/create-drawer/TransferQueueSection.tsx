"use client";
import * as React from "react";
import { Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";

export function TransferQueueSection({ manager, onClose }: { manager: any, onClose: () => void }) {
    return (
        <div className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-1.5 w-full md:w-1/3">
                <label className="text-[13px] text-gray-500 font-medium">Search by Serial Number</label>
                <input type="text" placeholder="Type serial number..." className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 shadow-sm" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-[13px] font-medium text-gray-700">
                    Transfer Serials ({manager.stagedSerials.length} item{manager.stagedSerials.length !== 1 ? 's' : ''})
                </h3>
                <div className="rounded border border-gray-200 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableHeadCell className="w-12 bg-gray-50/50 font-bold text-[11px] text-gray-500 uppercase tracking-wider pl-4">#</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/50 font-bold text-[11px] text-gray-500 uppercase tracking-wider">SERIAL NO.</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/50 font-bold text-[11px] text-gray-500 uppercase tracking-wider">PRODUCT</TableHeadCell>
                            <TableHeadCell className="bg-gray-50/50 font-bold text-[11px] text-gray-500 uppercase tracking-wider">VARIANT</TableHeadCell>
                            <TableHeadCell className="w-16 bg-gray-50/50">s</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {manager.stagedSerials.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-[13px] text-gray-500">No serials added yet.</TableCell>
                                </TableRow>
                            ) : (
                                manager.stagedSerials.map((item: any, index: number) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-4 text-[13px] text-gray-500">{index + 1}</TableCell>
                                        <TableCell><span className="text-[13px] font-medium text-blue-600">{item.serialNo}</span></TableCell>
                                        <TableCell><span className="text-[13px] font-medium text-gray-800">{item.product}</span></TableCell>
                                        <TableCell><span className="text-[12px] text-gray-500">{item.variant}</span></TableCell>
                                        <TableCell className="text-right pr-4">
                                            <Button size="icon-sm" variant="destructive-ghost" onClick={() => manager.handleRemoveSerial(item.id)} className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 h-7 w-7 rounded-md">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="px-6 text-gray-600 hover:bg-gray-50">Cancel</Button>
                <Button variant="success" onClick={manager.handleCreate} className="px-6">Create Transfer</Button>
            </div>
        </div>
    );
}