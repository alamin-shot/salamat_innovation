import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GlobalAttendanceLog, AttendanceRequest, BreakTimeConfig, RequestStatus } from "@/types/attendance.types";
import { MOCK_ATTENDANCE_LOGS, MOCK_BREAK_TIMES } from "@/mocks/attendance.mock";

interface GlobalAttendanceStore {
    globalLogs: GlobalAttendanceLog[];
    requests: AttendanceRequest[];
    breakTimes: BreakTimeConfig[];

    addLog: (log: Omit<GlobalAttendanceLog, "id">) => void;
    updateLog: (id: string, log: Partial<GlobalAttendanceLog>) => void;
    deleteLog: (id: string) => void;
    updateLogStatus: (id: string, status: RequestStatus) => void;
    addRequest: (req: Omit<AttendanceRequest, "id">) => void;
    updateRequest: (id: string, req: Partial<AttendanceRequest>) => void;
    deleteRequest: (id: string) => void;

    addBreakTime: (bt: Omit<BreakTimeConfig, "id">) => void;
    updateBreakTime: (id: string, bt: Partial<BreakTimeConfig>) => void;
    deleteBreakTime: (id: string) => void;
}

export const useGlobalAttendanceStore = create<GlobalAttendanceStore>()(
    persist(
        (set) => ({
            globalLogs: MOCK_ATTENDANCE_LOGS,
            requests: [],
            breakTimes: MOCK_BREAK_TIMES,

            addLog: (logData) => set((state) => ({
                globalLogs: [{ ...logData, id: `att-${Date.now()}` }, ...state.globalLogs]
            })),
            updateLog: (id, updatedData) => set((state) => ({
                globalLogs: state.globalLogs.map(l => l.id === id ? { ...l, ...updatedData } : l)
            })),
            deleteLog: (id) => set((state) => ({
                globalLogs: state.globalLogs.filter(l => l.id !== id)
            })),
            updateLogStatus: (id, status) => set((state) => ({
                globalLogs: state.globalLogs.map(l => l.id === id ? { ...l, status } : l)
            })),
            addRequest: (req) => set((state) => ({ requests: [{ ...req, id: `req-${Date.now()}` }, ...state.requests] })),
            updateRequest: (id, req) => set((state) => ({ requests: state.requests.map(r => r.id === id ? { ...r, ...req } : r) })),
            deleteRequest: (id) => set((state) => ({ requests: state.requests.filter(r => r.id !== id) })),

            addBreakTime: (bt) => set((state) => ({ breakTimes: [{ ...bt, id: `bt-${Date.now()}` }, ...state.breakTimes] })),
            updateBreakTime: (id, bt) => set((state) => ({ breakTimes: state.breakTimes.map(b => b.id === id ? { ...b, ...bt } : b) })),
            deleteBreakTime: (id) => set((state) => ({ breakTimes: state.breakTimes.filter(b => b.id !== id) })),

        }),
        { name: "erp-global-attendance-v1" }
    )
);