export type AttendanceBehavior = "regular" | "late" | "early" | "absent" | "on_leave";
export type AttendanceRecordStatus = "Approved" | "Pending" | "Rejected" | "Canceled";
export type MatrixCellCode = "P" | "L" | "A" | "LV" | "H" | "-";

export interface PunchSegment {
    id: string;
    punchIn: string;
    inLocation: string;
    inCoordinates: string;
    inAddress: string;
    inSelfie: string | null;
    punchOut: string;
    outLocation: string;
    outCoordinates: string;
    outAddress: string;
    outSelfie: string | null;
    duration: string;
    deviceInfo: string;
    isGeofenceVerified: boolean;
}

export interface GlobalAttendanceLog {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode: string;
    department: string;
    designation: string;
    outlet: string;
    date: string;       // "02 Nov 2026"
    isoDate: string;    // "2026-11-02"
    leave: string;      // "-" or "Casual Leave"
    punchIn: string;    // "02:18 PM"
    inLocation: string; // "202.134.11.246"
    inCoordinates: string;
    inAddress: string;
    inSelfie: string | null;
    punchOut: string;   // "08:06 PM" or "—"
    outLocation: string;
    outCoordinates: string;
    outAddress: string;
    outSelfie: string | null;
    behavior: AttendanceBehavior;
    breakTimes: string; // "0:00:00"
    totalHours: string; // "10:08:38"
    overtimeHours: string; // "01:08:38"
    workShift: string;  // "Showroom" | "Head Office"
    status: AttendanceRecordStatus;
    auditReason?: string;
    segments: PunchSegment[];
}

export interface AttendanceRequestItem {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode: string;
    department: string;
    date: string;       // "02 Nov 2026"
    isoDate: string;    // "2026-11-02"
    originalPunchIn: string;
    originalPunchOut: string;
    punchIn: string;    // Requested Punch In
    punchOut: string;   // Requested Punch Out
    requestType: "Missing Punch" | "Late Regularization" | "Early Out Override" | "Remote Work";
    note: string;
    reviewerComment?: string;
    status: AttendanceRecordStatus;
    createdAt: string;
}

export interface BreakTimePolicy {
    id: string;
    name: string;
    durationHours: number;
    durationMinutes: number;
    isPaid: boolean;
    autoDeduct: boolean;
    maxPerShift: number;
    assignedShifts: string[];
}

export interface LiveBreakSession {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode: string;
    outlet: string;
    breakPolicyId: string;
    breakName: string;
    startTime: string;
    endTime: string | null;
    elapsedMinutes: number;
    allowedMinutes: number;
    status: "Active" | "Completed" | "Exceeded";
}

export interface WorkShiftTemplate {
    id: string;
    name: string;
    code: string;
    startTime: string; // "10:00 AM"
    endTime: string;   // "08:00 PM"
    graceMinutes: number;
    halfDayHours: number;
    fullDayHours: number;
    weekends: string[]; // ["Friday"]
    breakPolicyIds: string[];
    assignedEmployeeCount: number;
    status: "Active" | "Inactive";
}

export interface ShiftSwapRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    targetEmployeeId: string;
    targetEmployeeName: string;
    date: string;
    fromShift: string;
    toShift: string;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
}

export interface ReportEmployeeSummary {
    employeeId: string;
    employeeName: string;
    empCode: string;
    department: string;
    dailyStatuses: Record<number, { code: MatrixCellCode; isLate?: boolean; logId?: string }>;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    earlyCount: number;
    leaveCount: number;
    holidayCount: number;
    totalWorkedHours: string;
    overtimeHours: string;
    payableDays: number;
}