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
    AttendanceBehavior,
    DayStatusOverride,
    MatrixCellCode
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
    employeeShiftMap: Record<string, string>; // employeeId -> workShift.name
    dayOverrides: Record<string, DayStatusOverride>; // `${employeeId}_${isoDate}` -> Override

    // Attendances & Daily Log Actions
    addAttendanceLog: (payload: AddAttendancePayload) => void;
    updateAttendanceLog: (id: string, payload: Partial<GlobalAttendanceLog>) => void;
    deleteAttendanceLog: (id: string) => void;
    bulkDeleteLogs: (ids: string[]) => void;
    bulkUpdateLogStatus: (ids: string[], status: AttendanceRecordStatus) => void;
    overrideLogBehavior: (id: string, behavior: AttendanceBehavior, status: AttendanceRecordStatus, auditReason: string) => void;

    // Matrix Day Override Action (Syncs Matrix <-> GlobalLogs)
    setDayStatusOverride: (payload: {
        employeeId: string;
        isoDate: string;
        code: MatrixCellCode;
        punchIn?: string;
        punchOut?: string;
        behavior?: AttendanceBehavior;
        leaveType?: string;
        note: string;
    }) => void;

    // Attendance Requests Actions
    addAttendanceRequest: (payload: Omit<AttendanceRequestItem, "id" | "createdAt" | "status">) => void;
    updateAttendanceRequest: (id: string, payload: Partial<AttendanceRequestItem>) => void;
    reviewAttendanceRequest: (id: string, status: AttendanceRecordStatus, reviewerComment?: string) => void;
    deleteAttendanceRequest: (id: string) => void;

    // Break Time Actions
    addBreakPolicy: (policy: Omit<BreakTimePolicy, "id">) => void;
    updateBreakPolicy: (id: string, policy: Partial<BreakTimePolicy>) => void;
    deleteBreakPolicy: (id: string) => void;
    startLiveBreakSession: (employeeId: string, breakPolicyId: string) => void;
    endLiveBreakSession: (id: string) => void;
    tickLiveBreaks: () => void;

    // Work Shift & Roster Actions
    addWorkShift: (shift: Omit<WorkShiftTemplate, "id">) => void;
    updateWorkShift: (id: string, shift: Partial<WorkShiftTemplate>) => void;
    deleteWorkShift: (id: string) => void;
    assignEmployeeShift: (employeeId: string, shiftName: string) => void;
    addSwapRequest: (payload: Omit<ShiftSwapRequest, "id" | "status">) => void;
    reviewSwapRequest: (id: string, status: "Approved" | "Rejected") => void;
}

