"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { BreakTimePolicy } from "@/types/attendance.types";

interface LogFloorBreakDrawerProps {
    isOpen: boolean;
    employees: { id: string; name: string; empCode: string }[];
    breakPolicies: BreakTimePolicy[];
    onClose: () => void;
    onStartBreak: (employeeId: string, policyId: string) => void;
}

export function LogFloorBreakDrawer({
    isOpen,
    employees,
    breakPolicies,
    onClose,
    onStartBreak
}: LogFloorBreakDrawerProps) {
    const [selectedEmpId, setSelectedEmpId] = useState("");
    const [selectedPolicyId, setSelectedPolicyId] = useState("");

    useEffect(() => {
        if (isOpen) {
            setSelectedEmpId(employees[0]?.id || "");
            setSelectedPolicyId(breakPolicies[0]?.id || "");
        }
    }, [isOpen, employees, breakPolicies]);

    const empOptions = employees.map((e) => `${e.name} (${e.empCode})`);
    const policyOptions = breakPolicies.map((p) => `${p.name} (${p.durationHours}h ${p.durationMinutes}m)`);

    return (
        <Drawer
            title="Log Active Floor Break"
            isOpen={isOpen}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 flex flex-col gap-5 max-w-xl">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Select Employee</label>
                        <CustomSelect
                            value={empOptions.find((o) => o.includes(selectedEmpId)) || empOptions[0]}
                            options={empOptions}
                            onChange={(label) => {
                                const emp = employees.find((e) => label.includes(e.empCode));
                                if (emp) setSelectedEmpId(emp.id);
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Select Break Policy</label>
                        <CustomSelect
                            value={
                                policyOptions[breakPolicies.findIndex((p) => p.id === selectedPolicyId)] ||
                                policyOptions[0]
                            }
                            options={policyOptions}
                            onChange={(label) => {
                                const pol = breakPolicies.find((p) => label.startsWith(p.name));
                                if (pol) setSelectedPolicyId(pol.id);
                            }}
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="default"
                        onClick={() => onStartBreak(selectedEmpId, selectedPolicyId)}
                    >
                        Start Break Session
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}