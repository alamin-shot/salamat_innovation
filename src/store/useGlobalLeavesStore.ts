import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LeaveTypeItem, LeaveRequestItem, EmployeeLeaveBalance, LeaveRequestStatus } from "@/types/leaves.types";
import { ATTENDANCE_EMPLOYEES } from "@/mocks/attendance.mock";

interface GlobalLeavesStoreState {
    employees: typeof ATTENDANCE_EMPLOYEES;
    leaveTypes: LeaveTypeItem[];
    leaveRequests: LeaveRequestItem[];
    leaveBalances: EmployeeLeaveBalance[];

    // Leave Type Actions
    addLeaveType: (payload: Omit<LeaveTypeItem, "id">) => void;
    updateLeaveType: (id: string, payload: Partial<LeaveTypeItem>) => void;
    deleteLeaveType: (id: string) => void;

    // Leave Request Actions (To be utilized in Module 2)
    addLeaveRequest: (payload: Omit<LeaveRequestItem, "id" | "createdAt" | "status">) => void;
    updateLeaveRequest: (id: string, payload: Partial<LeaveRequestItem>) => void;
    reviewLeaveRequest: (id: string, status: LeaveRequestStatus, reviewerComment?: string) => void;
    deleteLeaveRequest: (id: string) => void;
    bulkReviewRequests: (ids: string[], status: LeaveRequestStatus) => void;
}

const INITIAL_LEAVE_TYPES: LeaveTypeItem[] = [
    { id: "lt-1", name: "Casual Leave", type: "Paid", days: 10, carryForward: false, prorate: true, status: "Enabled" },
    { id: "lt-2", name: "Sick Leave", type: "Paid", days: 14, carryForward: true, prorate: false, status: "Enabled" },
    { id: "lt-3", name: "Unpaid Leave", type: "Unpaid", days: 0, carryForward: false, prorate: false, status: "Enabled" },
];

export const useGlobalLeavesStore = create<GlobalLeavesStoreState>()(
    persist(
        (set) => ({
            employees: ATTENDANCE_EMPLOYEES,
            leaveTypes: INITIAL_LEAVE_TYPES,
            leaveRequests: [],
            leaveBalances: [],

            addLeaveType: (payload) =>
                set((state) => ({
                    leaveTypes: [{ ...payload, id: `lt-${Date.now()}` }, ...state.leaveTypes]
                })),

            updateLeaveType: (id, payload) =>
                set((state) => ({
                    leaveTypes: state.leaveTypes.map((lt) => (lt.id === id ? { ...lt, ...payload } : lt))
                })),

            deleteLeaveType: (id) =>
                set((state) => ({
                    leaveTypes: state.leaveTypes.filter((lt) => lt.id !== id)
                })),

            addLeaveRequest: (payload) =>
                set((state) => {
                    const newReq: LeaveRequestItem = {
                        ...payload,
                        id: `lr-${Date.now()}`,
                        status: "Pending",
                        createdAt: new Date().toISOString()
                    };
                    return { leaveRequests: [newReq, ...state.leaveRequests] };
                }),

            updateLeaveRequest: (id, payload) =>
                set((state) => ({
                    leaveRequests: state.leaveRequests.map((r) => (r.id === id ? { ...r, ...payload } : r))
                })),

            reviewLeaveRequest: (id, status, reviewerComment) =>
                set((state) => {
                    // Complex balance deduction logic will be executed here in Module 2
                    return {
                        leaveRequests: state.leaveRequests.map((r) =>
                            r.id === id ? { ...r, status, reviewerComment: reviewerComment || r.reviewerComment } : r
                        )
                    };
                }),

            deleteLeaveRequest: (id) =>
                set((state) => ({
                    leaveRequests: state.leaveRequests.filter((r) => r.id !== id)
                })),

            bulkReviewRequests: (ids, status) =>
                set((state) => ({
                    leaveRequests: state.leaveRequests.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
                }))
        }),
        { name: "erp-leaves-storage-v1" } // Forces fresh cache
    )
);