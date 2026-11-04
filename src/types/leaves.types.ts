export type LeaveRequestStatus = "Pending" | "Approved" | "Rejected" | "Canceled";
export type LeaveDurationType = "Single Day" | "Half Day" | "Multi-Day";

export interface LeaveTypeItem {
    id: string;
    name: string;
    type: "Paid" | "Unpaid";
    days: number;
    carryForward: boolean;
    prorate: boolean;
    status: "Enabled" | "Disabled";
}

export interface LeaveRequestItem {
    id: string;
    employeeId: string;
    employeeName: string;
    empCode: string;
    leaveTypeId: string;
    leaveTypeName: string;
    duration: LeaveDurationType;
    startDate: string;
    endDate: string;
    note: string;
    attachment: string | null;
    reviewerComment?: string;
    status: LeaveRequestStatus;
    createdAt: string;
}

export interface EmployeeLeaveBalance {
    employeeId: string;
    balances: Record<string, { available: number; used: number; accrued: number }>;
}