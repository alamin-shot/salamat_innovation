"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { JobHistoryEditDrawer } from "../drawers/JobHistoryEditDrawer";
import { JobHistoryCategory, JobHistoryEntry } from "@/types/employee.types";
import { Button } from "@/components/ui/Button";
import { Building2, Badge, ShieldCheck, Banknote, Edit, ArrowRight } from "lucide-react";

export function JobHistoryTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;
    const { jobHistory } = emp;

    const renderHistoryCard = (
        title: string,
        category: JobHistoryCategory,
        icon: React.ReactNode,
        color: string,
        records: JobHistoryEntry[]
    ) => {
        const currentRecord = records.find(r => r.endDate === null) || records[0];

        return (
            <div className="border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm hover:border-gray-200 transition-colors flex flex-col h-full">
                {/* Header */}
                <div className={`p-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-${color}-50 text-${color}-500 border border-${color}-100`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
                            <p className="text-xs text-gray-500">{records.length} record{records.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => manager.openJobHistoryDrawer(category)} title={`Update ${title}`}>
                        <Edit className="w-4 h-4 text-gray-400 hover:text-gray-900" />
                    </Button>
                </div>

                {/* Current Active Record */}
                <div className="p-4 flex-1">
                    {currentRecord ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full bg-${color}-500`}></span>
                                <span className="font-bold text-gray-900 text-sm">{currentRecord.value}</span>
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">CURRENT</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 pl-4">
                                {currentRecord.startDate} <ArrowRight className="w-3 h-3 text-gray-300" /> Present
                            </div>
                            {currentRecord.remarks && (
                                <div className="text-xs text-gray-500 italic pl-4 mt-1 border-l-2 border-gray-100">{currentRecord.remarks}</div>
                            )}
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic">No records found.</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="erp-card bg-white p-6 shadow-sm relative h-full">
            <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Job History</h2>
                    <p className="text-xs text-gray-500 mt-1">Complete career history — update to close the current record and start a new one</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {renderHistoryCard("Department", "department", <Building2 className="w-5 h-5" />, "blue", jobHistory.department)}
                {renderHistoryCard("Designation", "designation", <Badge className="w-5 h-5" />, "purple", jobHistory.designation)}
                {renderHistoryCard("Employee Status", "employeeStatus", <ShieldCheck className="w-5 h-5" />, "orange", jobHistory.employeeStatus)}
                {renderHistoryCard("Salary", "salary", <Banknote className="w-5 h-5" />, "emerald", jobHistory.salary)}
            </div>

            <JobHistoryEditDrawer manager={manager} />
        </div>
    );
}