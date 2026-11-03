"use client";
import { useState, useEffect } from "react";
import { AttendanceRequestItem } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { toast } from "sonner";

interface AttendanceRequestDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activeRequest: AttendanceRequestItem | null;
    employees: { id: string; name: string; empCode: string; department: string }[];
    onClose: () => void;
    onSave: (payload: {
        employeeId: string;
        employeeName: string;
        empCode: string;
        department: string;
        date: string;
        isoDate: string;
        originalPunchIn: string;
        originalPunchOut: string;
        punchIn: string;
        punchOut: string;
        requestType: "Missing Punch" | "Late Regularization" | "Early Out Override" | "Remote Work";
        note: string;
    }) => void;
}

export function AttendanceRequestDrawer({
    isOpen,
    mode,
    activeRequest,
    employees,
    onClose,
    onSave
}: AttendanceRequestDrawerProps) {
    const [employeeId, setEmployeeId] = useState(employees[0]?.id || "3378");
    const [isoDate, setIsoDate] = useState("2026-11-02");
    const [punchIn, setPunchIn] = useState("");
    const [punchOut, setPunchOut] = useState("");
    const [requestType, setRequestType] = useState<
        "Missing Punch" | "Late Regularization" | "Early Out Override" | "Remote Work"
    >("Missing Punch");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (mode === "edit" && activeRequest) {
            setEmployeeId(activeRequest.employeeId);
            setIsoDate(activeRequest.isoDate);
            setPunchIn(activeRequest.punchIn);
            setPunchOut(activeRequest.punchOut);
            setRequestType(activeRequest.requestType);
            setNote(activeRequest.note);
        } else if (isOpen) {
            setEmployeeId(employees[0]?.id || "3378");
            setIsoDate(new Date().toISOString().slice(0, 10));
            setPunchIn("");
            setPunchOut("");
            setRequestType("Missing Punch");
            setNote("");
        }
    }, [isOpen, mode, activeRequest, employees]);

    const handleSubmit = () => {
        if (!isoDate) {
            toast.error("Please select a date");
            return;
        }
        if (!punchIn.trim() && !punchOut.trim()) {
            toast.error("Enter at least one of Punch In or Punch Out.");
            return;
        }

        const emp = employees.find((e) => e.id === employeeId) || employees[0];
        const formattedDate = new Date(isoDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        onSave({
            employeeId: emp.id,
            employeeName: emp.name,
            empCode: emp.empCode,
            department: emp.department,
            date: formattedDate,
            isoDate,
            originalPunchIn: activeRequest?.originalPunchIn || "—",
            originalPunchOut: activeRequest?.originalPunchOut || "—",
            punchIn: punchIn || "—",
            punchOut: punchOut || "—",
            requestType,
            note
        });
    };

    const empOptions = employees.map((e) => `${e.name} (${e.empCode})`);
    const selectedEmpLabel =
        employees.find((e) => e.id === employeeId)
            ? `${employees.find((e) => e.id === employeeId)!.name} (${employees.find((e) => e.id === employeeId)!.empCode
            })`
            : empOptions[0];

    return (
        <Drawer
            title={mode === "edit" ? "Update Attendance Request" : "Add Attendance Request"}
            isOpen={isOpen}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-5 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">
                                Employee <span className="text-red-500">*</span>
                            </label>
                            <CustomSelect
                                value={selectedEmpLabel}
                                options={empOptions}
                                onChange={(label) => {
                                    const match = employees.find((e) => label.includes(e.empCode));
                                    if (match) setEmployeeId(match.id);
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Regularization Category</label>
                            <CustomSelect
                                value={requestType}
                                options={[
                                    "Missing Punch",
                                    "Late Regularization",
                                    "Early Out Override",
                                    "Remote Work"
                                ]}
                                onChange={(v) => setRequestType(v as typeof requestType)}
                            />
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch In</label>
                            <input
                                type="time"
                                className="erp-input"
                                value={punchIn}
                                onChange={(e) => setPunchIn(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Punch Out</label>
                            <input
                                type="time"
                                className="erp-input"
                                value={punchOut}
                                onChange={(e) => setPunchOut(e.target.value)}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 -mt-2">
                        Enter at least one of Punch In or Punch Out.
                    </p>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Note</label>
                        <textarea
                            className="erp-input min-h-[110px] py-2 resize-none"
                            placeholder="Write your note here"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
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