function formatDisplayDate(isoDate: string): string {
    if (!isoDate) return "02 Nov 2026";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const INITIAL_SHIFT_MAP: Record<string, string> = {
    "3346": "Showroom",
    "3347": "Head Office",
    "3358": "Showroom",
    "3360": "Head Office",
    "3363": "Showroom",
    "3369": "Showroom",
    "3372": "Head Office",
    "3373": "Showroom",
    "3374": "Showroom",
    "3375": "Head Office",
    "3376": "Showroom",
    "3377": "Showroom",
    "3378": "Showroom"
};

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
            employeeShiftMap: INITIAL_SHIFT_MAP,
            dayOverrides: {},

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

            setDayStatusOverride: ({ employeeId, isoDate, code, punchIn, punchOut, behavior, leaveType, note }) =>
                set((state) => {
                    const key = `${employeeId}_${isoDate}`;
                    const emp = state.employees.find((e) => e.id === employeeId) || state.employees[0];
                    const shiftName = state.employeeShiftMap[employeeId] || "Showroom";

                    let updatedLogs = [...state.globalLogs];
                    const existingIdx = updatedLogs.findIndex(
                        (l) => l.employeeId === employeeId && l.isoDate === isoDate
                    );

                    if (code === "P") {
                        const inTime = punchIn || "10:00 AM";
                        const outTime = punchOut || "07:00 PM";
                        const chosenBehavior = behavior || "regular";
                        if (existingIdx >= 0) {
                            updatedLogs[existingIdx] = {
                                ...updatedLogs[existingIdx],
                                punchIn: inTime,
                                punchOut: outTime,
                                behavior: chosenBehavior,
                                totalHours: "09:00:00",
                                auditReason: note
                            };
                        } else {
                            updatedLogs = [
                                {
                                    id: `att-${Date.now()}`,
                                    employeeId: emp.id,
                                    employeeName: emp.name,
                                    empCode: emp.empCode,
                                    department: emp.department,
                                    designation: emp.designation,
                                    outlet: emp.outlet,
                                    date: formatDisplayDate(isoDate),
                                    isoDate,
                                    leave: "-",
                                    punchIn: inTime,
                                    inLocation: "103.180.245.41",
                                    inCoordinates: "23.8133329, 90.4231868",
                                    inAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                                    inSelfie: null,
                                    punchOut: outTime,
                                    outLocation: "103.180.245.41",
                                    outCoordinates: "23.8133329, 90.4231868",
                                    outAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                                    outSelfie: null,
                                    behavior: chosenBehavior,
                                    breakTimes: "0:00:00",
                                    totalHours: "09:00:00",
                                    overtimeHours: "0:00:00",
                                    workShift: shiftName,
                                    status: "Approved",
                                    auditReason: note,
                                    segments: [
                                        {
                                            id: `seg-${Date.now()}`,
                                            punchIn: inTime,
                                            inLocation: "103.180.245.41",
                                            inCoordinates: "23.8133329, 90.4231868",
                                            inAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                                            inSelfie: null,
                                            punchOut: outTime,
                                            outLocation: "103.180.245.41",
                                            outCoordinates: "23.8133329, 90.4231868",
                                            outAddress: "RC7F+9C, Jamuna Future Park, Dhaka, Bangladesh",
                                            outSelfie: null,
                                            duration: "09:00:00",
                                            deviceInfo: "Matrix Override (HR Admin)",
                                            isGeofenceVerified: true
                                        }
                                    ]
                                },
                                ...updatedLogs
                            ];
                        }
                    } else if (existingIdx >= 0) {
                        // If overridden to Absent, Leave, Holiday, or Off-Day, remove any conflicting Present log
                        updatedLogs.splice(existingIdx, 1);
                    }

                    return {
                        globalLogs: updatedLogs,
                        dayOverrides: {
                            ...state.dayOverrides,
                            [key]: {
                                key,
                                employeeId,
                                isoDate,
                                code,
                                leaveType: code === "LV" ? leaveType || "Casual Leave" : undefined,
                                note,
                                updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            }
                        }
                    };
                }),

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

            startLiveBreakSession: (employeeId, breakPolicyId) =>
                set((state) => {
                    const emp = state.employees.find((e) => e.id === employeeId) || state.employees[0];
                    const policy = state.breakPolicies.find((p) => p.id === breakPolicyId) || state.breakPolicies[0];
                    const allowedMinutes = policy.durationHours * 60 + policy.durationMinutes;
                    const newSession: LiveBreakSession = {
                        id: `lbs-${Date.now()}`,
                        employeeId: emp.id,
                        employeeName: emp.name,
                        empCode: emp.empCode,
                        outlet: emp.outlet,
                        breakPolicyId: policy.id,
                        breakName: policy.name,
                        startTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        endTime: null,
                        elapsedMinutes: 1,
                        allowedMinutes,
                        status: "Active"
                    };
                    return { liveBreaks: [newSession, ...state.liveBreaks] };
                }),

            endLiveBreakSession: (id) =>
                set((state) => {
                    const target = state.liveBreaks.find((lb) => lb.id === id);
                    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    const updatedBreaks = state.liveBreaks.map((lb) =>
                        lb.id === id ? { ...lb, status: "Completed" as const, endTime: nowStr } : lb
                    );

                    // Sync completed break duration into today's globalLogs breakTimes field
                    let updatedLogs = [...state.globalLogs];
                    if (target) {
                        const mins = target.elapsedMinutes;
                        const formattedBreak = `0:${String(mins).padStart(2, "0")}:00`;
                        updatedLogs = updatedLogs.map((log) =>
                            log.employeeId === target.employeeId && log.isoDate === "2026-11-02"
                                ? { ...log, breakTimes: formattedBreak }
                                : log
                        );
                    }

                    return { liveBreaks: updatedBreaks, globalLogs: updatedLogs };
                }),

            tickLiveBreaks: () =>
                set((state) => ({
                    liveBreaks: state.liveBreaks.map((lb) => {
                        if (lb.status === "Completed") return lb;
                        const nextElapsed = lb.elapsedMinutes + 1;
                        const nextStatus = nextElapsed > lb.allowedMinutes ? "Exceeded" : "Active";
                        return { ...lb, elapsedMinutes: nextElapsed, status: nextStatus };
                    })
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

            assignEmployeeShift: (employeeId, shiftName) =>
                set((state) => {
                    const nextMap = { ...state.employeeShiftMap, [employeeId]: shiftName };
                    const updatedShifts = state.workShifts.map((ws) => ({
                        ...ws,
                        assignedEmployeeCount: Object.values(nextMap).filter((n) => n === ws.name).length
                    }));
                    return { employeeShiftMap: nextMap, workShifts: updatedShifts };
                }),

            addSwapRequest: (payload) =>
                set((state) => ({
                    swapRequests: [
                        { ...payload, id: `swap-${Date.now()}`, status: "Pending" },
                        ...state.swapRequests
                    ]
                })),

            reviewSwapRequest: (id, status) =>
                set((state) => {
                    const target = state.swapRequests.find((s) => s.id === id);
                    const nextMap = { ...state.employeeShiftMap };
                    if (target && status === "Approved") {
                        const reqShift = nextMap[target.requesterId] || "Showroom";
                        const targShift = nextMap[target.targetEmployeeId] || "Head Office";
                        nextMap[target.requesterId] = targShift;
                        nextMap[target.targetEmployeeId] = reqShift;
                    }
                    return {
                        swapRequests: state.swapRequests.map((s) => (s.id === id ? { ...s, status } : s)),
                        employeeShiftMap: nextMap
                    };
                })
        }),
        { name: "erp-global-attendance-enterprise-v3" }
    )
);