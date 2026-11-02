"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import {
    Employee,
    CreateEmployeePayload,
    EmployeeDirectoryDrawerState
} from "@/types/employee.types";
import { toast } from "sonner";

export function useEmployeeManager() {
    const router = useRouter();
    const store = useEmployeeStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [activeDrawer, setActiveDrawer] = useState<EmployeeDirectoryDrawerState>("none");
    const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredEmployees = useMemo(() => {
        return store.employees.filter((emp) => {
            const matchesSearch =
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDept =
                departmentFilter === "All Departments" || emp.department === departmentFilter;

            return matchesSearch && matchesDept;
        });
    }, [store.employees, searchQuery, departmentFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / perPage));

    const paginatedEmployees = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredEmployees.slice(start, start + perPage);
    }, [filteredEmployees, currentPage, perPage]);

    const getActiveEmployee = useCallback((): Employee | undefined => {
        if (!activeEmployeeId) return undefined;
        return store.employees.find((emp) => emp.id === activeEmployeeId);
    }, [activeEmployeeId, store.employees]);

    const openAddDrawer = useCallback(() => {
        setActiveEmployeeId(null);
        setActiveDrawer("add");
    }, []);

    const openEditDrawer = useCallback((id: string) => {
        setActiveEmployeeId(id);
        setActiveDrawer("edit");
    }, []);

    const closeDrawer = useCallback(() => {
        setActiveDrawer("none");
        setTimeout(() => setActiveEmployeeId(null), 250);
    }, []);

    const navigateToDetails = useCallback(
        (id: string) => {
            router.push(`/admin/employee/employees/${id}?tab=personal_info`);
        },
        [router]
    );

    const handleSubmit = useCallback(
        (formData: CreateEmployeePayload) => {
            if (activeDrawer === "edit" && activeEmployeeId) {
                store.updateEmployeeCore(activeEmployeeId, formData);
                toast.success("Employee profile updated successfully");
            } else {
                store.addEmployee(formData);
                toast.success("New employee onboarded successfully");
            }
            closeDrawer();
        },
        [activeDrawer, activeEmployeeId, store, closeDrawer]
    );

    const handleDelete = useCallback(
        (id: string) => {
            if (confirm("Are you sure you want to remove this employee record?")) {
                store.deleteEmployee(id);
                setSelectedIds((prev) => prev.filter((item) => item !== id));
                toast.success("Employee deleted");
            }
        },
        [store]
    );

    const handleBulkDelete = useCallback(() => {
        if (confirm(`Delete ${selectedIds.length} selected employee records?`)) {
            store.bulkDeleteEmployees(selectedIds);
            setSelectedIds([]);
            toast.success("Selected employees deleted");
        }
    }, [selectedIds, store]);

    const handleQuickAction = useCallback(
        (id: string, action: string) => {
            const emp = store.employees.find((e) => e.id === id);
            if (!emp) return;

            switch (action) {
                case "Activate":
                    store.updateEmployeeCore(id, { status: "Active" });
                    toast.success(`${emp.name} marked as Active`);
                    break;
                case "Deactivate":
                    store.updateEmployeeCore(id, { status: "Inactive" });
                    toast.success(`${emp.name} deactivated`);
                    break;
                case "Mark Permanent":
                    store.appendJobHistoryRecord(id, "employeeStatus", "Permanent", "2 Nov 2026", "Confirmed via Quick Action");
                    toast.success(`${emp.name} promoted to Permanent status`);
                    break;
                case "Mark Probation":
                    store.appendJobHistoryRecord(id, "employeeStatus", "Probation", "2 Nov 2026");
                    toast.success(`${emp.name} set to Probation`);
                    break;
                case "Resend Email":
                    toast.success(`Onboarding credentials resent to ${emp.email}`);
                    break;
                default:
                    break;
            }
        },
        [store]
    );

    return {
        employees: paginatedEmployees,
        allFilteredCount: filteredEmployees.length,
        designations: store.designations,
        departments: store.departments,
        employeeStatuses: store.employeeStatuses,
        shops: store.shops,
        roles: store.roles,
        searchQuery,
        setSearchQuery,
        departmentFilter,
        setDepartmentFilter,
        activeDrawer,
        activeEmployeeId,
        selectedIds,
        setSelectedIds,
        getActiveEmployee,
        openAddDrawer,
        openEditDrawer,
        closeDrawer,
        navigateToDetails,
        handleSubmit,
        handleDelete,
        handleBulkDelete,
        handleQuickAction,
        table: {
            currentPage,
            perPage,
            totalPages,
            onPageChange: setCurrentPage,
            onPerPageChange: (newPerPage: number) => {
                setPerPage(newPerPage);
                setCurrentPage(1);
            }
        }
    };
}

export type EmployeeManagerType = ReturnType<typeof useEmployeeManager>;