"use client";
import { useState, useEffect } from "react";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { toast } from "sonner";

interface WorkShiftDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activeShift: WorkShiftTemplate | null;
    onClose: () => void;
    onSave: (payload: Omit<WorkShiftTemplate, "id">) => void;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function WorkShiftDrawer({
    isOpen,
    mode,
    activeShift,
    onClose,
    onSave
}: WorkShiftDrawerProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [startTime, setStartTime] = useState("10:00 AM");
    const [endTime, setEndTime] = useState("07:00 PM");
    const [graceMinutes, setGraceMinutes] = useState(15);
    const [halfDayHours, setHalfDayHours] = useState(4.5);
    const [fullDayHours, setFullDayHours] = useState(9);
    const [weekends, setWeekends] = useState<string[]>(["Friday"]);

    useEffect(() => {
        if (mode === "edit" && activeShift) {
            setName(activeShift.name);
            setCode(activeShift.code);
            setStartTime(activeShift.startTime);
            setEndTime(activeShift.endTime);
            setGraceMinutes(activeShift.graceMinutes);
            setHalfDayHours(activeShift.halfDayHours);
            setFullDayHours(activeShift.fullDayHours);
            setWeekends(activeShift.weekends);
        } else if (isOpen) {
            setName("");
            setCode("");
            setStartTime("10:00 AM");
            setEndTime("07:00 PM");
            setGraceMinutes(15);
            setHalfDayHours(4.5);
            setFullDayHours(9);
            setWeekends(["Friday"]);
        }
    }, [isOpen, mode, activeShift]);

    const handleSubmit = () => {
        if (!name.trim() || !code.trim()) {
            toast.error("Shift Name and Shift Code are required");
            return;
        }
        onSave({
            name,
            code,
            startTime,
            endTime,
            graceMinutes,
            halfDayHours,
            fullDayHours,
            weekends,
            breakPolicyIds: ["bt-1"],
            assignedEmployeeCount: activeShift?.assignedEmployeeCount || 0,
            status: "Active"
        });
    };

    return (
        <Drawer
            title={mode === "edit" ? "Update Work Shift" : "Add Work Shift"}
            isOpen={isOpen}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Shift Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. Showroom Shift"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Shift Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="erp-input"
                                placeholder="e.g. SH-JFP"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Start Time</label>
                            <input
                                type="text"
                                className="erp-input"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">End Time</label>
                            <input
                                type="text"
                                className="erp-input"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Late Grace (Mins)</label>
                            <input
                                type="number"
                                className="erp-input"
                                value={graceMinutes}
                                onChange={(e) => setGraceMinutes(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Half-Day Threshold (Hrs)</label>
                            <input
                                type="number"
                                step="0.5"
                                className="erp-input"
                                value={halfDayHours}
                                onChange={(e) => setHalfDayHours(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Full-Day Target (Hrs)</label>
                            <input
                                type="number"
                                step="0.5"
                                className="erp-input"
                                value={fullDayHours}
                                onChange={(e) => setFullDayHours(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Weekly Off-Days (Weekends)</label>
                        <MultiSelect value={weekends} options={WEEKDAYS} onChange={setWeekends} />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleSubmit}>
                        Save Work Shift
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}