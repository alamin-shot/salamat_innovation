"use client";
import { useState, useMemo } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { AttendanceRequestItem } from "@/types/attendance.types";
import { toast } from "sonner";

export function useAttendanceRequestsManager() {
    const store = useGlobalAttendanceStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [activeDrawer, setActiveDrawer] = useState<"none" | "add" | "edit">("none");
    const [activeReqId, setActiveReqId] = useState<string | null>(null);

    const filteredRequests = useMemo(() => {
        return store.requests.filter(req =>
            req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.note.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [store.requests, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
    const paginatedRequests = filteredRequests.slice((currentPage - 1) * perPage, currentPage * perPage);

    const getActiveRequest = () => store.requests.find(r => r.id === activeReqId) || null;

    const openAddDrawer = () => { setActiveReqId(null); setActiveDrawer("add"); };
    const openEditDrawer = (id: string) => { setActiveReqId(id); setActiveDrawer("edit"); };
    const closeDrawer = () => { setActiveDrawer("none"); setTimeout(() => setActiveReqId(null), 300); };

    const handleSubmit = (data: Omit<AttendanceRequestItem, "id" | "createdAt" | "status">) => {
        if (activeDrawer === "edit" && activeReqId) {
            store.updateAttendanceRequest(activeReqId, data);
            toast.success("Request updated");
        } else {
            store.addAttendanceRequest(data);
            toast.success("Attendance request submitted");
        }
        closeDrawer();
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this request?")) {
            store.deleteAttendanceRequest(id);
            toast.success("Request deleted");
        }
    };

    return {
        requests: paginatedRequests, searchQuery, setSearchQuery,
        activeDrawer, openAddDrawer, openEditDrawer, closeDrawer, getActiveRequest,
        handleSubmit, handleDelete,
        table: { currentPage, totalPages, perPage, onPageChange: setCurrentPage, onPerPageChange: (v: number) => { setPerPage(v); setCurrentPage(1); } }
    };
}
export type AttendanceRequestsManagerType = ReturnType<typeof useAttendanceRequestsManager>;