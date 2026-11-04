"use client";
import { useState, useMemo } from "react";
import { useGlobalLeavesStore } from "@/store/useGlobalLeavesStore";
import { LeaveTypeItem } from "@/types/leaves.types";
import { toast } from "sonner";

export function useLeaveTypeManager() {
    const store = useGlobalLeavesStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Drawer state
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeTargetId, setActiveTargetId] = useState<string | null>(null);

    const filteredLogs = useMemo(() => {
        return store.leaveTypes.filter((lt) =>
            lt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [store.leaveTypes, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
    const paginated = filteredLogs.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getActiveType = () => store.leaveTypes.find((lt) => lt.id === activeTargetId) || null;

    const openAddDrawer = () => { setActiveTargetId(null); setDrawerMode("add"); };
    const openEditDrawer = (id: string) => { setActiveTargetId(id); setDrawerMode("edit"); };
    const closeDrawer = () => { setDrawerMode("none"); setTimeout(() => setActiveTargetId(null), 300); };

    const handleSave = (payload: Omit<LeaveTypeItem, "id">) => {
        if (drawerMode === "edit" && activeTargetId) {
            store.updateLeaveType(activeTargetId, payload);
            toast.success("Leave Type updated successfully");
        } else {
            store.addLeaveType(payload);
            toast.success("Leave Type added successfully");
        }
        closeDrawer();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this Leave Type?")) {
            store.deleteLeaveType(id);
            toast.success("Leave Type deleted");
        }
    };

    return {
        logs: paginated,
        searchQuery, setSearchQuery,
        drawerMode, openAddDrawer, openEditDrawer, closeDrawer, getActiveType,
        handleSave, handleDelete,
        table: { currentPage, totalPages, perPage, onPageChange: setCurrentPage, onPerPageChange: (v: number) => { setPerPage(v); setCurrentPage(1); } }
    };
}
export type LeaveTypeManagerType = ReturnType<typeof useLeaveTypeManager>;