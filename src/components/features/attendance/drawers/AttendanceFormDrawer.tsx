"use client";
import { useState, useEffect } from "react";
import { AttendancesManagerType } from "@/hooks/attendance_hooks/useAttendancesManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AttendanceBehavior, RequestStatus } from "@/types/attendance.types";

export function AttendanceFormDrawer({ manager }: { manager: AttendancesManagerType }) {
    const isOpen = manager.activeDrawer !== "none";
    const isEdit = manager.activeDrawer === "edit";
    const log = manager.getActiveLog();

    const [date, setDate] = useState("");
    const [workShift, setWorkShift] = useState("Showroom");
    const [behavior, setBehavior] = useState<AttendanceBehavior>("regular");
    const [status, setStatus] = useState<RequestStatus>("Approved");

    useEffect(() => {
        if (isEdit && log) {
            setDate(log.isoDate);
            setWorkShift(log.workShift);
            setBehavior(log.behavior);
            setStatus(log.status);
        } else if (manager.activeDrawer === "add") {
            setDate(new Date().toISOString().slice(0, 10));
            setWorkShift("Showroom");
            setBehavior("regular");
            setStatus("Approved");
        }
    }, [isEdit, log, manager.activeDrawer]);

    const handleSave = () => {
        manager.handleSubmit({
            isoDate: date,
            date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            workShift, behavior, status
        });
    };

    return (
        <Drawer title={isEdit ? "Update Attendance" : "Add Attendance"} isOpen={isOpen} onClose={manager.closeFormDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6">
                    {!isEdit && (
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Employee <span className="text-red-500">*</span></label>
                            <CustomSelect value="" options={["Choose employee", "Md Zihadul Islam Sazzad", "Alamin Rifat"]} onChange={() => { }} />
                        </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Work Shift <span className="text-red-500">*</span></label>
                        <CustomSelect value={workShift} options={["Showroom", "Head Office", "Remote"]} onChange={setWorkShift} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Date <span className="text-red-500">*</span></label>
                            <input type="date" className="erp-input text-gray-700" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Behavior <span className="text-red-500">*</span></label>
                            <CustomSelect value={behavior} options={["regular", "late", "early", "absent"]} onChange={(v) => setBehavior(v as any)} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Status <span className="text-red-500">*</span></label>
                        <CustomSelect value={status} options={["Pending", "Approved", "Rejected"]} onChange={(v) => setStatus(v as any)} />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeFormDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}