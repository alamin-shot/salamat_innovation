"use client";
import * as React from "react";
import { Hammer, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";

export function DamageQueueSection({ manager, onClose }: { manager: any; onClose: () => void }) {
    const isEmpty = manager.stagedSerials.length === 0;

    return (
        <div className="flex flex-col gap-6 mt-2">
            {/* Serial Search Input */}
            <div className="flex flex-col gap-1.5 w-full md:w-1/2 lg:w-5/12">
                <label className="text-[12px] text-gray-700 font-semibold">
                    Search by Serial Number{" "}
                    {isEmpty && (
                        <span className="font-normal text-gray-400">
                            (Shop will be auto-selected from the scan)
                        </span>
                    )}
                </label>
                <input
                    type="text"
                    value={manager.serialQuery}
                    onChange={(e) => manager.setSerialQuery(e.target.value)}
                    onKeyDown={manager.handleScanSerial}
                    placeholder="Scan or type serial number..."
                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
            </div>

            {/* Empty State vs Staged Serials Table */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                    <Hammer className="h-7 w-7 text-gray-400 -rotate-45" />
                    <p className="text-[13px] text-gray-400">
                        Search serial numbers to add damaged items
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <h3 className="text-[12px] font-semibold text-gray-600">
                        Damaged Serials ({manager.stagedSerials.length} item{manager.stagedSerials.length !== 1 ? "s" : ""})
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
                                {manager.stagedSerials.map((item: any, index: number) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-4 text-[13px] text-gray-500">{index + 1}</TableCell>
                                        <TableCell>
                                            <span className="text-[13px] font-medium text-blue-600">{item.serialNo}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[13px] font-medium text-gray-800">{item.product}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600">
                                                {item.variant}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <Button
                                                size="icon-sm"
                                                variant="destructive-ghost"
                                                onClick={() => manager.handleRemoveSerial(item.id)}
                                                className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 h-7 w-7 rounded-md"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="px-6 text-gray-700 hover:bg-gray-50">
                    Cancel
                </Button>
                <Button variant="success" onClick={manager.handleRecordDamage} className="px-6">
                    Record Damage
                </Button>
            </div>
        </div>
    );
}