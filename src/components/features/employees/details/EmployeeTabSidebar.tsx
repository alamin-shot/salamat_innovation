"use client";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import {
    User, Phone, MapPin, Briefcase, CalendarClock,
    CalendarDays, Umbrella, FileText, Banknote, History, FolderOpen
} from "lucide-react";

const TAB_ICONS: Record<string, React.ElementType> = {
    personal_info: User,
    contact_info: Phone,
    address_info: MapPin,
    employment_overview: Briefcase,
    attendance: CalendarClock,
    attendances: CalendarDays,
    leave_allowances: Umbrella,
    leave: FileText,
    payroll: Banknote,
    job_history: History,
    documents: FolderOpen
};

export function EmployeeTabSidebar({ manager }: { manager: EmployeeDetailManagerType }) {
    return (
        <div className="w-full lg:w-64 shrink-0 erp-card bg-white p-3 flex flex-col gap-1 shadow-sm">
            {manager.tabs.map((tab) => {
                const Icon = TAB_ICONS[tab.key] || FileText;
                const isActive = manager.activeTab === tab.key;

                return (
                    <button
                        key={tab.key}
                        onClick={() => manager.handleTabChange(tab.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-brand-primary/10 text-brand-primary shadow-sm border border-brand-primary/20"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                            }`}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : "text-gray-400"}`} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}