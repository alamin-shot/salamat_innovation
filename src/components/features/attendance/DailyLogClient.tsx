"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { GlobalAttendanceLog, AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Drawer } from "@/components/ui/Drawer";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { PunchLocationDrawer } from "./drawers/PunchLocationDrawer";
import { SelfieVerificationDrawer } from "./drawers/SelfieVerificationDrawer";
import { Columns, MapPin, ChevronRight, ChevronDown, Edit } from "lucide-react";
import { toast } from "sonner";

export function DailyLogClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [behaviorFilter, setBehaviorFilter] = useState("All Behaviors");
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const [visibleCols, setVisibleCols] = useState({
        punchIn: true,
        inSelfie: true,
        inLocation: true,
        outLocation: true,
        punchOut: true,
        outSelfie: true,
        behavior: true,
        breakTimes: true,
        totalHours: true
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Drawers State
    const [locationDrawerData, setLocationDrawerData] = useState<{
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    } | null>(null);
    const [selfieAuditData, setSelfieAuditData] = useState<{
        log: GlobalAttendanceLog;
        punchType: "In" | "Out";
    } | null>(null);
    const [overrideTarget, setOverrideTarget] = useState<GlobalAttendanceLog | null>(null);
    const [overrideBehavior, setOverrideBehavior] = useState<AttendanceBehavior>("regular");
    const [overrideStatus, setOverrideStatus] = useState<AttendanceRecordStatus>("Approved");
    const [auditReason, setAuditReason] = useState("");

    const filteredLogs = useMemo(() => {
        return store.globalLogs.filter((log) => {
            const matchesSearch =
                log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.inLocation.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBehavior =
                behaviorFilter === "All Behaviors" || log.behavior === behaviorFilter.toLowerCase();
            return matchesSearch && matchesBehavior;
        });
    }, [store.globalLogs, searchQuery, behaviorFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const getBehaviorBadge = (behavior: string) => {
        if (behavior === "late") return "bg-rose-50 text-rose-600 border-rose-200";
        if (behavior === "early") return "bg-cyan-50 text-cyan-600 border-cyan-200";
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
    };

    const handleSaveOverride = () => {
        if (!overrideTarget || !auditReason.trim()) {
            toast.error("Please provide an audit trail reason");
            return;
        }
        store.overrideLogBehavior(overrideTarget.id, overrideBehavior, overrideStatus, auditReason);
        toast.success(`Updated behavior for ${overrideTarget.employeeName}`);
        setOverrideTarget(null);
        setAuditReason("");
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 ">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Daily Attendance Log</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Real-time daily biometric punches, selfie verification, and IP telemetry.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="w-44">
                        <CustomSelect
                            value={behaviorFilter}
                            options={["All Behaviors", "Regular", "Late", "Early"]}
                            onChange={setBehaviorFilter}
                        />
                    </div>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                            className="h-9 bg-white flex items-center gap-1.5"
                        >
                            <Columns className="w-3.5 h-3.5" /> Columns
                        </Button>
                        {showColumnsMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40 flex flex-col gap-2 text-xs">
                                {Object.entries(visibleCols).map(([k, v]) => (
                                    <label key={k} className="flex items-center gap-2 cursor-pointer capitalize">
                                        <input
                                            type="checkbox"
                                            checked={v}
                                            onChange={() =>
                                                setVisibleCols((p) => ({ ...p, [k]: !p[k as keyof typeof visibleCols] }))
                                            }
                                            className="rounded text-brand-primary"
                                        />
                                        {k.replace(/([A-Z])/g, " $1")}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Viewport Table Card (p-0 + flex-1) */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="erp-input max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="text-xs text-gray-400">
                        Click any Selfie or IP address to open the Biometric & Location Audit Drawer
                    </span>
                </div>

                <Table containerClassName="flex-1 min-h-[420px]">
                    <TableHeader>
                        <TableHeadCell className="w-8"></TableHeadCell>
                        <TableHeadCell className="w-64 sticky left-0 bg-gray-50/95 z-10">Profile</TableHeadCell>
                        {visibleCols.punchIn && <TableHeadCell>Punch In</TableHeadCell>}
                        {visibleCols.inSelfie && <TableHeadCell>In Selfie</TableHeadCell>}
                        {visibleCols.inLocation && <TableHeadCell>In Location</TableHeadCell>}
                        {visibleCols.outLocation && <TableHeadCell>Out Location</TableHeadCell>}
                        {visibleCols.punchOut && <TableHeadCell>Punch Out</TableHeadCell>}
                        {visibleCols.outSelfie && <TableHeadCell>Out Selfie</TableHeadCell>}
                        {visibleCols.behavior && <TableHeadCell>Behavior</TableHeadCell>}
                        {visibleCols.breakTimes && <TableHeadCell>Break Times</TableHeadCell>}
                        {visibleCols.totalHours && <TableHeadCell>Total Hours</TableHeadCell>}
                    </TableHeader>
                    <TableBody>
                        {paginatedLogs.map((log) => {
                            const isExpanded = expandedIds.includes(log.id);
                            return (
                                <React.Fragment key={log.id}>
                                    <TableRow className="hover:bg-emerald-50/30 transition-colors">
                                        <TableCell>
                                            <button
                                                onClick={() => toggleExpand(log.id)}
                                                className="p-1 rounded hover:bg-gray-100 text-gray-400"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell className="sticky left-0 bg-white z-10">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColorClass(
                                                        log.employeeId
                                                    )}`}
                                                >
                                                    {getInitials(log.employeeName)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-xs">
                                                        {log.employeeName}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">
                                                        ID: {log.empCode}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {visibleCols.punchIn && (
                                            <TableCell className="text-xs font-medium text-gray-800">
                                                {log.punchIn}
                                            </TableCell>
                                        )}
                                        {visibleCols.inSelfie && (
                                            <TableCell>
                                                {log.inSelfie ? (
                                                    <button
                                                        onClick={() =>
                                                            setSelfieAuditData({ log, punchType: "In" })
                                                        }
                                                        className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-brand-primary transition"
                                                        title="Inspect Biometric Selfie"
                                                    >
                                                        <img
                                                            src={log.inSelfie}
                                                            alt={log.employeeName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                        )}
                                        {visibleCols.inLocation && (
                                            <TableCell>
                                                <button
                                                    onClick={() =>
                                                        setLocationDrawerData({
                                                            type: "In",
                                                            ip: log.inLocation,
                                                            coordinates: log.inCoordinates,
                                                            address: log.inAddress,
                                                            employeeName: log.employeeName
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1 text-xs font-mono text-gray-700 underline hover:text-brand-primary"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                    {log.inLocation}
                                                </button>
                                            </TableCell>
                                        )}
                                        {visibleCols.outLocation && (
                                            <TableCell>
                                                {log.outLocation !== "—" ? (
                                                    <button
                                                        onClick={() =>
                                                            setLocationDrawerData({
                                                                type: "Out",
                                                                ip: log.outLocation,
                                                                coordinates: log.outCoordinates,
                                                                address: log.outAddress,
                                                                employeeName: log.employeeName
                                                            })
                                                        }
                                                        className="inline-flex items-center gap-1 text-xs font-mono text-gray-700 underline hover:text-brand-primary"
                                                    >
                                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                        {log.outLocation}
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                        )}
                                        {visibleCols.punchOut && (
                                            <TableCell className="text-xs text-gray-700">
                                                {log.punchOut}
                                            </TableCell>
                                        )}
                                        {visibleCols.outSelfie && (
                                            <TableCell>
                                                {log.outSelfie ? (
                                                    <button
                                                        onClick={() =>
                                                            setSelfieAuditData({ log, punchType: "Out" })
                                                        }
                                                        className="w-8 h-8 rounded-full overflow-hidden border border-gray-300"
                                                    >
                                                        <img
                                                            src={log.outSelfie}
                                                            alt="Out Selfie"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                        )}
                                        {visibleCols.behavior && (
                                            <TableCell>
                                                <button
                                                    onClick={() => {
                                                        setOverrideTarget(log);
                                                        setOverrideBehavior(log.behavior);
                                                        setOverrideStatus(log.status);
                                                    }}
                                                    className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold border capitalize hover:opacity-80 ${getBehaviorBadge(
                                                        log.behavior
                                                    )}`}
                                                    title="Click to override behavior"
                                                >
                                                    {log.behavior} <Edit className="w-2.5 h-2.5 opacity-60" />
                                                </button>
                                            </TableCell>
                                        )}
                                        {visibleCols.breakTimes && (
                                            <TableCell className="text-xs font-mono text-gray-700">
                                                {log.breakTimes}
                                            </TableCell>
                                        )}
                                        {visibleCols.totalHours && (
                                            <TableCell className="text-xs font-mono font-bold text-gray-900">
                                                {log.totalHours}
                                            </TableCell>
                                        )}
                                    </TableRow>

                                    {isExpanded && (
                                        <TableRow className="bg-slate-50/90">
                                            <TableCell colSpan={11} className="px-12 py-3 text-xs">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div>
                                                        <strong>Shift:</strong> {log.workShift} ({log.outlet}) •{" "}
                                                        <strong>Device:</strong>{" "}
                                                        {log.segments[0]?.deviceInfo || "Terminal"}
                                                    </div>
                                                    {log.auditReason && (
                                                        <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                                                            <strong>Audit Note:</strong> {log.auditReason}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}
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

            <PunchLocationDrawer
                locationData={locationDrawerData}
                onClose={() => setLocationDrawerData(null)}
            />
            <SelfieVerificationDrawer
                data={selfieAuditData}
                onClose={() => setSelfieAuditData(null)}
            />

            {/* Behavior Audit Override Drawer */}
            <Drawer
                title={`Override Behavior — ${overrideTarget?.employeeName || ""}`}
                isOpen={!!overrideTarget}
                onClose={() => setOverrideTarget(null)}
                width="drawer-full-content"
            >
                <div className="flex flex-col h-full pt-6">
                    <div className="flex-1 px-6 flex flex-col gap-5 max-w-xl">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Behavior Classification</label>
                            <CustomSelect
                                value={overrideBehavior}
                                options={["regular", "late", "early", "absent"]}
                                onChange={(val) => setOverrideBehavior(val as AttendanceBehavior)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Approval Status</label>
                            <CustomSelect
                                value={overrideStatus}
                                options={["Approved", "Pending", "Rejected"]}
                                onChange={(val) => setOverrideStatus(val as AttendanceRecordStatus)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Mandatory Audit Trail Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="erp-input min-h-[100px] py-2"
                                placeholder="State why this punch behavior is being manually overridden..."
                                value={auditReason}
                                onChange={(e) => setAuditReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                        <Button variant="outline" onClick={() => setOverrideTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={handleSaveOverride}>
                            Save Override
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}