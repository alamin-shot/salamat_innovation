"use client";
import { useState, useEffect } from "react";
import { BreakTimePolicy } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { toast } from "sonner";

interface BreakTimeDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activePolicy: BreakTimePolicy | null;
    onClose: () => void;
    onSave: (policy: Omit<BreakTimePolicy, "id">) => void;
}

export function BreakTimeDrawer({
    isOpen,
    mode,
    activePolicy,
    onClose,
    onSave
}: BreakTimeDrawerProps) {
    const [name, setName] = useState("");
    const [durationHours, setDurationHours] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState(0);
    const [isPaid, setIsPaid] = useState(true);
    const [autoDeduct, setAutoDeduct] = useState(false);
    const [maxPerShift, setMaxPerShift] = useState(1);
    const [assignedShifts, setAssignedShifts] = useState<string[]>(["Showroom", "Head Office"]);

    useEffect(() => {
        if (mode === "edit" && activePolicy) {
            setName(activePolicy.name);
            setDurationHours(activePolicy.durationHours);
            setDurationMinutes(activePolicy.durationMinutes);
            setIsPaid(activePolicy.isPaid);
            setAutoDeduct(activePolicy.autoDeduct);
            setMaxPerShift(activePolicy.maxPerShift);
            setAssignedShifts(activePolicy.assignedShifts);
        } else if (isOpen) {
            setName("");
            setDurationHours(0);
            setDurationMinutes(0);
            setIsPaid(true);
            setAutoDeduct(false);
            setMaxPerShift(1);
            setAssignedShifts(["Showroom", "Head Office"]);
        }
    }, [isOpen, mode, activePolicy]);

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Break time name is required");
            return;
        }
        if (durationHours === 0 && durationMinutes === 0) {
            toast.error("Duration must be greater than 0m");
            return;
        }
        onSave({
            name,
            durationHours,
            durationMinutes,
            isPaid,
            autoDeduct,
            maxPerShift,
            assignedShifts
        });
    };

    return (
        <Drawer
            title={mode === "edit" ? "Update Break Time" : "Add Break Time"}
            isOpen={isOpen}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-2 max-w-2xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="erp-input"
                            placeholder="Enter break time name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Exact Duration h : m + live badge layout from your screenshot */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">
                            Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2.5">
                            <input
                                type="number"
                                min={0}
                                max={12}
                                className="erp-input w-24 text-center"
                                value={durationHours}
                                onChange={(e) => setDurationHours(Math.max(0, Number(e.target.value)))}
                            />
                            <span className="text-xs font-semibold text-gray-600">h :</span>
                            <input
                                type="number"
                                min={0}
                                max={59}
                                className="erp-input w-24 text-center"
                                value={durationMinutes}
                                onChange={(e) =>
                                    setDurationMinutes(Math.min(59, Math.max(0, Number(e.target.value))))
                                }
                            />
                            <span className="text-xs font-semibold text-gray-600">m</span>
                            <span className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-xs font-bold text-gray-800">
                                {durationHours}h {durationMinutes}m
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Max Allowed Per Shift</label>
                            <input
                                type="number"
                                min={1}
                                max={5}
                                className="erp-input"
                                value={maxPerShift}
                                onChange={(e) => setMaxPerShift(Math.max(1, Number(e.target.value)))}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Applicable Work Shifts</label>
                            <MultiSelect
                                value={assignedShifts}
                                options={["Showroom", "Head Office", "Remote"]}
                                onChange={setAssignedShifts}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                                className="rounded text-brand-primary"
                            />
                            Paid Break (Included in Working Hours)
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoDeduct}
                                onChange={(e) => setAutoDeduct(e.target.checked)}
                                className="rounded text-brand-primary"
                            />
                            Auto-deduct if exceeded
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={handleSubmit}>
                        Save
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}