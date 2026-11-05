"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { Eye, Edit, Trash2, Megaphone, Calendar, CalendarCheck2 } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function ManagementTable({ manager }: { manager: ReturnType<typeof useCommsManager> }) {

    const getTypeIcon = (type: string) => {
        if (type === "Holiday") return <CalendarCheck2 className="w-4 h-4 text-emerald-600" />;
        if (type === "Event") return <Calendar className="w-4 h-4 text-blue-600" />;
        return <Megaphone className="w-4 h-4 text-amber-600" />;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden w-full">
            <Table containerClassName="flex-1 overflow-x-auto min-h-[400px] w-full">
                <TableHeader>
                    <TableHeadCell className="w-10 text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Title</TableHeadCell>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right w-28">Actions</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {manager.paginatedFeed.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-16 text-gray-400 text-xs">No communications match your search criteria.</TableCell>
                        </TableRow>
                    ) : (
                        manager.paginatedFeed.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50/70">
                                <TableCell className="text-center"><input type="checkbox" className="rounded text-brand-primary" /></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(item.type)}
                                        <span className="text-xs font-bold text-gray-700">{item.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold text-gray-900 text-xs max-w-[200px] truncate block">{item.title}</span>
                                </TableCell>
                                <TableCell className="text-xs text-gray-600 font-mono">
                                    {new Date(item.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.status === "Live" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                        item.status === "Scheduled" ? "bg-blue-50 text-blue-600 border-blue-200" :
                                            "bg-gray-50 text-gray-600 border-gray-200"
                                        }`}>
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-0.5">
                                        <Button variant="ghost" size="icon-sm" title="View Details">
                                            <Eye className="w-4 h-4 text-brand-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => {
                                            manager.setActiveRecord(item.rawPayload);
                                            manager.setDrawerMode(item.type.toLowerCase() as any);
                                        }} title="Edit">
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button variant="destructive-ghost" size="icon-sm" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
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