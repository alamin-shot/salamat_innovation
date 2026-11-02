"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { LeaveAllowanceDrawer } from "../drawers/LeaveAllowanceDrawer";
import { Button } from "@/components/ui/Button";
import { Settings2 } from "lucide-react";

export function LeaveAllowancesTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const { leaveAllowances } = manager.employee;

    return (
        <div className="erp-card bg-white p-6 shadow-sm h-full relative">
            <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Leave Allowances</h2>
                    <p className="text-xs text-gray-500 mt-1">Annual entitlement vs usage per leave type</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => manager.setActiveSubDrawer("configure_allowances")} className="h-8">
                    <Settings2 className="w-3.5 h-3.5 mr-2 text-gray-500" /> Configure Quotas
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {leaveAllowances.map(allowance => {
                    const remaining = allowance.totalDays - allowance.usedDays;
                    const percentage = allowance.totalDays > 0 ? (allowance.usedDays / allowance.totalDays) * 100 : 0;

                    return (
                        <div key={allowance.id} className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm flex flex-col gap-4">
                            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allowance.color }}></span>
                                {allowance.leaveType}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-xs font-semibold text-gray-600">
                                    <span>Used: {allowance.usedDays}</span>
                                    <span>Total: {allowance.totalDays}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: allowance.color }}></div>
                                </div>
                                <div className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                    {remaining} Days Remaining
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <LeaveAllowanceDrawer manager={manager} />
        </div>
    );
}