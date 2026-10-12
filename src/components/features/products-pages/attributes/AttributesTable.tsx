"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCommandParams } from "@/hooks/useCommandParams";
import { useTableManager } from "@/hooks/useTableManager";

export interface AttributeItem {
    id: string;
    name: string;
    values: string[];
}

const MOCK_ATTRIBUTES: AttributeItem[] = [
    { id: "1", name: "Otecto K77", values: ["3/32GB"] },
    { id: "2", name: "Plug", values: ["UK", "US"] },
    { id: "3", name: "Material", values: ["Aluminum", "Titanium"] },
    { id: "4", name: "First Use", values: ["Active", "In-Active"] },
    { id: "5", name: "Noise Cancellation", values: ["ANC", "ENC"] },
    { id: "6", name: "General Information", values: ["Washing Capacity"] },
    { id: "7", name: "Physical Information", values: ["Weight"] },
    { id: "8", name: "SIM", values: ["E-SIM + E-SIM", "E-SIM Global", "E-SIM JP/UAE", "E-SIM USA", "Nano-SIM + E-SIM", "Nano-SIM + Nano-SIM"] },
    { id: "9", name: "Ethernet", values: ["10 Gigabit Ethernet", "Gigabit Ethernet"] },
];

export function AttributesTable() {
    const { openView } = useCommandParams();

    const table = useTableManager(MOCK_ATTRIBUTES, (attr, query) =>
        attr.name.toLowerCase().includes(query.toLowerCase()) ||
        attr.values.some(v => v.toLowerCase().includes(query.toLowerCase()))
    );

    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(a => a.id !== id));
        table.setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        toast.success("Attribute deleted successfully.");
    };
    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <FilterBar searchQuery={table.searchQuery} onSearchChange={table.setSearchQuery} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-[48px] px-4">
                            <input
                                type="checkbox"
                                checked={table.isAllSelected}
                                onChange={(e) => table.handleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                            />
                        </TableHeadCell>
                        <TableHeadCell className="w-[260px]">Name</TableHeadCell>
                        <TableHeadCell>Value</TableHeadCell>
                        <TableHeadCell className="text-right w-[100px]">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.map((attr) => (
                            <TableRow key={attr.id} className={table.selectedIds.includes(attr.id) ? "bg-emerald-50/30" : ""}>
                                <TableCell className="w-[48px] px-4">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(attr.id)}
                                        onChange={(e) => table.handleSelectRow(attr.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                    />
                                </TableCell>

                                <TableCell>
                                    <span className="font-medium text-brand-text">{attr.name}</span>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                                        {attr.values.map((val, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-none"
                                            >
                                                {val}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openView("modal", "edit", attr.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(attr.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <button
                    onClick={() => {
                        table.setData(prev => prev.filter(a => !table.selectedIds.includes(a.id)));
                        toast.success(`Deleted ${table.selectedIds.length} attributes`);
                        table.clearSelection();
                    }}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline-block">Delete All</span>
                </button>
            </BulkActionBar>
        </div>
    );
}