"use client";
import { useState, useEffect } from "react";
import { AttendancesManagerType } from "@/hooks/attendance_hooks/useAttendancesManager";
import { AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function AttendanceFormDrawer({ manager }: { manager: AttendancesManagerType }) {
    const isOpen = manager.formDrawerMode !== "none";
    const isEdit = manager.formDrawerMode === "edit";
    const activeLog = manager.getActiveLog();

    const [employeeId, setEmployeeId] = useState("");
    const [workShift, setWorkShift] = useState("Showroom");
    const [isoDate, setIsoDate] = useState("2026-11-02");
    const [punchIn, setPunchIn] = useState("10:00 AM");
    const [punchOut, setPunchOut] = useState("—");
    const [behavior, setBehavior] = useState<AttendanceBehavior>("regular");
    const [status, setStatus] = useState<AttendanceRecordStatus>("Approved");

    useEffect(() => {
        if (isEdit && activeLog) {
            setEmployeeId(activeLog.employeeId);
            setWorkShift(activeLog.workShift);
            setIsoDate(activeLog.isoDate);
            setPunchIn(activeLog.punchIn);
            setPunchOut(activeLog.punchOut);
            setBehavior(activeLog.behavior);
            setStatus(activeLog.status);
        } else if (manager.formDrawerMode === "add") {
            setEmployeeId(manager.employees[0]?.id || "3347");
            setWorkShift("Showroom");
            setIsoDate(new Date().toISOString().slice(0, 10));
            setPunchIn("10:00 AM");
            setPunchOut("—");
            setBehavior("regular");
            setStatus("Approved");
        }
    }, [isEdit, activeLog, manager.formDrawerMode, manager.employees]);

    const handleSave = () => {
        manager.handleFormSubmit({
            employeeId,
            workShift,
            isoDate,
            punchIn,
            punchOut,
            behavior,
            status
        });
    };

    const employeeOptions = manager.employees.map((e) => `${e.name} (${e.empCode})`);
    const selectedEmpLabel =
        manager.employees.find((e) => e.id === employeeId)
            ? `${manager.employees.find((e) => e.id === employeeId)!.name} (${manager.employees.find((e) => e.id === employeeId)!.empCode
            })`
            : employeeOptions[0];

    return (
        <Drawer
            title={isEdit ? "Update Attendance" : "Add Attendance"}
            isOpen={isOpen}
            onClose={manager.closeFormDrawer}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-2 max-w-3xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Employee <span className="text-red-500">*</span>
                        </label>
                        {isEdit ? (
                            <input
                                type="text"
                                className="erp-input bg-gray-50 text-gray-600"
                                value={activeLog?.employeeName || ""}
                                readOnly
                            />
                        ) : (
                            <CustomSelect
                                value={selectedEmpLabel}
                                options={employeeOptions}
                                onChange={(label) => {
                                    const found = manager.employees.find((e) => label.includes(e.empCode));
                                    if (found) setEmployeeId(found.id);
                                }}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Work Shift <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                            value={workShift}
                            options={manager.workShifts.map((s) => s.name)}
                            onChange={setWorkShift}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="erp-input"
                                value={isoDate}
                                onChange={(e) => setIsoDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Behavior <span className="text-red-500">*</span>
                            </label>
                            <CustomSelect
                                value={behavior}
                                options={["regular", "late", "early", "absent"]}
                                onChange={(val) => setBehavior(val as AttendanceBehavior)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch In Time</label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. 10:00 AM"
                                value={punchIn}
                                onChange={(e) => setPunchIn(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch Out Time</label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. 07:00 PM or —"
                                value={punchOut}
                                onChange={(e) => setPunchOut(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <CustomSelect
                            value={status}
                            options={["Approved", "Pending", "Rejected", "Canceled"]}
                            onChange={(val) => setStatus(val as AttendanceRecordStatus)}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeFormDrawer}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}