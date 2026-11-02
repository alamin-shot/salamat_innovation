export type AttendanceBehavior = "regular" | "late" | "early" | "absent";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Canceled";

export interface GlobalAttendanceLog {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode: string;
    date: string; // e.g., "02 Nov 2026"
    isoDate: string; // "2026-11-02"
    leave: string; // "-" or "Casual Leave"
    punchIn: string; // "02:18 PM"
    inLocation: string; // IP or Address
    inCoordinates: string; // "23.8133, 90.4231"
    inSelfie?: string;
    punchOut: string; // "08:06 PM" or "—"
    outLocation: string;
    outCoordinates: string;
    outSelfie?: string;
    behavior: AttendanceBehavior;
    breakTimes: string; // "0:00:00"
    totalHours: string; // "10:08:38"
    workShift: string;
    status: RequestStatus;
}

export interface AttendanceRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    punchIn: string;
    punchOut: string;
    note: string;
    status: RequestStatus;
}

export interface BreakTimeConfig {
    id: string;
    name: string; // e.g., "Lunch Break"
    durationHours: number;
    durationMinutes: number;
}

export type AttendanceDrawerState = "none" | "add" | "edit";