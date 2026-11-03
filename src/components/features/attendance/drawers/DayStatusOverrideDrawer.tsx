"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MatrixCellCode, AttendanceBehavior } from "@/types/attendance.types";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";

export function DayStatusOverrideDrawer({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    const [overrideCode, setOverrideCode] = useState<MatrixCellCode>("P");
    const [overridePunchIn, setOverridePunchIn] = useState("10:00 AM");
    const [overridePunchOut, setOverridePunchOut] = useState("07:00 PM");
    const [overrideBehavior, setOverrideBehavior] = useState<AttendanceBehavior>("regular");
    const [overrideLeaveType, setOverrideLeaveType] = useState("Casual Leave");
    const [overrideNote, setOverrideNote] = useState("");

    useEffect(() => {
        if (manager.overrideCellTarget) {
            const cur = manager.overrideCellTarget.currentCell;
            setOverrideCode(cur.code === "A" ? "P" : cur.code);
            setOverridePunchIn(cur.punchIn || "10:00 AM");
            setOverridePunchOut(cur.punchOut || "07:00 PM");
            setOverrideBehavior(cur.isLate ? "late" : "regular");
            setOverrideLeaveType(cur.leaveTitle || "Casual Leave");
            setOverrideNote(cur.note || "");
        }
    }, [manager.overrideCellTarget]);

    return (
        <Drawer
            title={
                manager.overrideCellTarget
                    ? `Manage Day Status — ${manager.overrideCellTarget.employeeName} (${manager.overrideCellTarget.displayDate})`
                    : "Manage Day Status"
            }
            isOpen={!!manager.overrideCellTarget}
            onClose={() => manager.setOverrideCellTarget(null)}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-2xl">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-gray-600">
                        Changes saved here immediately recalculate the <strong>30-Day Attendance Matrix</strong>,{" "}
                        <strong>Master Attendances Ledger</strong>, and <strong>Net Payable Days</strong>.
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Select Day Classification <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            {[
                                { code: "P" as MatrixCellCode, label: "Present (P)", cls: "border-emerald-300 bg-emerald-50 text-emerald-700" },
                                { code: "LV" as MatrixCellCode, label: "Paid Leave (L)", cls: "border-cyan-300 bg-cyan-50 text-cyan-700" },
                                { code: "H" as MatrixCellCode, label: "Holiday (H)", cls: "border-amber-300 bg-amber-50 text-amber-700" },
                                { code: "-" as MatrixCellCode, label: "Weekly Off (—)", cls: "border-gray-300 bg-gray-100 text-gray-700" },
                                { code: "A" as MatrixCellCode, label: "Absent (A)", cls: "border-rose-300 bg-rose-50 text-rose-700" }
                            ].map((item) => (
                                <button
                                    key={item.code}
                                    type="button"
                                    onClick={() => setOverrideCode(item.code)}
                                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition ${overrideCode === item.code ? `${item.cls} ring-2 ring-brand-primary` : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {overrideCode === "P" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 bg-white">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Punch In</label>
                                <input type="text" className="erp-input" value={overridePunchIn} onChange={(e) => setOverridePunchIn(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Punch Out</label>
                                <input type="text" className="erp-input" value={overridePunchOut} onChange={(e) => setOverridePunchOut(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Behavior</label>
                                <CustomSelect value={overrideBehavior} options={["regular", "late", "early"]} onChange={(v) => setOverrideBehavior(v as AttendanceBehavior)} />
                            </div>
                        </div>
                    )}

                    {overrideCode === "LV" && (
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Leave Allowance Type</label>
                            <CustomSelect value={overrideLeaveType} options={["Casual Leave", "Sick Leave", "Earned Leave", "Maternity / Paternity Leave"]} onChange={setOverrideLeaveType} />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Audit Note / Reference</label>
                        <textarea className="erp-input min-h-[90px] py-2" placeholder="e.g. Approved manual attendance or gazetted holiday..." value={overrideNote} onChange={(e) => setOverrideNote(e.target.value)} />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={() => manager.setOverrideCellTarget(null)}>Cancel</Button>
                    <Button
                        variant="default"
                        onClick={() => manager.handleSaveCellOverride({ code: overrideCode, punchIn: overridePunchIn, punchOut: overridePunchOut, behavior: overrideBehavior, leaveType: overrideLeaveType, note: overrideNote || "Updated from Attendance Matrix" })}
                    >
                        Apply Status
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}