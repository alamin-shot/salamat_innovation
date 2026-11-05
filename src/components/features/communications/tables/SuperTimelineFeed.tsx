"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Edit, BellRing, UserCheck, ShieldAlert, Download, QrCode, Clock } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function SuperTimelineFeed({ manager }: { manager: ReturnType<typeof useCommsManager> }) {

    // Renders module-specific columns and actions
    const renderActiveModuleRows = () => {
        if (manager.activeModule === "events") {
            const paginatedEvents = manager.events.slice((manager.currentPage - 1) * manager.perPage, manager.currentPage * manager.perPage);
            return paginatedEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-gray-50/70 group">
                    <TableCell className="text-center w-10"><input type="checkbox" className="rounded text-brand-primary" /></TableCell>
                    <TableCell>
                        <span className="font-bold text-gray-900 text-xs">{event.title}</span>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {new Date(event.startDateTime).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                        <div className="w-32 sm:w-48">
                            <div className="flex justify-between text-[9px] font-bold mb-1 text-gray-600">
                                <span>{event.rsvps?.length || 0} RSVPs</span>
                                <span className="text-rose-600">12 Waitlist</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden flex">
                                <div className="bg-blue-500 h-full w-[80%]"></div>
                                <div className="bg-rose-500 h-full w-[20%] opacity-50"></div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Leadership Badge
                        </span>
                    </TableCell>
                    <TableCell className="text-right">
                        {/* Inline Super Actions */}
                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="h-7 text-[9px] px-2"><UserCheck className="w-3 h-3 mr-1" /> Promote Waitlist</Button>
                            <Button variant="outline" size="sm" className="h-7 text-[9px] px-2"><Download className="w-3 h-3 mr-1" /> Diet Matrix</Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => { manager.setActiveRecord(event); manager.setDrawerMode("event"); }}><Edit className="w-3.5 h-3.5" /></Button>
                        </div>
                    </TableCell>
                </TableRow>
            ));
        }

        if (manager.activeModule === "announcements") {
            const paginatedAnnouncements = manager.announcements.slice((manager.currentPage - 1) * manager.perPage, manager.currentPage * manager.perPage);

            return paginatedAnnouncements.map((memo) => (
                <TableRow key={memo.id} className="hover:bg-gray-50/70 group">
                    <TableCell className="text-center w-10"><input type="checkbox" className="rounded text-brand-primary" /></TableCell>
                    <TableCell>
                        <span className="font-bold text-gray-900 text-xs">{memo.title}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">Target: All Company</p>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-emerald-500" strokeDasharray="84, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <span className="absolute text-[8px] font-black">84%</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-700">Read Receipt</span>
                                <span className="text-[9px] text-rose-500 font-semibold">16 Pending</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <Button variant="default" size="sm" className="h-7 text-[9px] px-2 bg-amber-500 hover:bg-amber-600 border-none"><BellRing className="w-3 h-3 mr-1 text-white" /> Nudge Pending</Button>
                            <Button variant="ghost" size="icon-sm" onClick={() => { manager.setActiveRecord(memo); manager.setDrawerMode("announcement"); }}><Edit className="w-3.5 h-3.5" /></Button>
                        </div>
                    </TableCell>
                </TableRow>
            ));
        }

        // Default Holidays View... (Implementation matches the pattern above)
        return null;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            <Table containerClassName="flex-1 overflow-x-auto min-h-[400px] w-full">
                <TableHeader>
                    <TableHeadCell className="w-10 text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableHeadCell>
                    <TableHeadCell>Record Title</TableHeadCell>
                    <TableHeadCell>{manager.activeModule === "events" ? "Capacity Matrix" : manager.activeModule === "announcements" ? "Compliance Audit" : "Details"}</TableHeadCell>
                    {manager.activeModule === "events" && <TableHeadCell>Auto-Badging</TableHeadCell>}
                    <TableHeadCell className="text-right">Inline Actions</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {renderActiveModuleRows()}
                </TableBody>
            </Table>

            <div className="mt-auto border-t border-gray-100 bg-white">
                <Pagination
                    currentPage={manager.currentPage}
                    totalPages={manager.totalPages}
                    perPage={manager.perPage}
                    onPageChange={manager.setCurrentPage}
                    onPerPageChange={(v) => { manager.setPerPage(v); manager.setCurrentPage(1); }}
                />
            </div>
        </div>
    );
}