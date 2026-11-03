"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { JobHistoryCategory } from "@/types/employee.types";

export function JobHistoryEditDrawer({ manager }: { manager: EmployeeDetailManagerType }) {
    const isOpen = manager.activeSubDrawer === "edit_job_history";
    const category: JobHistoryCategory = manager.activeJobHistoryCategory;

    const [newValue, setNewValue] = useState("");
    const [effectiveDate, setEffectiveDate] = useState("");
    const [remarks, setRemarks] = useState("");

    // Reset form when drawer opens
    useEffect(() => {
        if (isOpen) {
            setNewValue("");
            setEffectiveDate(new Date().toISOString().slice(0, 10)); // Default to today
            setRemarks("");
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!newValue || !effectiveDate) return;

        // Format date for display
        const dateObj = new Date(effectiveDate);
        const formattedDate = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

        manager.saveJobHistoryUpdate(newValue, formattedDate, remarks);
    };

    const getTitle = () => {
        switch (category) {
            case "department": return "Change Department";
            case "designation": return "Update Designation";
            case "employeeStatus": return "Update Employee Status";
            case "salary": return "Update Base Salary";
            default: return "Update History";
        }
    };

    const renderInput = () => {
        switch (category) {
            case "department":
                return <CustomSelect value={newValue} options={manager.departments} onChange={setNewValue} placeholder="Select new department" />;
            case "designation":
                return <CustomSelect value={newValue} options={manager.designations} onChange={setNewValue} placeholder="Select new designation" />;
            case "employeeStatus":
                return <CustomSelect value={newValue} options={manager.employeeStatuses} onChange={setNewValue} placeholder="Select new status" />;
            case "salary":
                return (
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <input type="number" className="erp-input pl-8" min={0} placeholder="Enter new salary amount" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Drawer title={getTitle()} isOpen={isOpen} onClose={manager.closeSubDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-2">

                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded border border-blue-200 leading-relaxed mb-2">
                        Updating this record will automatically close the current timeline entry and set this new value as <strong>CURRENT</strong>.
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">New Value <span className="text-red-500">*</span></label>
                        {renderInput()}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Effective Start Date <span className="text-red-500">*</span></label>
                        <input type="date" className="erp-input text-gray-700" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Remarks (Optional)</label>
                        <textarea className="erp-input h-20 resize-none py-2" placeholder="e.g. Annual appraisal promotion" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeSubDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave} disabled={!newValue || !effectiveDate}>Apply Update</Button>
                </div>
            </div>
        </Drawer>
    );
}