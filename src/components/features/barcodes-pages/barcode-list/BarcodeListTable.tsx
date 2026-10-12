"use client";
import * as React from "react";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { useTableManager } from "@/hooks/useTableManager";

interface BarcodeItem {
    id: string;
    productName: string;
    variant: string;
    image: string;
    serialNumber: string;
    price: number;
    date: string;
    warehouse: string;
}

// 100% matching your screenshot data
const MOCK_BARCODES: BarcodeItem[] = [
    { id: "1", productName: "XIAOMI MIJIA Handheld Garment Steamer 2", variant: "White", image: "/phone.png", serialNumber: "50050/AWAXWYGS357761", price: 2900.00, date: "10/9/2026, 1:25:16 PM", warehouse: "TEKZO Online Shop" },
    { id: "2", productName: "XIAOMI MIJIA Handheld Garment Steamer 2", variant: "White", image: "/phone.png", serialNumber: "50050/AWAXWYGS357720", price: 2900.00, date: "10/9/2026, 1:25:16 PM", warehouse: "TEKZO Online Shop" },
    { id: "3", productName: "XIAOMI MIJIA Handheld Garment Steamer 2", variant: "White", image: "/phone.png", serialNumber: "50050/AWAXWYGS357730", price: 2900.00, date: "10/9/2026, 1:25:16 PM", warehouse: "TEKZO Online Shop" },
    { id: "4", productName: "iPhone 13 Pro", variant: "Silver/128GB", image: "/phone.png", serialNumber: "352203772103473", price: 91000.00, date: "10/5/2026, 5:24:27 PM", warehouse: "A-Block" },
    { id: "5", productName: "iPhone 13 Pro", variant: "Silver/128GB", image: "/phone.png", serialNumber: "353105087813309", price: 91000.00, date: "10/5/2026, 5:24:27 PM", warehouse: "A-Block" },
];

export function BarcodeListTable() {
    const table = useTableManager(MOCK_BARCODES, (item, query) =>
        item.productName.toLowerCase().includes(query.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <FilterBar searchQuery={table.searchQuery} onSearchChange={table.setSearchQuery} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-4">
                <Table>
                    <TableHeader>
                        <TableHeadCell>Product Name</TableHeadCell>
                        <TableHeadCell>Serial Number</TableHeadCell>
                        <TableHeadCell>Price</TableHeadCell>
                        <TableHeadCell>Warehouse</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-brand-subtext">
                                    No barcodes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.filteredData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-brand-bg/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-start gap-3">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-brand-subtext/15 bg-white mt-0.5">
                                                <Image src={item.image} alt={item.productName} fill className="object-contain p-1" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-brand-text leading-tight">{item.productName}</span>
                                                <span className="text-[11px] font-bold text-emerald-600">
                                                    {item.variant}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-sm text-brand-subtext">{item.serialNumber}</span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm text-brand-text">৳ {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            <span className="text-[11px] text-brand-subtext">{item.date}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm text-brand-text">{item.warehouse}</span>
                                            <span className="text-[11px] text-brand-subtext">{item.date}</span>
                                        </div>
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