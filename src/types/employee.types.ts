export type AccountStatus = "Active" | "Inactive";
export type GenderType = "Male" | "Female" | "Others";
export type MaritalStatusType = "Single" | "Married" | "Divorced" | "Widowed";
export type AttendanceBehavior = "regular" | "late" | "early" | "absent";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type PayrollStatus = "Generated" | "Sent" | "Paid";
export type JobHistoryCategory = "department" | "designation" | "employeeStatus" | "salary";

export type EmployeeDirectoryDrawerState = "none" | "add" | "edit";

export type EmployeeDetailTabKey =
    | "personal_info"
    | "contact_info"
    | "address_info"
    | "employment_overview"
    | "attendance"
    | "attendances"
    | "leave_allowances"
    | "leave"
    | "payroll"
    | "job_history"
    | "documents";

export type DetailSubDrawerType =
    | "none"
    | "edit_contact"
    | "edit_address"
    | "edit_overview"
    | "edit_job_history"
    | "configure_allowances"
    | "record_leave"
    | "generate_payslip";

export interface PersonContact {
    fullName: string;
    emailAddress: string;
}

export interface EmergencyContact {
    fullName: string;
    relation: string;
    phoneNumber: string;
    emailAddress: string;
}

export interface AddressDetail {
    country: string;
    district: string;
    area: string;
    thana: string;
    postalCode: string;
    streetAddress: string;
}

export interface AttendanceLog {
    id: string;
    inDate: string;
    isoDate: string;
    punchIn: string;
    inLocation: string;
    punchOut: string;
    outLocation: string;
    behavior: AttendanceBehavior;
    breakTimes: string;
    totalHours: string;
}

export interface LeaveAllowanceItem {
    id: string;
    leaveType: string;
    totalDays: number;
    usedDays: number;
    color: string;
}

export interface EmployeeLeaveRequest {
    id: string;
    date: string;
    leaveDuration: string;
    daysCount: number;
    leaveType: string;
    note: string;
    attachment: string | null;
    status: LeaveStatus;
}

export interface EmployeePayrollRecord {
    id: string;
    payrun: string;
    period: string;
    year: string;
    considerType: string;
    payrunType: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: PayrollStatus;
    generatedAt: string;
}

export interface JobHistoryEntry {
    id: string;
    value: string;
    startDate: string;
    endDate: string | null;
    remarks?: string;
}

export interface EmployeeDocument {
    id: string;
    documentName: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
}

export interface EmployeeJobHistoryMap {
    department: JobHistoryEntry[];
    designation: JobHistoryEntry[];
    employeeStatus: JobHistoryEntry[];
    salary: JobHistoryEntry[];
}

export interface Employee {
    id: string;
    empCode: string;
    name: string;
    badgeLabel: string;
    email: string;
    phone: string;
    gender: GenderType;
    designation: string;
    department: string;
    employeeStatus: string;
    joiningDate: string;
    salary: number;
    assignedShops: string[];
    role: string;
    workShift: string;
    status: AccountStatus;

    // Live Banner Punch State
    todayCheckIn: string;
    todayCheckOut: string;
    todayDuration: string;

    // Tab 1: Personal Info
    dateOfBirth: string;
    placeOfBirth: string;
    maritalStatus: MaritalStatusType;
    religion: string;
    bloodType: string;
    nidNo: string;
    tinNo: string;

    // Tab 2: Contact Info
    personContact: PersonContact;
    emergencyContact: EmergencyContact;

    // Tab 3: Address Info
    residentialAddress: AddressDetail;
    permanentAddress: AddressDetail;
    sameAsResidential: boolean;

    // Tab 5 & 6: Attendance Logs
    attendanceLogs: AttendanceLog[];

    // Tab 7: Leave Allowances
    leaveAllowances: LeaveAllowanceItem[];

    // Tab 8: Leave Requests
    leaveRequests: EmployeeLeaveRequest[];

    // Tab 9: Payroll
    payrollRecords: EmployeePayrollRecord[];

    // Tab 10: Job History Timelines
    jobHistory: EmployeeJobHistoryMap;

    // Tab 11: Documents
    documents: EmployeeDocument[];
}

export interface CreateEmployeePayload {
    name: string;
    email: string;
    phone: string;
    gender: GenderType;
    designation: string;
    department: string;
    employeeStatus: string;
    joiningDate: string;
    salary: number;
    assignedShops: string[];
    role: string;
    workShift?: string;
    status?: AccountStatus;
}

export interface EmployeeStoreState {
    employees: Employee[];
    designations: string[];
    departments: string[];
    employeeStatuses: string[];
    shops: string[];
    roles: string[];

    // Master Directory Actions
    addEmployee: (payload: CreateEmployeePayload) => void;
    updateEmployeeCore: (id: string, payload: Partial<CreateEmployeePayload> & { status?: AccountStatus }) => void;
    deleteEmployee: (id: string) => void;
    bulkDeleteEmployees: (ids: string[]) => void;
    toggleAccountStatus: (id: string) => void;

    // Detail Tab Atomic Actions
    updatePersonalInfo: (
        id: string,
        data: Pick<
            Employee,
            | "name"
            | "email"
            | "phone"
            | "dateOfBirth"
            | "placeOfBirth"
            | "gender"
            | "maritalStatus"
            | "religion"
            | "bloodType"
            | "nidNo"
            | "tinNo"
        >
    ) => void;
    updateContactInfo: (id: string, personContact: PersonContact, emergencyContact: EmergencyContact) => void;
    updateAddressInfo: (
        id: string,
        residentialAddress: AddressDetail,
        permanentAddress: AddressDetail,
        sameAsResidential: boolean
    ) => void;
    updateEmploymentOverview: (
        id: string,
        data: Pick<Employee, "role" | "workShift" | "assignedShops" | "joiningDate">
    ) => void;
    appendJobHistoryRecord: (
        id: string,
        category: JobHistoryCategory,
        newValue: string,
        effectiveDate: string,
        remarks?: string
    ) => void;
    updateLeaveAllowances: (id: string, allowances: LeaveAllowanceItem[]) => void;
    addLeaveRequest: (id: string, req: Omit<EmployeeLeaveRequest, "id">) => void;
    updateLeaveRequestStatus: (id: string, requestId: string, status: LeaveStatus) => void;
    generatePayslip: (id: string, period: string, year: string, allowances: number, deductions: number) => void;
    updatePayslipStatus: (id: string, payrollId: string, status: PayrollStatus) => void;
    addDocument: (id: string, docName: string, fileName: string, fileSize: string) => void;
    deleteDocument: (id: string, docId: string) => void;
    toggleLiveCheckOut: (id: string) => void;
}