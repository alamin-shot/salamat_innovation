"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MultiSelect } from "@/components/shared/MultiSelect";

export function OverviewEditDrawer({ manager }: { manager: EmployeeDetailManagerType }) {
    const isOpen = manager.activeSubDrawer === "edit_overview";
    const emp = manager.employee;

    const [joiningDate, setJoiningDate] = useState(emp.joiningDate);
    const [role, setRole] = useState(emp.role);
    const [workShift, setWorkShift] = useState(emp.workShift);
    const [assignedShops, setAssignedShops] = useState<string[]>([...emp.assignedShops]);

    useEffect(() => {
        if (isOpen) {
            setJoiningDate(emp.joiningDate);
            setRole(emp.role);
            setWorkShift(emp.workShift);
            setAssignedShops([...emp.assignedShops]);
        }
    }, [isOpen, emp]);

    const handleSave = () => {
        manager.saveEmploymentOverview({ joiningDate, role, workShift, assignedShops });
    };

    return (
        <Drawer title="Edit Employment Overview" isOpen={isOpen} onClose={manager.closeSubDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6">

                    <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded border border-yellow-200 leading-relaxed mb-2">
                        <strong>Note:</strong> Department, Designation, and Employee Status must be updated through the <strong>Job History</strong> tab to maintain compliance records.
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Joining Date</label>
                        <input type="date" className="erp-input text-gray-700" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Role Title</label>
                        <CustomSelect value={role} options={manager.roles} onChange={setRole} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Work Shift</label>
                        <CustomSelect value={workShift} options={["Showroom", "Head Office", "Remote"]} onChange={setWorkShift} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Assigned Shops / Tenants</label>
                        <MultiSelect value={assignedShops} options={manager.shops} onChange={setAssignedShops} placeholder="Select outlets..." />
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeSubDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save Overview</Button>
                </div>
            </div>
        </Drawer>
    );
}