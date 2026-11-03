import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    GlobalAttendanceLog,
    AttendanceRequestItem,
    BreakTimePolicy,
    LiveBreakSession,
    WorkShiftTemplate,
    ShiftSwapRequest,
    AttendanceRecordStatus,
    AttendanceBehavior
} from "@/types/attendance.types";
import {
    ATTENDANCE_EMPLOYEES,
    MOCK_ATTENDANCE_LOGS,
    MOCK_ATTENDANCE_REQUESTS,
    MOCK_BREAK_POLICIES,
    MOCK_LIVE_BREAK_SESSIONS,
    MOCK_WORK_SHIFTS,
    MOCK_SHIFT_SWAPS
} from "@/mocks/attendance.mock";

interface AddAttendancePayload {
    employeeId: string;
    workShift: string;
    isoDate: string;
    punchIn: string;
    punchOut: string;
    behavior: AttendanceBehavior;
    status: AttendanceRecordStatus;
    auditReason?: string;
}

interface GlobalAttendanceStoreState {
    employees: typeof ATTENDANCE_EMPLOYEES;
    globalLogs: GlobalAttendanceLog[];
    requests: AttendanceRequestItem[];
    breakPolicies: BreakTimePolicy[];
    liveBreaks: LiveBreakSession[];
    workShifts: WorkShiftTemplate[];
    swapRequests: ShiftSwapRequest[];

    // Attendances & Daily Log Actions
    addAttendanceLog: (payload: AddAttendancePayload) => void;
    updateAttendanceLog: (id: string, payload: Partial<GlobalAttendanceLog>) => void;
    deleteAttendanceLog: (id: string) => void;
    bulkDeleteLogs: (ids: string[]) => void;
    bulkUpdateLogStatus: (ids: string[], status: AttendanceRecordStatus) => void;
    overrideLogBehavior: (id: string, behavior: AttendanceBehavior, status: AttendanceRecordStatus, auditReason: string) => void;

    // Attendance Requests Actions (Auto-syncs with globalLogs on Approval)
    addAttendanceRequest: (payload: Omit<AttendanceRequestItem, "id" | "createdAt" | "status">) => void;
    updateAttendanceRequest: (id: string, payload: Partial<AttendanceRequestItem>) => void;
    reviewAttendanceRequest: (id: string, status: AttendanceRecordStatus, reviewerComment?: string) => void;
    deleteAttendanceRequest: (id: string) => void;

    // Break Time Actions
    addBreakPolicy: (policy: Omit<BreakTimePolicy, "id">) => void;
    updateBreakPolicy: (id: string, policy: Partial<BreakTimePolicy>) => void;
    deleteBreakPolicy: (id: string) => void;
    endLiveBreakSession: (id: string) => void;

    // Work Shift Actions
    addWorkShift: (shift: Omit<WorkShiftTemplate, "id">) => void;
    updateWorkShift: (id: string, shift: Partial<WorkShiftTemplate>) => void;
    deleteWorkShift: (id: string) => void;
    reviewSwapRequest: (id: string, status: "Approved" | "Rejected") => void;
}

