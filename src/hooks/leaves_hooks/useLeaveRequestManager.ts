"use client";
import { useState, useMemo } from "react";
import { useGlobalLeavesStore } from "@/store/useGlobalLeavesStore";
import { LeaveRequestItem, LeaveRequestStatus } from "@/types/leaves.types";
import { toast } from "sonner";

export function useLeaveRequestManager() {
    const store = useGlobalLeavesStore();

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | LeaveRequestStatus>("All");
    const [typeFilter, setTypeFilter] = useState("All Types");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Bulk Selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Drawers State
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
    const [viewTargetId, setViewTargetId] = useState<string | null>(null); // For Read-only View

    // Derived Data
    const filteredRequests = useMemo(() => {
        return store.leaveRequests.filter((req) => {
            const matchesSearch =
                req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.empCode.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || req.status === statusFilter;
            const matchesType = typeFilter === "All Types" || req.leaveTypeName === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [store.leaveRequests, searchQuery, statusFilter, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
    const paginated = filteredRequests.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getActiveRequest = () => store.leaveRequests.find((r) => r.id === activeTargetId) || null;
    const getViewRequest = () => store.leaveRequests.find((r) => r.id === viewTargetId) || null;

    // Drawer Controls
    const openAddDrawer = () => { setActiveTargetId(null); setDrawerMode("add"); };
    const openEditDrawer = (id: string) => { setActiveTargetId(id); setDrawerMode("edit"); };
    const closeFormDrawer = () => { setDrawerMode("none"); setTimeout(() => setActiveTargetId(null), 300); };
    const openViewDrawer = (id: string) => setViewTargetId(id);
    const closeViewDrawer = () => setViewTargetId(null);

    // Actions
    const handleSave = (payload: Omit<LeaveRequestItem, "id" | "createdAt" | "status">) => {
        if (drawerMode === "edit" && activeTargetId) {
            store.updateLeaveRequest(activeTargetId, payload);
            toast.success("Leave Request updated");
        } else {
            store.addLeaveRequest(payload);
            toast.success("Leave Request created");
        }
        closeFormDrawer();
    };

    const handleReview = (id: string, status: LeaveRequestStatus) => {
        store.reviewLeaveRequest(id, status);
        toast.success(`Leave request ${status.toLowerCase()}`);
    };

    const handleBulkReview = (status: LeaveRequestStatus) => {
        store.bulkReviewRequests(selectedIds, status);
        toast.success(`Bulk marked ${selectedIds.length} requests as ${status}`);
        setSelectedIds([]);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this leave request?")) {
            store.deleteLeaveRequest(id);
            toast.success("Leave Request deleted");
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.length} selected requests?`)) {
            selectedIds.forEach((id) => store.deleteLeaveRequest(id));
            setSelectedIds([]);
            toast.success("Selected requests deleted");
        }
    };

    return {
        requests: paginated,
        leaveTypes: store.leaveTypes,
        employees: store.employees,
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        typeFilter, setTypeFilter,
        selectedIds, setSelectedIds,
        drawerMode, openAddDrawer, openEditDrawer, closeFormDrawer, getActiveRequest,
        viewTargetId, openViewDrawer, closeViewDrawer, getViewRequest,
        handleSave, handleReview, handleBulkReview, handleDelete, handleBulkDelete,
        table: { currentPage, totalPages, perPage, onPageChange: setCurrentPage, onPerPageChange: (v: number) => { setPerPage(v); setCurrentPage(1); } }
    };
}
export type LeaveRequestManagerType = ReturnType<typeof useLeaveRequestManager>;