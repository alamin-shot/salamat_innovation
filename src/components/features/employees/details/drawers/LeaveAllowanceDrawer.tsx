"use client";
import { useState, useEffect } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function LeaveAllowanceDrawer({ manager }: { manager: EmployeeDetailManagerType }) {
    const isOpen = manager.activeSubDrawer === "configure_allowances";
    const [allowances, setAllowances] = useState([...manager.employee.leaveAllowances]);

    useEffect(() => {
        if (isOpen) setAllowances([...manager.employee.leaveAllowances]);
    }, [isOpen, manager.employee.leaveAllowances]);

    const handleSave = () => {
        manager.saveLeaveAllowances(allowances);
    };

    const updateQuota = (id: string, newTotal: number) => {
        setAllowances(prev => prev.map(a => a.id === id ? { ...a, totalDays: Math.max(a.usedDays, newTotal) } : a));
    };

    return (
        <Drawer title="Configure Leave Allowances" isOpen={isOpen} onClose={manager.closeSubDrawer} width="w-full sm:w-[calc(100vw-260px)]">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-2">
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">Adjust the total annual allowance days for each category. You cannot set the total lower than the days already used.</p>

                    {allowances.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                            <div>
                                <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }}></span> {a.leaveType}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">Used: {a.usedDays} days</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-400">TOTAL</label>
                                <input
                                    type="number"
                                    className="erp-input w-20 text-center py-1"
                                    min={a.usedDays}
                                    value={a.totalDays}
                                    onChange={(e) => updateQuota(a.id, Number(e.target.value))}
                                />
                            </div>
                        </div>
                    ))}

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeSubDrawer}>Cancel</Button>
                    <Button variant="default" onClick={handleSave}>Save Quotas</Button>
                </div>
            </div>
        </Drawer>
    );
}