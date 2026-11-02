"use client";
import { useState, useMemo, useCallback } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { GlobalAttendanceLog, AttendanceDrawerState } from "@/types/attendance.types";
import { toast } from "sonner";

export function useAttendancesManager() {
    const store = useGlobalAttendanceStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [activeDrawer, setActiveDrawer] = useState<AttendanceDrawerState>("none");
    const [activeLogId, setActiveLogId] = useState<string | null>(null);
    const [detailsLogId, setDetailsLogId] = useState<string | null>(null);

    const filteredLogs = useMemo(() => {
        return store.globalLogs.filter(log =>
            log.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.date.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [store.globalLogs, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getActiveLog = useCallback(() => {
        return store.globalLogs.find(l => l.id === activeLogId) || null;
    }, [activeLogId, store.globalLogs]);

    const getDetailsLog = useCallback(() => {
        return store.globalLogs.find(l => l.id === detailsLogId) || null;
    }, [detailsLogId, store.globalLogs]);

    const openAddDrawer = () => { setActiveLogId(null); setActiveDrawer("add"); };
    const openEditDrawer = (id: string) => { setActiveLogId(id); setActiveDrawer("edit"); };
    const closeFormDrawer = () => { setActiveDrawer("none"); setTimeout(() => setActiveLogId(null), 300); };

    const openDetails = (id: string) => setDetailsLogId(id);
    const closeDetails = () => setDetailsLogId(null);

    const handleSubmit = (data: any) => {
        if (activeDrawer === "edit" && activeLogId) {
            store.updateLog(activeLogId, data);
            toast.success("Attendance updated");
        } else {
            // Mocking the injection of employee details for pure UI showcase
            store.addLog({
                ...data, employeeName: "Selected Employee", empCode: "EMP-XXXX", leave: "-",
                inLocation: "202.134.11.246", inCoordinates: "23.81333, 90.42318",
                punchOut: "—", outLocation: "—", outCoordinates: "", breakTimes: "0:00:00", totalHours: "0:00:00"
            });
            toast.success("Attendance logged");
        }
        closeFormDrawer();
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this attendance log?")) {
            store.deleteLog(id);
            toast.success("Log deleted");
        }
    };

    return {
        logs: paginatedLogs,
        searchQuery, setSearchQuery,
        activeDrawer, openAddDrawer, openEditDrawer, closeFormDrawer,
        detailsLogId, openDetails, closeDetails,
        getActiveLog, getDetailsLog,
        handleSubmit, handleDelete, updateStatus: store.updateLogStatus,
        table: { currentPage, totalPages, perPage, onPageChange: setCurrentPage, onPerPageChange: (v: number) => { setPerPage(v); setCurrentPage(1); } }
    };
}

export type AttendancesManagerType = ReturnType<typeof useAttendancesManager>;