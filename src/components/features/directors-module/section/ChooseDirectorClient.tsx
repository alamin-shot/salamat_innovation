"use client";
import * as React from "react";
import Link from "next/link";
import { PlusCircle, Search, UserRoundSearch } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useChooseDirectorManager, DirectorMoneyRecord } from "@/hooks/people_hooks/director_profile_hooks/useDirectorSection";
import { DirectorSectionKind } from "@/types/directors";
import { directorProfilePath } from "@/constants/directors";
import { formatCurrency } from "@/utils/formatters";
import { formatDay } from "@/utils/dateDisplay";
import { toIsoDate } from "@/utils/dateRules";
import { DirectorAvatar } from "../shared/DirectorAvatar";

const RecordRow = React.memo(function RecordRow({ row }: { row: DirectorMoneyRecord }) {
    return (
        <TableRow>
            <TableCell className="whitespace-nowrap text-sm text-gray-600">{formatDay(toIsoDate(row.date))}</TableCell>
            <TableCell className="text-sm font-medium text-gray-800">{row.title}</TableCell>
            <TableCell className="text-sm text-gray-600">{row.shopName}</TableCell>
            <TableCell className="text-sm text-gray-600">{row.contact}</TableCell>
            <TableCell className="text-sm text-gray-600">{row.note}</TableCell>
            <TableCell className="text-sm text-gray-600">{row.createdBy}</TableCell>
            <TableCell className="whitespace-nowrap text-right text-base font-semibold tabular-nums text-gray-900">{formatCurrency(row.amount)}</TableCell>
        </TableRow>
    );
});
RecordRow.displayName = "RecordRow";

/** Deposit › Choose Director and Withdrawals › Choose Director: one director's records in this section. */
export function ChooseDirectorClient({ kind }: { kind: DirectorSectionKind }) {
    const manager = useChooseDirectorManager(kind);
    const { section, director, table } = manager;

    return (
        <div className="relative flex min-h-full w-full flex-col gap-4 p-4 pb-12">
            <h1 className="text-xl font-bold text-brand-text sm:text-2xl">{section.title} · Choose Director</h1>

            <div className="flex flex-col gap-4 rounded-xl border border-brand-subtext/20 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                <div className="flex w-full flex-col gap-1.5 sm:max-w-sm">
                    <label className="text-[13px] font-medium text-gray-600">Director</label>
                    <CustomSelect value={director?.id ?? ""} onChange={manager.chooseDirector} options={manager.directorOptions} placeholder="Choose Director" />
                </div>
                {director && (
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex flex-col"><span className="text-xs text-gray-500">{section.records}</span><span className="text-lg font-bold tabular-nums text-gray-900">{manager.recordCount}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Total {section.record}</span><span className="text-lg font-bold tabular-nums text-gray-900">{formatCurrency(manager.totalAmount)}</span></div>
                        <Link href={section.addHref} className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">
                            <PlusCircle className="h-4 w-4" /> Add {section.record}
                        </Link>
                    </div>
                )}
            </div>

            {!director ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                    <UserRoundSearch className="h-8 w-8 text-brand-subtext/60" />
                    <h3 className="text-sm font-bold text-brand-text">{manager.isUnknownDirector ? "That director no longer exists" : "Choose a director"}</h3>
                    <p className="text-xs text-brand-subtext">Their {section.records.toLowerCase()} will be listed here.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-brand-subtext/20 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-subtext/20 p-4">
                        <div className="flex items-center gap-3">
                            <DirectorAvatar name={director.fullName} avatarUrl={director.avatarUrl} size="sm" />
                            <div className="flex flex-col">
                                <Link href={directorProfilePath(director.id)} className="text-sm font-semibold text-gray-800 hover:text-emerald-700">{director.fullName}</Link>
                                <span className="text-xs text-gray-500">{director.title}</span>
                            </div>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                            <input value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} placeholder={`Search ${section.records.toLowerCase()}`} className="w-full rounded-md border border-brand-subtext/30 bg-white py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none" />
                        </div>
                    </div>

                    {table.filteredData.length === 0 ? (
                        <div className="m-4 rounded-xl border-2 border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
                            No {section.records.toLowerCase()} {table.searchQuery ? "match this search" : `for ${director.fullName} yet`}.
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader>
                                    <TableHeadCell>Date</TableHeadCell>
                                    <TableHeadCell className="min-w-[200px]">Title</TableHeadCell>
                                    <TableHeadCell>Shop</TableHeadCell>
                                    <TableHeadCell>Contact</TableHeadCell>
                                    <TableHeadCell>Note</TableHeadCell>
                                    <TableHeadCell>Created By</TableHeadCell>
                                    <TableHeadCell className="text-right">Amount</TableHeadCell>
                                </TableHeader>
                                <TableBody>
                                    {table.paginatedData.map((row) => <RecordRow key={row.id} row={row} />)}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Button variant="outline" size="sm" disabled={table.currentPage <= 1} onClick={() => table.setCurrentPage(table.currentPage - 1)}>Previous</Button>
                            <span>Page {table.currentPage} of {table.totalPages}</span>
                            <Button variant="outline" size="sm" disabled={table.currentPage >= table.totalPages} onClick={() => table.setCurrentPage(table.currentPage + 1)}>Next</Button>
                        </div>
                        <span className="text-sm text-gray-500">Total <b className="ml-2 text-lg tabular-nums text-gray-900">{formatCurrency(manager.filteredTotal)}</b></span>
                    </div>
                </div>
            )}
        </div>
    );
}
