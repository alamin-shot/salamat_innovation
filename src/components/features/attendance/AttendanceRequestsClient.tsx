"use client";
import { useState, useMemo } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { AttendanceRequestItem, AttendanceRecordStatus } from "@/types/attendance.types";
import { AttendanceRequestDrawer } from "./drawers/AttendanceRequestDrawer";
import { RequestsHeader } from "./requests/RequestsHeader";
import { RequestsFilterBar } from "./requests/RequestsFilterBar";
import { RequestsTable } from "./requests/RequestsTable";
import { toast } from "sonner";

export function AttendanceRequestsClient() {
    const store = useGlobalAttendanceStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusTab, setStatusTab] = useState<"All" | AttendanceRecordStatus>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeReq, setActiveReq] = useState<AttendanceRequestItem | null>(null);

    const filteredRequests = useMemo(() => {
        return store.requests.filter((r) => {
            const matchesSearch =
                r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.note.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusTab === "All" || r.status === statusTab;
            return matchesSearch && matchesStatus;
        });
    }, [store.requests, searchQuery, statusTab]);

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
    const paginated = filteredRequests.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleReview = (req: AttendanceRequestItem, status: AttendanceRecordStatus) => {
        store.reviewAttendanceRequest(req.id, status);
        if (status === "Approved") {
            toast.success(`Approved & synced ${req.employeeName}'s punch to Master Attendances`);
        } else {
            toast.warning(`Marked request from ${req.employeeName} as ${status}`);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this attendance request?")) {
            store.deleteAttendanceRequest(id);
            toast.success("Attendance request deleted");
        }
    };

    const openAddDrawer = () => {
        setActiveReq(null);
        setDrawerMode("add");
    };

    const openEditDrawer = (req: AttendanceRequestItem) => {
        setActiveReq(req);
        setDrawerMode("edit");
    };

    const handleSaveRequest = (payload: any) => {
        if (drawerMode === "edit" && activeReq) {
            store.updateAttendanceRequest(activeReq.id, payload);
            toast.success("Attendance request updated");
        } else {
            store.addAttendanceRequest(payload);
            toast.success("Attendance request created");
        }
        setDrawerMode("none");
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            <RequestsHeader onAddClick={openAddDrawer} />

            {/* Full-Viewport Table Card */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">

                <RequestsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusTab={statusTab}
                    setStatusTab={setStatusTab}
                />

                <RequestsTable
                    paginated={paginated}
                    handleReview={handleReview}
                    handleDelete={handleDelete}
                    onEditClick={openEditDrawer}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    perPage={perPage}
                    setCurrentPage={setCurrentPage}
                    setPerPage={setPerPage}
                />

            </div>

            <AttendanceRequestDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activeRequest={activeReq}
                employees={store.employees}
                onClose={() => setDrawerMode("none")}
                onSave={handleSaveRequest}
            />
        </div>
    );
}