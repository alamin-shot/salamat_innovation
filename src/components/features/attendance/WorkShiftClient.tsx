"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Drawer } from "@/components/ui/Drawer";
import { WorkShiftDrawer } from "./drawers/WorkShiftDrawer";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Clock, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

const SHORT_TO_FULL_DAY: Record<string, string> = {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday"
};

export function WorkShiftClient() {
    const store = useGlobalAttendanceStore();

    const [activeTab, setActiveTab] = useState<"templates" | "roster" | "swaps">("templates");
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeShift, setActiveShift] = useState<WorkShiftTemplate | null>(null);

    // Swap Request Drawer State
    const [isSwapDrawerOpen, setIsSwapDrawerOpen] = useState(false);
    const [requesterId, setRequesterId] = useState("3358");
    const [targetEmpId, setTargetEmpId] = useState("3347");
    const [swapDate, setSwapDate] = useState("2026-11-05");
    const [swapReason, setSwapReason] = useState("");

    const handleDelete = (id: string) => {
        if (confirm("Delete this work shift template?")) {
            store.deleteWorkShift(id);
            toast.success("Work shift deleted");
        }
    };

    const empOptions = store.employees.map((e) => `${e.name} (${e.empCode})`);

    return (
        <div className="flex flex-col w-full h-full gap-2">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Work Shift</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage shift templates, assign employee rosters (synced with Attendance Report), and approve shift swaps.
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
                            Weekly Roster ({store.employees.length})
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

                    {activeTab === "swaps" && (
                        <Button
                            variant="outline"
                            onClick={() => setIsSwapDrawerOpen(true)}
                            className="h-9 bg-white flex items-center gap-1.5"
                        >
                            <ArrowLeftRight className="w-3.5 h-3.5" /> New Swap Request
                        </Button>
                    )}

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
                            <TableHeadCell>Weekly Off-Days</TableHeadCell>
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
                                        {
                                            Object.values(store.employeeShiftMap).filter(
                                                (s) => s === ws.name
                                            ).length
                                        }{" "}
                                        Employees
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
                            <TableHeadCell className="w-48">Assigned Work Shift</TableHeadCell>
                            <TableHeadCell className="text-center">Sun</TableHeadCell>
                            <TableHeadCell className="text-center">Mon</TableHeadCell>
                            <TableHeadCell className="text-center">Tue</TableHeadCell>
                            <TableHeadCell className="text-center">Wed</TableHeadCell>
                            <TableHeadCell className="text-center">Thu</TableHeadCell>
                            <TableHeadCell className="text-center">Fri</TableHeadCell>
                            <TableHeadCell className="text-center">Sat</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {store.employees.map((emp) => {
                                const assignedShiftName =
                                    store.employeeShiftMap[emp.id] || "Showroom";
                                const shiftObj =
                                    store.workShifts.find((s) => s.name === assignedShiftName) ||
                                    store.workShifts[0];
                                const shiftOffDays = shiftObj?.weekends || ["Wednesday"];

                                return (
                                    <TableRow key={emp.id} className="hover:bg-gray-50/70">
                                        <TableCell>
                                            <div className="font-semibold text-gray-900 text-xs">
                                                {emp.name}
                                            </div>
                                            <div className="text-[10px] text-gray-400">
                                                {emp.empCode} • {emp.outlet}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <CustomSelect
                                                value={assignedShiftName}
                                                options={store.workShifts.map((s) => s.name)}
                                                onChange={(newShift) => {
                                                    store.assignEmployeeShift(emp.id, newShift);
                                                    toast.success(
                                                        `Assigned ${emp.name} to ${newShift} shift (Attendance Matrix synced)`
                                                    );
                                                }}
                                            />
                                        </TableCell>
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                            (shortDay) => {
                                                const isOff = shiftOffDays.includes(
                                                    SHORT_TO_FULL_DAY[shortDay]
                                                );
                                                return (
                                                    <TableCell key={shortDay} className="text-center">
                                                        {isOff ? (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                                                OFF
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                {shiftObj?.startTime.replace(":00 ", "")}–
                                                                {shiftObj?.endTime.replace(":00 ", "")}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                );
                                            }
                                        )}
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
                                    <TableCell className="text-xs font-medium text-indigo-700">
                                        {s.fromShift} ↔ {s.toShift}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500">{s.reason}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.status === "Approved"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : s.status === "Rejected"
                                                    ? "bg-rose-50 text-rose-600 border-rose-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}
                                        >
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
                                                        toast.success(
                                                            "Shift swap approved & Weekly Roster updated"
                                                        );
                                                    }}
                                                    title="Approve & Swap Roster"
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
                                                    title="Reject Swap"
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

            {/* Create Shift Swap Request Drawer */}
            <Drawer
                title="Request Work Shift Swap"
                isOpen={isSwapDrawerOpen}
                onClose={() => setIsSwapDrawerOpen(false)}
                width="drawer-full-content"
            >
                <div className="flex flex-col h-full pt-6">
                    <div className="flex-1 px-6 flex flex-col gap-5 max-w-xl">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Requesting Employee</label>
                            <CustomSelect
                                value={
                                    empOptions.find((o) => o.includes(requesterId)) || empOptions[0]
                                }
                                options={empOptions}
                                onChange={(label) => {
                                    const emp = store.employees.find((e) => label.includes(e.empCode));
                                    if (emp) setRequesterId(emp.id);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Target Employee to Swap With</label>
                            <CustomSelect
                                value={
                                    empOptions.find((o) => o.includes(targetEmpId)) || empOptions[1]
                                }
                                options={empOptions}
                                onChange={(label) => {
                                    const emp = store.employees.find((e) => label.includes(e.empCode));
                                    if (emp) setTargetEmpId(emp.id);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Effective Date</label>
                            <input
                                type="date"
                                className="erp-input"
                                value={swapDate}
                                onChange={(e) => setSwapDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Reason</label>
                            <textarea
                                className="erp-input min-h-[90px] py-2"
                                placeholder="State reason for shift exchange..."
                                value={swapReason}
                                onChange={(e) => setSwapReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                        <Button variant="outline" onClick={() => setIsSwapDrawerOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                const reqEmp =
                                    store.employees.find((e) => e.id === requesterId) ||
                                    store.employees[0];
                                const targEmp =
                                    store.employees.find((e) => e.id === targetEmpId) ||
                                    store.employees[1];
                                store.addSwapRequest({
                                    requesterId: reqEmp.id,
                                    requesterName: reqEmp.name,
                                    targetEmployeeId: targEmp.id,
                                    targetEmployeeName: targEmp.name,
                                    date: new Date(swapDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    }),
                                    fromShift: store.employeeShiftMap[reqEmp.id] || "Showroom",
                                    toShift: store.employeeShiftMap[targEmp.id] || "Head Office",
                                    reason: swapReason || "Mutual roster exchange"
                                });
                                toast.success("Shift swap request created");
                                setIsSwapDrawerOpen(false);
                            }}
                        >
                            Submit Swap Request
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}