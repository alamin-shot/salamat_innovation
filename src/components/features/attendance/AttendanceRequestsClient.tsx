"use client";
import { useState, useMemo } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { AttendanceRequestItem, AttendanceRecordStatus } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { AttendanceRequestDrawer } from "./drawers/AttendanceRequestDrawer";
import {
    Plus,
    Filter,
    Columns,
    CheckCircle2,
    XCircle,
    Edit,
    Trash2,
    FileSearch,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export function AttendanceRequestsClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusTab, setStatusTab] = useState<"All" | AttendanceRecordStatus>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeReq, setActiveReq] = useState<AttendanceRequestItem | null>(null);

    const filteredRequests = useMemo(() => {
        return store.requests.filter((r) => {
            const matchesSearch =
                r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.note.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusTab === "All" || r.status === statusTab;
            return matchesSearch && matchesStatus;
        });
    }, [store.requests, searchQuery, statusTab]);

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
    const paginated = filteredRequests.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleReview = (req: AttendanceRequestItem, status: AttendanceRecordStatus) => {
        store.reviewAttendanceRequest(req.id, status);
        if (status === "Approved") {
            toast.success(`Approved & synced ${req.employeeName}'s punch to Master Attendances`);
        } else {
            toast.warning(`Marked request from ${req.employeeName} as ${status}`);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this attendance request?")) {
            store.deleteAttendanceRequest(id);
            toast.success("Attendance request deleted");
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Attendance Requests</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Regularization workflow — approving a request automatically updates the Master Attendance log.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" /> Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            setActiveReq(null);
                            setDrawerMode("add");
                        }}
                        className="h-9 flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Add Attendance Request
                    </Button>
                </div>
            </div>

            {/* Full-Viewport Table Card */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="erp-input max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                        {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusTab(tab)}
                                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${statusTab === tab
                                    ? "bg-white text-brand-primary shadow-2xs"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <Table containerClassName="flex-1 min-h-[400px]">
                    <TableHeader>
                        <TableHeadCell>Employee</TableHeadCell>
                        <TableHeadCell>Date</TableHeadCell>
                        <TableHeadCell>Punch In</TableHeadCell>
                        <TableHeadCell>Punch Out</TableHeadCell>
                        <TableHeadCell>Note</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                        <FileSearch className="w-12 h-12 text-gray-300" />
                                        <span className="text-xs font-medium">Nothing to show here</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((req) => (
                                <TableRow key={req.id} className="hover:bg-gray-50/70">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(
                                                    req.employeeId
                                                )}`}
                                            >
                                                {getInitials(req.employeeName)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 text-xs">
                                                    {req.employeeName}
                                                </div>
                                                <div className="text-[10px] text-gray-400">
                                                    {req.empCode} • {req.requestType}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-700">{req.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="text-gray-400 line-through">
                                                {req.originalPunchIn}
                                            </span>
                                            <ArrowRight className="w-3 h-3 text-gray-400" />
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                {req.punchIn}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="text-gray-400 line-through">
                                                {req.originalPunchOut}
                                            </span>
                                            <ArrowRight className="w-3 h-3 text-gray-400" />
                                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                                {req.punchOut}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                                        {req.note}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${req.status === "Approved"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                : req.status === "Pending"
                                                    ? "bg-amber-50 text-amber-600 border-amber-200"
                                                    : "bg-rose-50 text-rose-600 border-rose-200"
                                                }`}
                                        >
                                            {req.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {req.status === "Pending" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleReview(req, "Approved")}
                                                        title="Approve & Sync to Attendances"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleReview(req, "Rejected")}
                                                        title="Reject Request"
                                                    >
                                                        <XCircle className="w-4 h-4 text-rose-500" />
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => {
                                                    setActiveReq(req);
                                                    setDrawerMode("edit");
                                                }}
                                                title="Edit Request"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="destructive-ghost"
                                                size="icon-sm"
                                                onClick={() => handleDelete(req.id)}
                                                title="Delete Request"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="mt-auto border-t border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        perPage={perPage}
                        onPageChange={setCurrentPage}
                        onPerPageChange={(v) => {
                            setPerPage(v);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <AttendanceRequestDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activeRequest={activeReq}
                employees={store.employees}
                onClose={() => setDrawerMode("none")}
                onSave={(payload) => {
                    if (drawerMode === "edit" && activeReq) {
                        store.updateAttendanceRequest(activeReq.id, payload);
                        toast.success("Attendance request updated");
                    } else {
                        store.addAttendanceRequest(payload);
                        toast.success("Attendance request created");
                    }
                    setDrawerMode("none");
                }}
            />
        </div>
    );
}