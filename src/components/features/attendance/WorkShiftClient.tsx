"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { WorkShiftDrawer } from "./drawers/WorkShiftDrawer";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function WorkShiftClient() {
    const store = useGlobalAttendanceStore();

    const [activeTab, setActiveTab] = useState<"templates" | "roster" | "swaps">("templates");
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeShift, setActiveShift] = useState<WorkShiftTemplate | null>(null);

    const handleDelete = (id: string) => {
        if (confirm("Delete this work shift template?")) {
            store.deleteWorkShift(id);
            toast.success("Work shift deleted");
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Work Shift</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage shift templates, weekly showroom rosters, and employee shift swap requests.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                        <button
                            onClick={() => setActiveTab("templates")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "templates"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Shift Templates ({store.workShifts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("roster")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "roster"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Weekly Roster
                        </button>
                        <button
                            onClick={() => setActiveTab("swaps")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "swaps"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Swap Requests ({store.swapRequests.length})
                        </button>
                    </div>

                    <Button
                        variant="default"
                        onClick={() => {
                            setActiveShift(null);
                            setDrawerMode("add");
                        }}
                        className="h-9 flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Add Work Shift
                    </Button>
                </div>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                {activeTab === "templates" && (
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Shift Name</TableHeadCell>
                            <TableHeadCell>Timing</TableHeadCell>
                            <TableHeadCell>Grace Period</TableHeadCell>
                            <TableHeadCell>Half / Full Day</TableHeadCell>
                            <TableHeadCell>Weekly Off</TableHeadCell>
                            <TableHeadCell>Assigned Staff</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {store.workShifts.map((ws) => (
                                <TableRow key={ws.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-brand-primary" /> {ws.name}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-mono">{ws.code}</div>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono font-semibold text-gray-800">
                                        {ws.startTime} – {ws.endTime}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600">
                                        {ws.graceMinutes} mins
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600">
                                        {ws.halfDayHours}h / {ws.fullDayHours}h
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                            {ws.weekends.join(", ")}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-brand-primary">
                                        {ws.assignedEmployeeCount} Employees
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => {
                                                    setActiveShift(ws);
                                                    setDrawerMode("edit");
                                                }}
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="destructive-ghost"
                                                size="icon-sm"
                                                onClick={() => handleDelete(ws.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {activeTab === "roster" && (
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Employee</TableHeadCell>
                            <TableHeadCell>Outlet</TableHeadCell>
                            <TableHeadCell className="text-center">Sun</TableHeadCell>
                            <TableHeadCell className="text-center">Mon</TableHeadCell>
                            <TableHeadCell className="text-center">Tue</TableHeadCell>
                            <TableHeadCell className="text-center">Wed</TableHeadCell>
                            <TableHeadCell className="text-center">Thu</TableHeadCell>
                            <TableHeadCell className="text-center">Fri</TableHeadCell>
                            <TableHeadCell className="text-center">Sat</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {store.employees.slice(0, 8).map((emp) => {
                                const isShowroom = emp.outlet !== "Head Office";
                                return (
                                    <TableRow key={emp.id}>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900 text-xs">{emp.name}</div>
                                            <div className="text-[10px] text-gray-400">{emp.empCode}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600">{emp.outlet}</TableCell>
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                                            const isOff =
                                                (isShowroom && day === "Wed") || (!isShowroom && day === "Fri");
                                            return (
                                                <TableCell key={day} className="text-center">
                                                    {isOff ? (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600">
                                                            OFF
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                                            {isShowroom ? "11A-9P" : "10A-7P"}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}

                {activeTab === "swaps" && (
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Requester</TableHeadCell>
                            <TableHeadCell>Swap With</TableHeadCell>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Shift Exchange</TableHeadCell>
                            <TableHeadCell>Reason</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {store.swapRequests.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-semibold text-xs text-gray-900">
                                        {s.requesterName}
                                    </TableCell>
                                    <TableCell className="font-semibold text-xs text-gray-900">
                                        {s.targetEmployeeName}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-700">{s.date}</TableCell>
                                    <TableCell className="text-xs text-gray-700">
                                        {s.fromShift} ↔ {s.toShift}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">{s.reason}</TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                            {s.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {s.status === "Pending" && (
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => {
                                                        store.reviewSwapRequest(s.id, "Approved");
                                                        toast.success("Shift swap approved");
                                                    }}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => {
                                                        store.reviewSwapRequest(s.id, "Rejected");
                                                        toast.warning("Shift swap rejected");
                                                    }}
                                                >
                                                    <XCircle className="w-4 h-4 text-rose-500" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <WorkShiftDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activeShift={activeShift}
                onClose={() => setDrawerMode("none")}
                onSave={(payload) => {
                    if (drawerMode === "edit" && activeShift) {
                        store.updateWorkShift(activeShift.id, payload);
                        toast.success("Work shift updated");
                    } else {
                        store.addWorkShift(payload);
                        toast.success("Work shift created");
                    }
                    setDrawerMode("none");
                }}
            />
        </div>
    );
}