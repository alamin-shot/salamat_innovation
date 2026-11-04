"use client";
import { useState, useEffect, useMemo } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { LeaveRequestItem, LeaveTypeItem, LeaveDurationType } from "@/types/leaves.types";
import { toast } from "sonner";
import { Info } from "lucide-react";

interface LeaveRequestDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activeRequest: LeaveRequestItem | null;
    employees: any[];
    leaveTypes: LeaveTypeItem[];
    onClose: () => void;
    onSave: (payload: any) => void;
}

export function LeaveRequestDrawer({ isOpen, mode, activeRequest, employees, leaveTypes, onClose, onSave }: LeaveRequestDrawerProps) {
    const [employeeId, setEmployeeId] = useState("");
    const [leaveTypeId, setLeaveTypeId] = useState("");
    const [duration, setDuration] = useState<LeaveDurationType>("Single Day");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (mode === "edit" && activeRequest) {
            setEmployeeId(activeRequest.employeeId);
            setLeaveTypeId(activeRequest.leaveTypeId);
            setDuration(activeRequest.duration);
            setStartDate(activeRequest.startDate);
            setEndDate(activeRequest.endDate);
            setNote(activeRequest.note);
        } else if (isOpen) {
            setEmployeeId(employees[0]?.id || "");
            setLeaveTypeId(leaveTypes[0]?.id || "");
            setDuration("Single Day");
            setStartDate(new Date().toISOString().slice(0, 10));
            setEndDate(new Date().toISOString().slice(0, 10));
            setNote("");
        }
    }, [isOpen, mode, activeRequest, employees, leaveTypes]);

    // Dynamic Availability Calculator
    const availability = useMemo(() => {
        if (!employeeId || !leaveTypeId) return null;
        const type = leaveTypes.find(lt => lt.id === leaveTypeId);
        if (!type) return null;
        // In a real app, this reads from store.leaveBalances. We mock it dynamically here based on the quota.
        return { available: type.days, used: 0 };
    }, [employeeId, leaveTypeId, leaveTypes]);

    const handleSubmit = () => {
        if (!startDate) return toast.error("Date is required");
        if (duration === "Multi-Day" && !endDate) return toast.error("End Date is required");

        const emp = employees.find((e) => e.id === employeeId);
        const lt = leaveTypes.find((l) => l.id === leaveTypeId);

        if (!emp || !lt) return toast.error("Invalid selection");

        onSave({
            employeeId: emp.id,
            employeeName: emp.name,
            empCode: emp.empCode,
            leaveTypeId: lt.id,
            leaveTypeName: lt.name,
            duration,
            startDate,
            endDate: duration === "Multi-Day" ? endDate : startDate,
            note,
            attachment: null
        });
    };

    const empOptions = employees.map(e => `${e.name} (${e.empCode})`);
    const ltOptions = leaveTypes.map(lt => lt.name);

    return (
        <Drawer title={mode === "edit" ? "Update Leave Request" : "Add Leave Request"} isOpen={isOpen} onClose={onClose} width="drawer-full-content">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-2xl">

                    {/* Dynamic Availability Banner */}
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Leave Availability</span>
                            <div className="text-xs text-blue-900 mt-1">
                                {availability ? (
                                    <>Based on policy, <strong>{availability.available} days</strong> are available. ({availability.used} days used).</>
                                ) : (
                                    "Please select an employee and leave type to view availability."
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Employee <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={empOptions.find(o => o.includes(employeeId)) || empOptions[0]}
                            options={empOptions}
                            onChange={(lbl) => {
                                const e = employees.find(e => lbl.includes(e.empCode));
                                if (e) setEmployeeId(e.id);
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Leave Type <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={ltOptions.find(o => o === (leaveTypes.find(l => l.id === leaveTypeId)?.name)) || ltOptions[0]}
                                options={ltOptions}
                                onChange={(lbl) => {
                                    const l = leaveTypes.find(l => l.name === lbl);
                                    if (l) setLeaveTypeId(l.id);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Leave Duration <span className="text-red-500">*</span></label>
                            <CustomSelect
                                value={duration}
                                options={["Single Day", "Half Day", "Multi-Day"]}
                                onChange={(v) => setDuration(v as LeaveDurationType)}
                            />
                        </div>
                    </div>

                    {duration === "Multi-Day" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Start Date <span className="text-red-500">*</span></label>
                                <input type="date" className="erp-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">End Date <span className="text-red-500">*</span></label>
                                <input type="date" className="erp-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Date <span className="text-red-500">*</span></label>
                            <input type="date" className="erp-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Note</label>
                        <textarea
                            className="erp-input min-h-[90px] py-2"
                            placeholder="Write your note here"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleSubmit}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}