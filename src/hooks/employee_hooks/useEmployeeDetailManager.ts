"use client";
import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import {
    EmployeeDetailTabKey,
    DetailSubDrawerType,
    JobHistoryCategory,
    LeaveStatus,
    PayrollStatus,
    EmployeePayrollRecord
} from "@/types/employee.types";
import { EMPLOYEE_DETAIL_TABS } from "@/mocks/employee.mock";
import { toast } from "sonner";

export function useEmployeeDetailManager(employeeId: string) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const store = useEmployeeStore();

    const rawTab =
        searchParams.get("tab") ||
        searchParams.get("tab-employee-detail-tab") ||
        "personal_info";

    const activeTab = (
        EMPLOYEE_DETAIL_TABS.some((t) => t.key === rawTab) ? rawTab : "personal_info"
    ) as EmployeeDetailTabKey;

    const employee = useMemo(
        () => store.employees.find((e) => e.id === employeeId) || store.employees[0],
        [store.employees, employeeId]
    );

    const [activeSubDrawer, setActiveSubDrawer] = useState<DetailSubDrawerType>("none");
    const [activeJobHistoryCategory, setActiveJobHistoryCategory] =
        useState<JobHistoryCategory>("department");
    const [printablePayslip, setPrintablePayslip] = useState<EmployeePayrollRecord | null>(null);

    const handleTabChange = useCallback(
        (tabKey: EmployeeDetailTabKey) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", tabKey);
            params.delete("tab-employee-detail-tab");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    const openJobHistoryDrawer = useCallback((category: JobHistoryCategory) => {
        setActiveJobHistoryCategory(category);
        setActiveSubDrawer("edit_job_history");
    }, []);

    const closeSubDrawer = useCallback(() => {
        setActiveSubDrawer("none");
    }, []);

    const savePersonalInfo = useCallback(
        (data: Parameters<typeof store.updatePersonalInfo>[1]) => {
            if (!employee) return;
            store.updatePersonalInfo(employee.id, data);
            toast.success("Personal information saved");
        },
        [employee, store]
    );

    const saveContactInfo = useCallback(
        (
            personContact: Parameters<typeof store.updateContactInfo>[1],
            emergencyContact: Parameters<typeof store.updateContactInfo>[2]
        ) => {
            if (!employee) return;
            store.updateContactInfo(employee.id, personContact, emergencyContact);
            toast.success("Contact details updated");
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const saveAddressInfo = useCallback(
        (
            residential: Parameters<typeof store.updateAddressInfo>[1],
            permanent: Parameters<typeof store.updateAddressInfo>[2],
            sameAsResidential: boolean
        ) => {
            if (!employee) return;
            store.updateAddressInfo(employee.id, residential, permanent, sameAsResidential);
            toast.success("Address information updated");
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const saveEmploymentOverview = useCallback(
        (data: Parameters<typeof store.updateEmploymentOverview>[1]) => {
            if (!employee) return;
            store.updateEmploymentOverview(employee.id, data);
            toast.success("Employment overview updated");
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const saveJobHistoryUpdate = useCallback(
        (newValue: string, effectiveDate: string, remarks?: string) => {
            if (!employee) return;
            store.appendJobHistoryRecord(
                employee.id,
                activeJobHistoryCategory,
                newValue,
                effectiveDate,
                remarks
            );
            toast.success("Career history record updated & synced");
            closeSubDrawer();
        },
        [employee, store, activeJobHistoryCategory, closeSubDrawer]
    );

    const saveLeaveAllowances = useCallback(
        (allowances: Parameters<typeof store.updateLeaveAllowances>[1]) => {
            if (!employee) return;
            store.updateLeaveAllowances(employee.id, allowances);
            toast.success("Annual leave allowances updated");
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const createLeaveRequest = useCallback(
        (req: Parameters<typeof store.addLeaveRequest>[1]) => {
            if (!employee) return;
            store.addLeaveRequest(employee.id, req);
            toast.success("Leave request recorded");
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const changeLeaveStatus = useCallback(
        (requestId: string, status: LeaveStatus) => {
            if (!employee) return;
            store.updateLeaveRequestStatus(employee.id, requestId, status);
            toast.success(`Leave status updated to ${status}`);
        },
        [employee, store]
    );

    const createPayslip = useCallback(
        (period: string, year: string, allowances: number, deductions: number) => {
            if (!employee) return;
            store.generatePayslip(employee.id, period, year, allowances, deductions);
            toast.success(`Payslip generated for ${period}`);
            closeSubDrawer();
        },
        [employee, store, closeSubDrawer]
    );

    const changePayslipStatus = useCallback(
        (payrollId: string, status: PayrollStatus) => {
            if (!employee) return;
            store.updatePayslipStatus(employee.id, payrollId, status);
            toast.success(`Payslip marked as ${status}`);
        },
        [employee, store]
    );

    const uploadDocument = useCallback(
        (docName: string, fileName: string, fileSize = "1.4 MB") => {
            if (!employee) return;
            store.addDocument(employee.id, docName, fileName, fileSize);
            toast.success("Document uploaded successfully");
        },
        [employee, store]
    );

    const removeDocument = useCallback(
        (docId: string) => {
            if (!employee) return;
            store.deleteDocument(employee.id, docId);
            toast.success("Document removed");
        },
        [employee, store]
    );

    const togglePunchSimulation = useCallback(() => {
        if (!employee) return;
        store.toggleLiveCheckOut(employee.id);
        toast.success("Shift attendance timestamp updated");
    }, [employee, store]);

    return {
        employee,
        tabs: EMPLOYEE_DETAIL_TABS,
        designations: store.designations,
        departments: store.departments,
        employeeStatuses: store.employeeStatuses,
        shops: store.shops,
        roles: store.roles,
        activeTab,
        handleTabChange,
        activeSubDrawer,
        setActiveSubDrawer,
        closeSubDrawer,
        activeJobHistoryCategory,
        openJobHistoryDrawer,
        printablePayslip,
        setPrintablePayslip,
        savePersonalInfo,
        saveContactInfo,
        saveAddressInfo,
        saveEmploymentOverview,
        saveJobHistoryUpdate,
        saveLeaveAllowances,
        createLeaveRequest,
        changeLeaveStatus,
        createPayslip,
        changePayslipStatus,
        uploadDocument,
        removeDocument,
        togglePunchSimulation
    };
}

export type EmployeeDetailManagerType = ReturnType<typeof useEmployeeDetailManager>;