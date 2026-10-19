"use client";
import * as React from "react";
import { Search, Columns, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { useCommandParams } from "@/hooks/useCommandParams";
import { ViewCashTransferDrawer } from "./view-drawer/ViewCashTransferDrawer";
import { CreateCashTransferDrawer } from "./create-drawer/CreateCashTransferDrawer";

const dummyCashTransfers = [
    { id: "056", ref: "CT-000056", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: "14,500.00", date: "2026-10-08", createdAt: "08-Oct-2026 08:09 PM", status: "Approved" },
    { id: "055", ref: "CT-000055", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: "250.00", date: "2026-09-14", createdAt: "14-Sep-2026 07:08 PM", status: "Approved" },
    { id: "054", ref: "CT-000054", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: "1,650.00", date: "2026-09-14", createdAt: "14-Sep-2026 06:56 PM", status: "Approved" },
    { id: "053", ref: "CT-000053", fromShop: "A-Block", toShop: "TEKZO Online Shop", amount: "5,300.00", date: "2026-09-12", createdAt: "12-Sep-2026 07:38 PM", status: "Approved" },
    { id: "052", ref: "CT-000052", fromShop: "A-Block", toShop: "TEKZO JFP 4C-021C1", amount: "20,000.00", date: "2026-09-11", createdAt: "11-Sep-2026 06:29 PM", status: "Approved" },
];

export function CashTransferClient() {
    const { activeDrawer, activeId, openView, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Cash Transfer</h1>
            </div>

            <div className="w-full pb-12">
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search" className="w-full rounded border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" className="bg-white hidden sm:flex text-gray-600 border-gray-200">
                                <Columns className="h-4 w-4 mr-2" /> Columns
                            </Button>
                            <Button variant="success" size="sm" onClick={() => openView("drawer", "create-cash-transfer")} className="w-full sm:w-auto">
                                New Transfer
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border-b border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableHeadCell className="font-semibold text-gray-600 pl-4">Ref #</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600">From Shop</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600">To Shop</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600 text-right">Amount</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600">Date</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600">Created At</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600">Status</TableHeadCell>
                                <TableHeadCell className="font-semibold text-gray-600 text-right pr-4">Action</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                {dummyCashTransfers.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="pl-4 text-[13px] font-medium text-gray-700">{row.ref}</TableCell>
                                        <TableCell className="text-[13px] text-gray-600">{row.fromShop}</TableCell>
                                        <TableCell className="text-[13px] text-gray-600">{row.toShop}</TableCell>
                                        <TableCell className="text-[13px] font-semibold text-gray-800 text-right">৳ {row.amount}</TableCell>
                                        <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
                                        <TableCell className="text-[13px] text-gray-600">{row.createdAt}</TableCell>
                                        <TableCell>
                                            <Badge variant={row.status === "Approved" ? "success" : "destructive"}>
                                                {row.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <Button size="icon-sm" variant="ghost" onClick={() => openView("drawer", "view-cash-transfer", row.id)} title="View Details">
                                                <Eye className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination />
                </div>
            </div>

            {/* Drawers */}
            <ViewCashTransferDrawer
                id={activeId}
                isOpen={activeDrawer === "view-cash-transfer"}
                onClose={closeView}
            />

            <CreateCashTransferDrawer
                isOpen={activeDrawer === "create-cash-transfer"}
                onClose={closeView}
            />
        </div>
    );
}