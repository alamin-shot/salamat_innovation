"use client";
import * as React from "react";
import { Download, LayoutGrid, Loader2, Mail, Phone, Search, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { useDirectorViewManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorViewManager";
import { usePdfDownload } from "@/hooks/shared_hooks/usePdfDownload";
import { LocalListControls } from "@/hooks/shared_hooks/useLocalListControls";
import { Deposit } from "@/hooks/finance_hooks/deposit_hooks/useDepositStore";
import { Withdrawal } from "@/hooks/finance_hooks/withdrawal_hooks/useWithdrawalStore";
import { formatCurrency } from "@/utils/formatters";
import { formatDay } from "@/utils/dateDisplay";
import { toIsoDate } from "@/utils/dateRules";
import { DirectorProfileFormDrawer } from "../director-list/form-drawer/DirectorProfileFormDrawer";
import { DirectorAvatar } from "../shared/DirectorAvatar";

type Entry = Deposit | Withdrawal;

const EntryRow = React.memo(function EntryRow({ row }: { row: Entry }) {
    return (
        <TableRow>
            <TableCell className="text-sm text-gray-600">{row.shopName}</TableCell>
            <TableCell className="text-sm text-gray-800">{row.title}</TableCell>
            <TableCell className="whitespace-nowrap text-sm text-gray-600">{formatDay(toIsoDate(row.date))}</TableCell>
            <TableCell className="text-sm text-gray-600">{row.note}</TableCell>
            <TableCell className="whitespace-nowrap text-right text-base font-semibold tabular-nums">{formatCurrency(row.amount)}</TableCell>
        </TableRow>
    );
});
EntryRow.displayName = "EntryRow";

function EntryTable({ title, table }: { title: string; table: LocalListControls<Entry> }) {
    return (
        <div className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
                <h3 className="font-bold text-gray-700">{title} <span className="text-sm font-medium text-gray-400">({table.filteredData.length})</span></h3>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search" value={table.searchQuery} onChange={(e) => table.setSearchQuery(e.target.value)} className="w-full rounded border border-gray-200 py-1.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" />
                </div>
            </div>
            {table.filteredData.length === 0 ? (
                <div className="m-4 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">No {title.toLowerCase()} records.</div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableHeadCell>Shop Name</TableHeadCell>
                            <TableHeadCell>Title</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Note</TableHeadCell>
                            <TableHeadCell className="text-right">Amount</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {table.paginatedData.map((row) => <EntryRow key={row.id} row={row} />)}
                        </TableBody>
                    </Table>
                </div>
            )}
            {table.totalPages > 1 && (
                <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-3 text-sm text-gray-600">
                    <Button variant="outline" size="sm" disabled={table.currentPage <= 1} onClick={() => table.setCurrentPage(table.currentPage - 1)}>Previous</Button>
                    <span>Page {table.currentPage} of {table.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={table.currentPage >= table.totalPages} onClick={() => table.setCurrentPage(table.currentPage + 1)}>Next</Button>
                </div>
            )}
        </div>
    );
}

export function DirectorViewClient({ id }: { id: string }) {
    const manager = useDirectorViewManager(id);
    const { download, isGenerating } = usePdfDownload();
    const profile = manager.profile;

    if (!profile) {
        return (
            <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                <UserX className="h-8 w-8 text-brand-subtext/60" />
                <h3 className="text-sm font-bold text-brand-text">Director not found</h3>
                <p className="text-xs text-brand-subtext">This profile may have been removed.</p>
            </div>
        );
    }

    const handleDownload = () => download(`Director_Statement_${profile.fullName.replace(/\s+/g, "_")}`, async () => {
        const { DirectorStatementDocument } = await import("@/components/shared/pdf/DirectorStatementDocument");
        return (
            <DirectorStatementDocument
                director={profile}
                deposits={manager.depositTable.filteredData}
                withdrawals={manager.withdrawalTable.filteredData}
                logoUrl={`${window.location.origin}/tekzologo.png`}
                generatedAt={new Date().toISOString()}
            />
        );
    });

    return (
        <div className="relative flex min-h-full w-full flex-col gap-4 bg-gray-50/50 p-4 pb-12">
            <div className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-gray-700">
                <LayoutGrid className="h-5 w-5 text-brand-text" />
                DIRECTOR PROFILE
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
                <div className="flex items-center gap-4">
                    <DirectorAvatar name={profile.fullName} avatarUrl={profile.avatarUrl} size="md" />
                    <div className="flex flex-col text-sm">
                        <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
                        <span className="font-medium text-gray-500">{profile.title}</span>
                        <span className="mt-1 flex items-center gap-1.5 text-gray-500"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
                        <span className="flex items-center gap-1.5 text-gray-500"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right">
                    <div className="mb-2 flex gap-8">
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Total Deposit</span><span className="text-lg font-bold tabular-nums">{formatCurrency(profile.totalDeposit)}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Total Withdraw ({profile.withdrawalCount})</span><span className="text-lg font-bold tabular-nums">{formatCurrency(profile.totalWithdraw)}</span></div>
                    </div>
                    <div className="mb-4 flex flex-col">
                        <span className="text-[10px] text-gray-400">(deposit - withdrawal = balance) Total Balance</span>
                        <span className={`text-xl font-bold tabular-nums ${profile.totalBalance < 0 ? "text-rose-600" : "text-gray-900"}`}>{formatCurrency(profile.totalBalance)}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isGenerating} className="gap-1.5 text-xs">
                            {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Download PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={manager.handleEditProfile} className="border-gray-300 text-xs">Edit Profile ✎</Button>
                    </div>
                </div>
            </div>

            <EntryTable title="Deposit" table={manager.depositTable} />
            <EntryTable title="Withdrawal" table={manager.withdrawalTable} />

            <DirectorProfileFormDrawer director={profile} isOpen={manager.isEditOpen} onClose={manager.closeView} />
        </div>
    );
}
