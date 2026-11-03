"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { BreakTimePolicy } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BreakTimeDrawer } from "./drawers/BreakTimeDrawer";
import { Plus, Columns, Edit, Trash2, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

export function BreakTimeClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"policies" | "live">("policies");
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activePolicy, setActivePolicy] = useState<BreakTimePolicy | null>(null);

    const filteredPolicies = store.breakPolicies.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this break time policy?")) {
            store.deleteBreakPolicy(id);
            toast.success("Break time deleted");
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Break Time</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Configure break time policies and monitor active showroom floor breaks.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                        <button
                            onClick={() => setActiveTab("policies")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "policies"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Break Policies ({store.breakPolicies.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("live")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "live"
                                ? "bg-brand-primary text-white"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Live Floor Breaks ({store.liveBreaks.length})
                        </button>
                    </div>

                    <Button variant="outline" size="sm" className="h-9 bg-white flex items-center gap-1.5">
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => {
                            setActivePolicy(null);
                            setDrawerMode("add");
                        }}
                        className="h-9 flex items-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Add Break Time
                    </Button>
                </div>
            </div>

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="erp-input max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab === "policies" ? (
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Name</TableHeadCell>
                            <TableHeadCell>Duration</TableHeadCell>
                            <TableHeadCell>Policy Type</TableHeadCell>
                            <TableHeadCell>Applicable Shifts</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {filteredPolicies.map((bt) => (
                                <TableRow key={bt.id} className="hover:bg-gray-50/70">
                                    <TableCell className="font-semibold text-gray-900 text-xs">
                                        {bt.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-700 font-medium">
                                        {bt.durationHours}h {bt.durationMinutes}m
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {bt.isPaid ? "Paid Break" : "Unpaid"} • Max {bt.maxPerShift}/shift
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-600">
                                        {bt.assignedShifts.join(", ")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => {
                                                    setActivePolicy(bt);
                                                    setDrawerMode("edit");
                                                }}
                                                title="Edit Break Time"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button
                                                variant="destructive-ghost"
                                                size="icon-sm"
                                                onClick={() => handleDelete(bt.id)}
                                                title="Delete Break Time"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table containerClassName="flex-1 min-h-[380px]">
                        <TableHeader>
                            <TableHeadCell>Employee</TableHeadCell>
                            <TableHeadCell>Outlet</TableHeadCell>
                            <TableHeadCell>Break Policy</TableHeadCell>
                            <TableHeadCell>Started At</TableHeadCell>
                            <TableHeadCell>Elapsed vs Allowed</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {store.liveBreaks.map((lb) => {
                                const isExceeded = lb.status === "Exceeded";
                                return (
                                    <TableRow
                                        key={lb.id}
                                        className={isExceeded ? "bg-rose-50/60" : "hover:bg-gray-50"}
                                    >
                                        <TableCell>
                                            <div className="font-semibold text-gray-900 text-xs">
                                                {lb.employeeName}
                                            </div>
                                            <div className="text-[10px] text-gray-400">{lb.empCode}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600">{lb.outlet}</TableCell>
                                        <TableCell className="text-xs font-medium text-gray-800">
                                            {lb.breakName}
                                        </TableCell>
                                        <TableCell className="text-xs font-mono">{lb.startTime}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`font-mono text-xs font-bold ${isExceeded ? "text-rose-600" : "text-gray-800"
                                                    }`}
                                            >
                                                {lb.elapsedMinutes}m / {lb.allowedMinutes}m
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {isExceeded ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                                    <AlertTriangle className="w-3 h-3" /> Exceeded (+
                                                    {lb.elapsedMinutes - lb.allowedMinutes}m)
                                                </span>
                                            ) : lb.status === "Active" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Clock className="w-3 h-3" /> On Break
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" /> Completed
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {lb.status !== "Completed" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={() => {
                                                        store.endLiveBreakSession(lb.id);
                                                        toast.success(`Ended break session for ${lb.employeeName}`);
                                                    }}
                                                >
                                                    Force End Break
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>

            <BreakTimeDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activePolicy={activePolicy}
                onClose={() => setDrawerMode("none")}
                onSave={(payload) => {
                    if (drawerMode === "edit" && activePolicy) {
                        store.updateBreakPolicy(activePolicy.id, payload);
                        toast.success("Break time updated");
                    } else {
                        store.addBreakPolicy(payload);
                        toast.success("Break time added");
                    }
                    setDrawerMode("none");
                }}
            />
        </div>
    );
}