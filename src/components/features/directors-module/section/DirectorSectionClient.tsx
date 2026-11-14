"use client";
import Link from "next/link";
import { PlusCircle, Search, Users } from "lucide-react";
import { Table, TableHeader, TableBody, TableHeadCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { useDirectorSectionManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorSection";
import { DirectorSectionKind } from "@/types/directors";
import { formatCurrency } from "@/utils/formatters";
import { DirectorSectionRow } from "./DirectorSectionRow";

/** Deposit › Director and Withdrawals › Director: the shared Directors list with this section's totals. */
export function DirectorSectionClient({ kind }: { kind: DirectorSectionKind }) {
    const manager = useDirectorSectionManager(kind);
    const { table, section } = manager;

    return (
        <div className="relative flex min-h-full w-full flex-col p-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-brand-text sm:text-2xl">{section.title} · Directors</h1>
                <Link href="/admin/directors/create-directors" className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">
                    <PlusCircle className="h-4 w-4" /> Create Director
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-brand-subtext/20 bg-white shadow-sm">
                <div className="border-b border-brand-subtext/20 p-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                        <input value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} placeholder="Search director name, title or phone" className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none" />
                    </div>
                </div>

                {table.filteredData.length === 0 ? (
                    <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                        <Users className="h-8 w-8 text-brand-subtext/60" />
                        <h3 className="text-sm font-bold text-brand-text">No directors found</h3>
                        <p className="text-xs text-brand-subtext">Directors are created from Directors › Create Directors.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <Table>
                            <TableHeader>
                                <TableHeadCell className="min-w-[220px]">Director</TableHeadCell>
                                <TableHeadCell>Phone</TableHeadCell>
                                <TableHeadCell className="text-center">{section.records}</TableHeadCell>
                                <TableHeadCell className="text-right">Total {section.record}</TableHeadCell>
                                <TableHeadCell>Last {section.record}</TableHeadCell>
                                <TableHeadCell className="min-w-[100px] pr-4 text-right">Action</TableHeadCell>
                            </TableHeader>
                            <TableBody>
                                {table.paginatedData.map((row) => (
                                    <DirectorSectionRow key={row.id} row={row} recordsLabel={section.records} onOpenRecords={manager.openRecords} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex justify-end border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                    <span className="text-sm text-gray-500">Total {section.record} <b className="ml-2 text-lg tabular-nums text-gray-900">{formatCurrency(manager.grandTotal)}</b></span>
                </div>
                <Pagination currentPage={table.currentPage} totalPages={table.totalPages} onPageChange={table.setCurrentPage} itemsPerPage={table.itemsPerPage} onItemsPerPageChange={table.setItemsPerPage} />
            </div>
        </div>
    );
}
