"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface SwapRequestDrawerProps {
    isOpen: boolean;
    employees: any[];
    onClose: () => void;
    onSubmit: (payload: { requesterId: string; targetEmpId: string; swapDate: string; swapReason: string }) => void;
}

export function SwapRequestDrawer({ isOpen, employees, onClose, onSubmit }: SwapRequestDrawerProps) {
    const [requesterId, setRequesterId] = useState("");
    const [targetEmpId, setTargetEmpId] = useState("");
    const [swapDate, setSwapDate] = useState("");
    const [swapReason, setSwapReason] = useState("");

    useEffect(() => {
        if (isOpen) {
            setRequesterId(employees[0]?.id || "");
            setTargetEmpId(employees[1]?.id || "");
            setSwapDate(new Date().toISOString().slice(0, 10));
            setSwapReason("");
        }
    }, [isOpen, employees]);

    const empOptions = employees.map((e) => `${e.name} (${e.empCode})`);

    return (
        <Drawer
            title="Request Work Shift Swap"
            isOpen={isOpen}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 flex flex-col gap-5 max-w-xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Requesting Employee</label>
                        <CustomSelect
                            value={empOptions.find((o) => o.includes(requesterId)) || empOptions[0]}
                            options={empOptions}
                            onChange={(label) => {
                                const emp = employees.find((e) => label.includes(e.empCode));
                                if (emp) setRequesterId(emp.id);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Target Employee to Swap With</label>
                        <CustomSelect
                            value={empOptions.find((o) => o.includes(targetEmpId)) || empOptions[1]}
                            options={empOptions}
                            onChange={(label) => {
                                const emp = employees.find((e) => label.includes(e.empCode));
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
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="default"
                        onClick={() => onSubmit({ requesterId, targetEmpId, swapDate, swapReason })}
                    >
                        Submit Swap Request
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}