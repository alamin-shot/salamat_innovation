"use client";
import { Button } from "@/components/ui/Button";
import { Search, Columns } from "lucide-react";
import { useDirectorViewManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorViewManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { DirectorProfileFormDrawer } from "../director-list/form-drawer/DirectorProfileFormDrawer";

export function DirectorViewClient({ id }: { id: string }) {
    const manager = useDirectorViewManager(id);
    const formatCurrency = (val: number) => `৳ ${val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    if (!manager.profile) return <div className="p-8">Profile not found.</div>;

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative overflow-y-auto custom-scrollbar bg-gray-50/50 gap-6">

            <div className="flex items-center gap-2 text-gray-700 font-bold text-lg tracking-wide uppercase mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                CREATE PROFILES
            </div>

            {/* Header Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xl font-bold shadow-sm">{manager.profile.avatar}</div>
                    <div className="flex flex-col text-sm">
                        <h2 className="text-xl font-bold text-gray-900">{manager.profile.fullName}</h2>
                        <span className="text-gray-500 font-medium">{manager.profile.title}</span>
                        <span className="text-gray-500 mt-1 flex items-center gap-1">📞 {manager.profile.phone}</span>
                        <span className="text-gray-500 flex items-center gap-1">✉️ {manager.profile.email}</span>
                        <span className="text-gray-400 text-xs mt-1">user name: {manager.profile.fullName.toLowerCase().replace(/\s/g, '')}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right">
                    <div className="flex gap-8 mb-2">
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Total Deposit</span><span className="text-lg font-bold">{formatCurrency(manager.totalDeposit)}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Total Withdraw</span><span className="text-lg font-bold">{formatCurrency(manager.totalWithdraw)}</span></div>
                    </div>
                    <div className="flex flex-col mb-4">
                        <span className="text-[10px] text-gray-400">(deposit - withdrawal = balance) Total Balance</span>
                        <span className={`text-xl font-bold ${manager.totalBalance < 0 ? 'text-red-500' : 'text-gray-900'}`}>{formatCurrency(manager.totalBalance)}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={manager.handleDownloadPDF} className="text-xs">Download PDF</Button>
                        <Button variant="outline" size="sm" onClick={manager.handleEditProfile} className="text-xs border-gray-300">Edit Profile ✎</Button>
                    </div>
                </div>
            </div>

            {/* Inner Tables Helper (To keep code clean) */}
            <InnerMiniTable title="Deposit" tableMgr={manager.depositTable} formatCurrency={formatCurrency} />
            <InnerMiniTable title="Withdrawal" tableMgr={manager.withdrawalTable} formatCurrency={formatCurrency} />

            <DirectorProfileFormDrawer initialRecord={manager.profile} isOpen={manager.activeDrawer === "edit-director"} onClose={manager.closeView} />
        </div>
    );
}

// Inner Stateless Table Component for View Page
function InnerMiniTable({ title, tableMgr, formatCurrency }: { title: string, tableMgr: any, formatCurrency: any }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1">
            <div className="p-4 border-b border-gray-100"><h3 className="font-bold text-gray-700">{title}</h3></div>
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search" value={tableMgr.searchQuery} onChange={(e) => tableMgr.setSearchQuery(e.target.value)} className="w-full rounded border border-gray-200 py-1.5 pl-9 pr-3 text-sm focus:border-emerald-500 outline-none" />
                </div>
                <Button variant="outline" size="sm" className="text-xs text-gray-600 gap-2"><Columns className="w-3 h-3" /> Columns</Button>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableHeadCell>Shop Name</TableHeadCell>
                        <TableHeadCell>Title</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Note</TableHeadCell>
                        <TableHeadCell>Amount</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {tableMgr.paginatedData.map((row: any) => (
                            <TableRow key={row.id}>
                                <TableCell className="text-xs text-gray-600">{row.shopName}</TableCell>
                                <TableCell className="text-xs text-gray-700">{row.title}</TableCell>
                                <TableCell className="text-xs text-gray-600">{row.date}</TableCell>
                                <TableCell className="text-xs text-gray-600">{row.note}</TableCell>
                                <TableCell className="text-xs font-medium">{formatCurrency(row.amount)}</TableCell>
                            </TableRow>
                        ))}
                        {tableMgr.paginatedData.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center py-6 text-gray-400">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}