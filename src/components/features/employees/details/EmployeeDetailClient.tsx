"use client";
import { useEmployeeDetailManager } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { EmployeeProfileBanner } from "./EmployeeProfileBanner";
import { EmployeeTabSidebar } from "./EmployeeTabSidebar";
import { PersonalInfoTab } from "./tabs/PersonalInfoTab";
import { ContactInfoTab } from "./tabs/ContactInfoTab";
import { AddressInfoTab } from "./tabs/AddressInfoTab";
import { EmploymentOverviewTab } from "./tabs/EmploymentOverviewTab";
import { JobHistoryTab } from "./tabs/JobHistoryTab";
import { AttendanceTab } from "./tabs/AttendanceTab";
import { AttendanceCalendarTab } from "./tabs/AttendanceCalendarTab";
import { LeaveAllowancesTab } from "./tabs/LeaveAllowancesTab";
import { LeaveTab } from "./tabs/LeaveTab";
import { PayrollTab } from "./tabs/PayrollTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmployeeDetailClient({ employeeId }: { employeeId: string }) {
    const manager = useEmployeeDetailManager(employeeId);
    const router = useRouter();

    if (!manager.employee) {
        return <div className="p-8 text-center text-gray-500">Employee record not found.</div>;
    }

    const renderActiveTab = () => {
        switch (manager.activeTab) {
            case "personal_info": return <PersonalInfoTab manager={manager} />;
            case "contact_info": return <ContactInfoTab manager={manager} />;
            case "address_info": return <AddressInfoTab manager={manager} />;
            case "employment_overview": return <EmploymentOverviewTab manager={manager} />;
            case "job_history": return <JobHistoryTab manager={manager} />;
            case "attendance": return <AttendanceTab manager={manager} />;
            case "attendances": return <AttendanceCalendarTab manager={manager} />;
            case "leave_allowances": return <LeaveAllowancesTab manager={manager} />;
            case "leave": return <LeaveTab manager={manager} />;
            case "payroll": return <PayrollTab manager={manager} />;
            case "documents": return <DocumentsTab manager={manager} />;
            default: return <div className="p-8 erp-card bg-white text-center text-gray-500 text-sm">Module in development...</div>;
        }
    };

    return (
        <div className="flex flex-col w-full h-full gap-6 p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin/employee/employees")}
                    className="h-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
                </Button>
                <h1 className="text-xl font-bold text-gray-900">{manager.employee.name}</h1>
            </div>

            {/* Top KPI Banner */}
            <EmployeeProfileBanner manager={manager} />

            {/* Main Content Split */}
            <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                <EmployeeTabSidebar manager={manager} />
                <div className="flex-1 w-full min-w-0">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    );
}