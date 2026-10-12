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

export interface SpecGroupItem {
    id: string;
    name: string;
    subGroups: string[];
    createdAt: string;
}

const MOCK_SPEC_GROUPS: SpecGroupItem[] = [
    { id: "1", name: "More", subGroups: ["Colors", "Models", "Expected Price", "International Price"], createdAt: "27-07-2026" },
    { id: "2", name: "Sound", subGroups: ["Loudspeaker", "3.5mm Jack", "Audio Features"], createdAt: "27-07-2026" },
    { id: "3", name: "Platform", subGroups: ["Operating System", "Chipset", "CPU", "GPU"], createdAt: "27-07-2026" },
    { id: "4", name: "Body", subGroups: ["Dimensions", "Weight", "Build", "Protection"], createdAt: "27-07-2026" },
    { id: "5", name: "Launch", subGroups: ["Announced", "Release Date", "Status"], createdAt: "27-07-2026" },
    { id: "6", name: "Basic Information", subGroups: ["Display", "Battery", "Connectivity", "Material", "SpecialFeatures", "Sensor", "Supported Apps/ Software", "Others", "Dimension", "Weight", "Warranty"], createdAt: "27-07-2026" },
    { id: "7", name: "General", subGroups: ["Fast Charge Protocols Supported", "Cable Included", "Protections", "Specification", "Blending Power", "Motor Speed", "Maximum Volume", "Blades", "Filtration System", "Particle CADR", "Formaldehyde CADR", "Filtration Efficiency", "Coverage Area", "Smart Control", "Voice Control", "Filter Life", "Calling"], createdAt: "15-06-2026" },
];

export function SpecGroupsTable() {
    const { openView } = useCommandParams();

    const table = useTableManager(MOCK_SPEC_GROUPS, (sg, query) =>
        sg.name.toLowerCase().includes(query.toLowerCase()) ||
        sg.subGroups.some(sub => sub.toLowerCase().includes(query.toLowerCase()))
    );

    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(sg => sg.id !== id));
        table.setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        toast.success("Specification group deleted successfully.");
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
                                checked={table.selectedIds.length === table.filteredData.length && table.filteredData.length > 0}
                                onChange={(e) => table.handleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                            />
                        </TableHeadCell>
                        <TableHeadCell className="w-[200px]">Name</TableHeadCell>
                        <TableHeadCell>Sub Specification Groups</TableHeadCell>
                        <TableHeadCell className="w-[120px] whitespace-nowrap">Created at</TableHeadCell>
                        <TableHeadCell className="text-right w-[100px]">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.map((group) => (
                            <TableRow key={group.id} className={table.selectedIds.includes(group.id) ? "bg-emerald-50/30" : ""}>
                                <TableCell className="w-[48px] px-4 align-top pt-4">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(group.id)}
                                        onChange={(e) => table.handleSelectRow(group.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                    />
                                </TableCell>

                                <TableCell className="align-top pt-4">
                                    <span className="font-medium text-brand-text">{group.name}</span>
                                </TableCell>

                                <TableCell className="py-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {group.subGroups.map((sub, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center rounded-md bg-emerald-50/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                                            >
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>

                                <TableCell className="align-top pt-4">
                                    <span className="text-sm font-medium text-brand-subtext">{group.createdAt}</span>
                                </TableCell>

                                <TableCell className="text-right align-top pt-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openView("modal", "edit", group.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                            title="Edit Specification Group"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(group.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Delete Specification Group"
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
                    type="button"
                    onClick={() => {
                        table.setData(prev => prev.filter(sg => !table.selectedIds.includes(sg.id)));
                        toast.success(`Deleted ${table.selectedIds.length} specification groups`);
                        table.clearSelection();
                    }}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Delete All</span>
                </button>
            </BulkActionBar>
        </div>
    );
}