function formatDisplayDate(isoDate: string): string {
    if (!isoDate) return "02 Nov 2026";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export const useGlobalAttendanceStore = create<GlobalAttendanceStoreState>()(
    persist(
        (set) => ({
            employees: ATTENDANCE_EMPLOYEES,
            globalLogs: MOCK_ATTENDANCE_LOGS,
            requests: MOCK_ATTENDANCE_REQUESTS,
            breakPolicies: MOCK_BREAK_POLICIES,
            liveBreaks: MOCK_LIVE_BREAK_SESSIONS,
            workShifts: MOCK_WORK_SHIFTS,
            swapRequests: MOCK_SHIFT_SWAPS,

            addAttendanceLog: (payload) =>
                set((state) => {
                    const emp = state.employees.find((e) => e.id === payload.employeeId) || state.employees[0];
                    const displayDate = formatDisplayDate(payload.isoDate);
                    const punchInVal = payload.punchIn || "10:00 AM";
                    const punchOutVal = payload.punchOut || "—";
                    const newLog: GlobalAttendanceLog = {
                        id: `att-${Date.now()}`,
                        employeeId: emp.id,
                        employeeName: emp.name,
                        empCode: emp.empCode,
                        department: emp.department,
                        designation: emp.designation,
                        outlet: emp.outlet,
                        date: displayDate,
                        isoDate: payload.isoDate,
                        leave: "-",
                        punchIn: punchInVal,
                        inLocation: "103.180.245.41",
                        inCoordinates: "23.8133329, 90.4231868",
                        inAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                        inSelfie: null,
                        punchOut: punchOutVal,
                        outLocation: punchOutVal !== "—" ? "103.180.245.41" : "—",
                        outCoordinates: punchOutVal !== "—" ? "23.8133329, 90.4231868" : "",
                        outAddress: punchOutVal !== "—" ? "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh" : "",
                        outSelfie: null,
                        behavior: payload.behavior,
                        breakTimes: "0:00:00",
                        totalHours: punchOutVal !== "—" ? "09:00:00" : "0:00:00",
                        overtimeHours: "0:00:00",
                        workShift: payload.workShift,
                        status: payload.status,
                        auditReason: payload.auditReason,
                        segments: [
                            {
                                id: `seg-${Date.now()}`,
                                punchIn: punchInVal,
                                inLocation: "103.180.245.41",
                                inCoordinates: "23.8133329, 90.4231868",
                                inAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                                inSelfie: null,
                                punchOut: punchOutVal,
                                outLocation: punchOutVal !== "—" ? "103.180.245.41" : "—",
                                outCoordinates: punchOutVal !== "—" ? "23.8133329, 90.4231868" : "",
                                outAddress: punchOutVal !== "—" ? "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh" : "",
                                outSelfie: null,
                                duration: punchOutVal !== "—" ? "09:00:00" : "0:00:00",
                                deviceInfo: "Manual Admin Entry (ERP Console)",
                                isGeofenceVerified: true
                            }
                        ]
                    };
                    return { globalLogs: [newLog, ...state.globalLogs] };
                }),

            updateAttendanceLog: (id, payload) =>
                set((state) => ({
                    globalLogs: state.globalLogs.map((log) =>
                        log.id === id
                            ? {
                                ...log,
                                ...payload,
                                date: payload.isoDate ? formatDisplayDate(payload.isoDate) : log.date
                            }
                            : log
                    )
                })),

            deleteAttendanceLog: (id) =>
                set((state) => ({
                    globalLogs: state.globalLogs.filter((l) => l.id !== id)
                })),

            bulkDeleteLogs: (ids) =>
                set((state) => ({
                    globalLogs: state.globalLogs.filter((l) => !ids.includes(l.id))
                })),

            bulkUpdateLogStatus: (ids, status) =>
                set((state) => ({
                    globalLogs: state.globalLogs.map((l) => (ids.includes(l.id) ? { ...l, status } : l))
                })),

            overrideLogBehavior: (id, behavior, status, auditReason) =>
                set((state) => ({
                    globalLogs: state.globalLogs.map((l) =>
                        l.id === id ? { ...l, behavior, status, auditReason } : l
                    )
                })),

            addAttendanceRequest: (payload) =>
                set((state) => {
                    const newReq: AttendanceRequestItem = {
                        ...payload,
                        id: `areq-${Date.now()}`,
                        status: "Pending",
                        createdAt: new Date().toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })
                    };
                    return { requests: [newReq, ...state.requests] };
                }),

            updateAttendanceRequest: (id, payload) =>
                set((state) => ({
                    requests: state.requests.map((r) => (r.id === id ? { ...r, ...payload } : r))
                })),

            reviewAttendanceRequest: (id, status, reviewerComment) =>
                set((state) => {
                    const target = state.requests.find((r) => r.id === id);
                    const updatedRequests = state.requests.map((r) =>
                        r.id === id ? { ...r, status, reviewerComment: reviewerComment || r.reviewerComment } : r
                    );

                    // Auto-sync into globalLogs when Approved
                    let updatedLogs = [...state.globalLogs];
                    if (target && status === "Approved") {
                        const existingLogIndex = updatedLogs.findIndex(
                            (l) => l.employeeId === target.employeeId && l.isoDate === target.isoDate
                        );
                        if (existingLogIndex >= 0) {
                            updatedLogs[existingLogIndex] = {
                                ...updatedLogs[existingLogIndex],
                                punchIn: target.punchIn || updatedLogs[existingLogIndex].punchIn,
                                punchOut: target.punchOut || updatedLogs[existingLogIndex].punchOut,
                                behavior: "regular",
                                totalHours: "09:00:00",
                                status: "Approved",
                                auditReason: `Regularized via Request #${target.id}`
                            };
                        }
                    }

                    return { requests: updatedRequests, globalLogs: updatedLogs };
                }),

            deleteAttendanceRequest: (id) =>
                set((state) => ({
                    requests: state.requests.filter((r) => r.id !== id)
                })),

            addBreakPolicy: (policy) =>
                set((state) => ({
                    breakPolicies: [{ ...policy, id: `bt-${Date.now()}` }, ...state.breakPolicies]
                })),

            updateBreakPolicy: (id, policy) =>
                set((state) => ({
                    breakPolicies: state.breakPolicies.map((b) => (b.id === id ? { ...b, ...policy } : b))
                })),

            deleteBreakPolicy: (id) =>
                set((state) => ({
                    breakPolicies: state.breakPolicies.filter((b) => b.id !== id)
                })),

            endLiveBreakSession: (id) =>
                set((state) => ({
                    liveBreaks: state.liveBreaks.map((lb) =>
                        lb.id === id ? { ...lb, status: "Completed", endTime: "Just now" } : lb
                    )
                })),

            addWorkShift: (shift) =>
                set((state) => ({
                    workShifts: [{ ...shift, id: `ws-${Date.now()}` }, ...state.workShifts]
                })),

            updateWorkShift: (id, shift) =>
                set((state) => ({
                    workShifts: state.workShifts.map((ws) => (ws.id === id ? { ...ws, ...shift } : ws))
                })),

            deleteWorkShift: (id) =>
                set((state) => ({
                    workShifts: state.workShifts.filter((ws) => ws.id !== id)
                })),

            reviewSwapRequest: (id, status) =>
                set((state) => ({
                    swapRequests: state.swapRequests.map((s) => (s.id === id ? { ...s, status } : s))
                }))
        }),
        { name: "erp-global-attendance-enterprise-v2" }
    )
);