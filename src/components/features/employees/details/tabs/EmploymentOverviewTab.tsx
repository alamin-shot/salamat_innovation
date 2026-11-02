"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { OverviewEditDrawer } from "../drawers/OverviewEditDrawer";
import { Button } from "@/components/ui/Button";
import { Calendar, ShieldCheck, Briefcase, Badge, Star, Building2, Edit } from "lucide-react";

export function EmploymentOverviewTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const emp = manager.employee;

    const renderCard = (title: string, value: React.ReactNode, icon: React.ReactNode, color: string) => (
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-${color}-50 text-${color}-500 border border-${color}-100`}>
                {icon}
            </div>
            <div className="flex flex-col gap-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</div>
                <div className="text-sm font-semibold text-gray-900">{value}</div>
            </div>
        </div>
    );

    return (
        <div className="erp-card bg-white p-6 shadow-sm relative">
            <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Employment Overview</h2>
                    <p className="text-xs text-gray-500 mt-1">Current employment and position details</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => manager.setActiveSubDrawer("edit_overview")} className="h-8 border-brand-primary text-brand-primary">
                    <Edit className="w-3.5 h-3.5 mr-2" /> Edit Overview
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCard("Joining Date", emp.joiningDate, <Calendar className="w-5 h-5" />, "blue")}
                {renderCard(
                    "Employment Status",
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{emp.employeeStatus}</span>,
                    <ShieldCheck className="w-5 h-5" />,
                    "emerald"
                )}
                {renderCard("Department", emp.department, <Building2 className="w-5 h-5" />, "cyan")}
                {renderCard("Designation", emp.designation, <Badge className="w-5 h-5" />, "rose")}
                {renderCard("Role", <span className="text-purple-600">{emp.role}</span>, <Star className="w-5 h-5" />, "purple")}
                {renderCard("Work Shift", emp.workShift, <Briefcase className="w-5 h-5" />, "orange")}
            </div>

            <div className="mt-4 border border-teal-100 rounded-lg p-4 bg-teal-50/30 flex items-start gap-4 w-full">
                <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-teal-50 text-teal-600 border border-teal-100">
                    <Building2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assigned Shops / Tenants</div>
                    <div className="flex flex-wrap gap-2">
                        {emp.assignedShops.map(shop => (
                            <span key={shop} className="text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                                {shop}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <OverviewEditDrawer manager={manager} />
        </div>
    );
}