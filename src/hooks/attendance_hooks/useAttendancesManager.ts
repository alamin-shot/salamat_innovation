"use client";
import { useState, useMemo, useCallback } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { AttendanceBehavior, AttendanceRecordStatus } from "@/types/attendance.types";
import { toast } from "sonner";

export function useAttendancesManager() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [behaviorFilter, setBehaviorFilter] = useState("All Behaviors");
    const [shiftFilter, setShiftFilter] = useState("All Shifts");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Column Visibility State matching screenshot "Columns v"
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        date: true,
        leave: true,
        punchRecords: true,
        punchIn: true,
        inLocation: true,
        outLocation: true,
        punchOut: true,
        behavior: true,
        breakTimes: true,
        totalHours: true
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Drawer States
    const [formDrawerMode, setFormDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeLogId, setActiveLogId] = useState<string | null>(null);
    const [detailsLogId, setDetailsLogId] = useState<string | null>(null);
    const [locationDrawerData, setLocationDrawerData] = useState<{
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    } | null>(null);

    const filteredLogs = useMemo(() => {
        return store.globalLogs.filter((log) => {
            const matchesSearch =
                log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.inLocation.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesDept = departmentFilter === "All Departments" || log.department === departmentFilter;
            const matchesBehavior = behaviorFilter === "All Behaviors" || log.behavior === behaviorFilter.toLowerCase();
            const matchesShift = shiftFilter === "All Shifts" || log.workShift === shiftFilter;

            return matchesSearch && matchesDept && matchesBehavior && matchesShift;
        });
    }, [store.globalLogs, searchQuery, departmentFilter, behaviorFilter, shiftFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredLogs.slice(start, start + perPage);
    }, [filteredLogs, currentPage, perPage]);

    const getActiveLog = useCallback(
        () => store.globalLogs.find((l) => l.id === activeLogId) || null,
        [store.globalLogs, activeLogId]
    );

    const getDetailsLog = useCallback(
        () => store.globalLogs.find((l) => l.id === detailsLogId) || null,
        [store.globalLogs, detailsLogId]
    );

    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const openAddDrawer = () => {
        setActiveLogId(null);
        setFormDrawerMode("add");
    };

    const openEditDrawer = (id: string) => {
        setActiveLogId(id);
        setFormDrawerMode("edit");
    };

    const closeFormDrawer = () => {
        setFormDrawerMode("none");
        setTimeout(() => setActiveLogId(null), 200);
    };

    const handleFormSubmit = (data: {
        employeeId: string;
        workShift: string;
        isoDate: string;
        punchIn: string;
        punchOut: string;
        behavior: AttendanceBehavior;
        status: AttendanceRecordStatus;
    }) => {
        if (formDrawerMode === "edit" && activeLogId) {
            store.updateAttendanceLog(activeLogId, data);
            toast.success("Attendance record updated successfully");
        } else {
            store.addAttendanceLog(data);
            toast.success("New attendance record added");
        }
        closeFormDrawer();
    };

    const handleRowAction = (id: string, action: string) => {
        if (action === "Edit") {
            openEditDrawer(id);
        } else if (action === "Reject") {
            store.updateAttendanceLog(id, { status: "Rejected" });
            toast.warning("Attendance record marked as Rejected");
        } else if (action === "Cancel") {
            store.updateAttendanceLog(id, { status: "Canceled" });
            toast.info("Attendance record Canceled");
        } else if (action === "Approve") {
            store.updateAttendanceLog(id, { status: "Approved" });
            toast.success("Attendance record Approved");
        } else if (action === "Delete") {
            if (confirm("Are you sure you want to delete this attendance record?")) {
                store.deleteAttendanceLog(id);
                toast.success("Attendance record deleted");
            }
        }
    };

    const handleBulkAction = (statusOrDelete: "Approved" | "Rejected" | "Delete") => {
        if (statusOrDelete === "Delete") {
            if (confirm(`Delete ${selectedIds.length} selected attendance records?`)) {
                store.bulkDeleteLogs(selectedIds);
                setSelectedIds([]);
                toast.success("Selected records deleted");
            }
        } else {
            store.bulkUpdateLogStatus(selectedIds, statusOrDelete);
            setSelectedIds([]);
            toast.success(`Updated ${selectedIds.length} records to ${statusOrDelete}`);
        }
    };

    return {
        logs: paginatedLogs,
        totalEntries: filteredLogs.length,
        employees: store.employees,
        workShifts: store.workShifts,
        searchQuery,
        setSearchQuery,
        departmentFilter,
        setDepartmentFilter,
        behaviorFilter,
        setBehaviorFilter,
        shiftFilter,
        setShiftFilter,
        isFilterOpen,
        setIsFilterOpen,
        visibleColumns,
        toggleColumn,
        selectedIds,
        setSelectedIds,
        formDrawerMode,
        openAddDrawer,
        openEditDrawer,
        closeFormDrawer,
        getActiveLog,
        handleFormSubmit,
        detailsLogId,
        setDetailsLogId,
        getDetailsLog,
        locationDrawerData,
        setLocationDrawerData,
        handleRowAction,
        handleBulkAction,
        table: {
            currentPage,
            perPage,
            totalPages,
            onPageChange: setCurrentPage,
            onPerPageChange: (val: number) => {
                setPerPage(val);
                setCurrentPage(1);
            }
        }
    };
}

export type AttendancesManagerType = ReturnType<typeof useAttendancesManager>;