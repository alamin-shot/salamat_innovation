"use client";
import { useState } from "react";
import { useGlobalAttendanceStore } from "@/store/useGlobalAttendanceStore";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { WorkShiftDrawer } from "./drawers/WorkShiftDrawer";
import { SwapRequestDrawer } from "./drawers/SwapRequestDrawer";
import { WorkShiftHeader } from "./work-shift/WorkShiftHeader";
import { ShiftTemplatesTable } from "./work-shift/ShiftTemplatesTable";
import { WeeklyRosterTable } from "./work-shift/WeeklyRosterTable";
import { ShiftSwapsTable } from "./work-shift/ShiftSwapsTable";
import { toast } from "sonner";

export function WorkShiftClient() {
    const store = useGlobalAttendanceStore();

    const [activeTab, setActiveTab] = useState<"templates" | "roster" | "swaps">("templates");
    const [drawerMode, setDrawerMode] = useState<"none" | "add" | "edit">("none");
    const [activeShift, setActiveShift] = useState<WorkShiftTemplate | null>(null);
    const [isSwapDrawerOpen, setIsSwapDrawerOpen] = useState(false);

    const handleDeleteShift = (id: string) => {
        if (confirm("Delete this work shift template?")) {
            store.deleteWorkShift(id);
            toast.success("Work shift deleted");
        }
    };

    const handleSaveShift = (payload: Omit<WorkShiftTemplate, "id">) => {
        if (drawerMode === "edit" && activeShift) {
            store.updateWorkShift(activeShift.id, payload);
            toast.success("Work shift updated");
        } else {
            store.addWorkShift(payload);
            toast.success("Work shift created");
        }
        setDrawerMode("none");
    };

    const handleAssignShift = (empId: string, shiftName: string, empName: string) => {
        store.assignEmployeeShift(empId, shiftName);
        toast.success(`Assigned ${empName} to ${shiftName} shift (Attendance Matrix synced)`);
    };

    const handleReviewSwap = (id: string, status: "Approved" | "Rejected") => {
        store.reviewSwapRequest(id, status);
        if (status === "Approved") toast.success("Shift swap approved & Weekly Roster updated");
        else toast.warning("Shift swap rejected");
    };

    const handleSubmitSwap = (data: { requesterId: string; targetEmpId: string; swapDate: string; swapReason: string }) => {
        const reqEmp = store.employees.find((e) => e.id === data.requesterId) || store.employees[0];
        const targEmp = store.employees.find((e) => e.id === data.targetEmpId) || store.employees[1];

        store.addSwapRequest({
            requesterId: reqEmp.id,
            requesterName: reqEmp.name,
            targetEmployeeId: targEmp.id,
            targetEmployeeName: targEmp.name,
            date: new Date(data.swapDate).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric"
            }),
            fromShift: store.employeeShiftMap[reqEmp.id] || "Showroom",
            toShift: store.employeeShiftMap[targEmp.id] || "Head Office",
            reason: data.swapReason || "Mutual roster exchange"
        });
        toast.success("Shift swap request created");
        setIsSwapDrawerOpen(false);
    };

    return (
        <div className="flex flex-col w-full h-full gap-2 p-3 sm:p-4">

            <WorkShiftHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                shiftCount={store.workShifts.length}
                employeeCount={store.employees.length}
                swapCount={store.swapRequests.length}
                onAddShift={() => { setActiveShift(null); setDrawerMode("add"); }}
                onNewSwap={() => setIsSwapDrawerOpen(true)}
            />

            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden h-full shadow-sm">
                {activeTab === "templates" && (
                    <ShiftTemplatesTable
                        workShifts={store.workShifts}
                        employeeShiftMap={store.employeeShiftMap}
                        onEdit={(shift) => { setActiveShift(shift); setDrawerMode("edit"); }}
                        onDelete={handleDeleteShift}
                    />
                )}

                {activeTab === "roster" && (
                    <WeeklyRosterTable
                        employees={store.employees}
                        workShifts={store.workShifts}
                        employeeShiftMap={store.employeeShiftMap}
                        onAssignShift={handleAssignShift}
                    />
                )}

                {activeTab === "swaps" && (
                    <ShiftSwapsTable
                        swapRequests={store.swapRequests}
                        onReviewSwap={handleReviewSwap}
                    />
                )}
            </div>

            <WorkShiftDrawer
                isOpen={drawerMode !== "none"}
                mode={drawerMode === "edit" ? "edit" : "add"}
                activeShift={activeShift}
                onClose={() => setDrawerMode("none")}
                onSave={handleSaveShift}
            />

            <SwapRequestDrawer
                isOpen={isSwapDrawerOpen}
                employees={store.employees}
                onClose={() => setIsSwapDrawerOpen(false)}
                onSubmit={handleSubmitSwap}
            />

        </div>
    );
}