"use client";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Plus, Megaphone, Target, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function AnnouncementDashboard({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    return (
        <div className="flex flex-col h-full gap-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <Megaphone className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Active Memos</p>
                        <p className="text-lg font-black text-gray-900 leading-tight">{manager.announcements.length}</p>
                    </div>
                </div>
                {/* ... other 3 metrics (High Priority, Compliance %, Embargoed) ... */}
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <input type="text" placeholder="Search memos..." className="erp-input w-64 bg-white" />
                    <Button variant="default" size="sm" onClick={() => manager.setDrawerMode("announcement")} className="h-8"><Plus className="w-3.5 h-3.5 mr-1" /> New Announcement</Button>
                </div>

                <Table containerClassName="flex-1 overflow-x-auto w-full">
                    <TableHeader>
                        <TableHeadCell>Announcement Title</TableHeadCell>
                        <TableHeadCell>Target Audience</TableHeadCell>
                        <TableHeadCell>Compliance (Acks)</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Actions</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {manager.announcements.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10 text-gray-400 text-xs">No active announcements.</TableCell></TableRow>
                        ) : manager.announcements.map(memo => (
                            <TableRow key={memo.id}>
                                <TableCell>
                                    <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                        {memo.priority === "High" && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                                        {memo.title}
                                    </span>
                                    <p className="text-[10px] text-gray-500 mt-0.5">Published: {new Date(memo.publishDate).toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded inline-flex">
                                        <Target className="w-3 h-3" /> All Company
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {memo.acknowledgmentRequired ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-gray-700">{memo.acknowledgedBy.length} Signed</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Not Required</span>
                                    )}
                                </TableCell>
                                <TableCell><span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[9px] font-bold uppercase tracking-wider">{memo.status}</span></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon-sm" onClick={() => { manager.setActiveRecord(memo); manager.setDrawerMode("announcement"); }}><Edit className="w-3.5 h-3.5 text-gray-600" /></Button>
                                        <Button variant="destructive-ghost" size="icon-sm"><Trash2 className="w-3.5 h-3.5" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}