import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    Employee,
    EmployeeStoreState,
    JobHistoryEntry,
    EmployeeLeaveRequest,
    EmployeePayrollRecord
} from "@/types/employee.types";
import {
    MOCK_EMPLOYEES,
    INITIAL_DESIGNATIONS,
    INITIAL_DEPARTMENTS,
    INITIAL_EMPLOYEE_STATUSES,
    INITIAL_SHOPS,
    INITIAL_ROLES,
    EMPTY_ADDRESS,
    createDefaultLeaveAllowances,
    createInitialJobHistory
} from "@/mocks/employee.mock";

export const useEmployeeStore = create<EmployeeStoreState>()(
    persist(
        (set) => ({
            employees: MOCK_EMPLOYEES,
            designations: INITIAL_DESIGNATIONS,
            departments: INITIAL_DEPARTMENTS,
            employeeStatuses: INITIAL_EMPLOYEE_STATUSES,
            shops: INITIAL_SHOPS,
            roles: INITIAL_ROLES,

            addEmployee: (payload) =>
                set((state) => {
                    const nextNum = 3386 + state.employees.length;
                    const id = String(nextNum);
                    const formattedDate = payload.joiningDate || new Date().toISOString().slice(0, 10);
                    const newEmp: Employee = {
                        id,
                        empCode: `EMP-${nextNum}`,
                        name: payload.name,
                        badgeLabel: payload.role || payload.designation,
                        email: payload.email,
                        phone: payload.phone,
                        gender: payload.gender,
                        designation: payload.designation,
                        department: payload.department,
                        employeeStatus: payload.employeeStatus,
                        joiningDate: formattedDate,
                        salary: Number(payload.salary) || 0,
                        assignedShops: payload.assignedShops.length ? payload.assignedShops : ["A-Block"],
                        role: payload.role,
                        workShift: payload.workShift || "Showroom",
                        status: payload.status || "Active",
                        todayCheckIn: "09:58 AM",
                        todayCheckOut: "—",
                        todayDuration: "0:00:00",
                        dateOfBirth: "",
                        placeOfBirth: "",
                        maritalStatus: "Single",
                        religion: "Islam",
                        bloodType: "O+",
                        nidNo: "",
                        tinNo: "",
                        personContact: { fullName: payload.name, emailAddress: payload.email },
                        emergencyContact: { fullName: "", relation: "", phoneNumber: "", emailAddress: "" },
                        residentialAddress: { ...EMPTY_ADDRESS },
                        permanentAddress: { ...EMPTY_ADDRESS },
                        sameAsResidential: false,
                        attendanceLogs: [],
                        leaveAllowances: createDefaultLeaveAllowances(),
                        leaveRequests: [],
                        payrollRecords: [],
                        jobHistory: createInitialJobHistory(
                            payload.department,
                            payload.designation,
                            payload.employeeStatus,
                            Number(payload.salary) || 0,
                            formattedDate
                        ),
                        documents: []
                    };
                    return { employees: [newEmp, ...state.employees] };
                }),

            updateEmployeeCore: (id, payload) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                ...payload,
                                badgeLabel: payload.role || payload.designation || emp.badgeLabel
                            }
                            : emp
                    )
                })),

            deleteEmployee: (id) =>
                set((state) => ({
                    employees: state.employees.filter((emp) => emp.id !== id)
                })),

            bulkDeleteEmployees: (ids) =>
                set((state) => ({
                    employees: state.employees.filter((emp) => !ids.includes(emp.id))
                })),

            toggleAccountStatus: (id) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" } : emp
                    )
                })),

            updatePersonalInfo: (id, data) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                ...data,
                                personContact: {
                                    ...emp.personContact,
                                    fullName: data.name,
                                    emailAddress: data.email
                                }
                            }
                            : emp
                    )
                })),

            updateContactInfo: (id, personContact, emergencyContact) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id ? { ...emp, personContact, emergencyContact } : emp
                    )
                })),

            updateAddressInfo: (id, residentialAddress, permanentAddress, sameAsResidential) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                residentialAddress,
                                permanentAddress: sameAsResidential ? { ...residentialAddress } : permanentAddress,
                                sameAsResidential
                            }
                            : emp
                    )
                })),

            updateEmploymentOverview: (id, data) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                ...data,
                                badgeLabel: data.role || emp.badgeLabel
                            }
                            : emp
                    )
                })),

            appendJobHistoryRecord: (id, category, newValue, effectiveDate, remarks) =>
                set((state) => ({
                    employees: state.employees.map((emp) => {
                        if (emp.id !== id) return emp;

                        const closedTimeline = emp.jobHistory[category].map((entry) =>
                            entry.endDate === null ? { ...entry, endDate: effectiveDate } : entry
                        );

                        const formattedValue =
                            category === "salary" && !newValue.startsWith("$")
                                ? `$ ${Number(newValue).toLocaleString()}.00`
                                : newValue;

                        const nextTimeline: JobHistoryEntry[] = [
                            {
                                id: `jh-${Date.now()}`,
                                value: formattedValue,
                                startDate: effectiveDate,
                                endDate: null,
                                remarks
                            },
                            ...closedTimeline
                        ];

                        const updatedEmp: Employee = {
                            ...emp,
                            jobHistory: {
                                ...emp.jobHistory,
                                [category]: nextTimeline
                            }
                        };

                        if (category === "department") updatedEmp.department = newValue;
                        if (category === "designation") updatedEmp.designation = newValue;
                        if (category === "employeeStatus") updatedEmp.employeeStatus = newValue;
                        if (category === "salary") {
                            const numeric = Number(String(newValue).replace(/[^0-9.]/g, ""));
                            if (!isNaN(numeric)) updatedEmp.salary = numeric;
                        }

                        return updatedEmp;
                    })
                })),

            updateLeaveAllowances: (id, allowances) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id ? { ...emp, leaveAllowances: allowances } : emp
                    )
                })),

            addLeaveRequest: (id, req) =>
                set((state) => ({
                    employees: state.employees.map((emp) => {
                        if (emp.id !== id) return emp;
                        const newReq: EmployeeLeaveRequest = { ...req, id: `lr-${Date.now()}` };
                        const allowances =
                            req.status === "Approved"
                                ? emp.leaveAllowances.map((a) =>
                                    a.leaveType === req.leaveType
                                        ? { ...a, usedDays: a.usedDays + req.daysCount }
                                        : a
                                )
                                : emp.leaveAllowances;
                        return {
                            ...emp,
                            leaveRequests: [newReq, ...emp.leaveRequests],
                            leaveAllowances: allowances
                        };
                    })
                })),

            updateLeaveRequestStatus: (id, requestId, status) =>
                set((state) => ({
                    employees: state.employees.map((emp) => {
                        if (emp.id !== id) return emp;
                        const target = emp.leaveRequests.find((r) => r.id === requestId);
                        if (!target || target.status === status) return emp;

                        let allowances = [...emp.leaveAllowances];
                        if (target.status !== "Approved" && status === "Approved") {
                            allowances = allowances.map((a) =>
                                a.leaveType === target.leaveType
                                    ? { ...a, usedDays: a.usedDays + target.daysCount }
                                    : a
                            );
                        } else if (target.status === "Approved" && status !== "Approved") {
                            allowances = allowances.map((a) =>
                                a.leaveType === target.leaveType
                                    ? { ...a, usedDays: Math.max(0, a.usedDays - target.daysCount) }
                                    : a
                            );
                        }

                        return {
                            ...emp,
                            leaveAllowances: allowances,
                            leaveRequests: emp.leaveRequests.map((r) =>
                                r.id === requestId ? { ...r, status } : r
                            )
                        };
                    })
                })),

            generatePayslip: (id, period, year, allowances, deductions) =>
                set((state) => ({
                    employees: state.employees.map((emp) => {
                        if (emp.id !== id) return emp;
                        const netSalary = emp.salary + allowances - deductions;
                        const newSlip: EmployeePayrollRecord = {
                            id: `pay-${Date.now()}`,
                            payrun: `PR-${year}-${String(emp.payrollRecords.length + 1).padStart(2, "0")}`,
                            period,
                            year,
                            considerType: "Monthly Attendance",
                            payrunType: "Regular Monthly",
                            basicSalary: emp.salary,
                            allowances,
                            deductions,
                            netSalary,
                            status: "Generated",
                            generatedAt: new Date().toISOString().slice(0, 10)
                        };
                        return {
                            ...emp,
                            payrollRecords: [newSlip, ...emp.payrollRecords]
                        };
                    })
                })),

            updatePayslipStatus: (id, payrollId, status) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                payrollRecords: emp.payrollRecords.map((p) =>
                                    p.id === payrollId ? { ...p, status } : p
                                )
                            }
                            : emp
                    )
                })),

            addDocument: (id, docName, fileName, fileSize) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? {
                                ...emp,
                                documents: [
                                    {
                                        id: `doc-${Date.now()}`,
                                        documentName: docName,
                                        fileName,
                                        fileSize,
                                        uploadedAt: new Date().toISOString().slice(0, 10)
                                    },
                                    ...emp.documents
                                ]
                            }
                            : emp
                    )
                })),

            deleteDocument: (id, docId) =>
                set((state) => ({
                    employees: state.employees.map((emp) =>
                        emp.id === id
                            ? { ...emp, documents: emp.documents.filter((d) => d.id !== docId) }
                            : emp
                    )
                })),

            toggleLiveCheckOut: (id) =>
                set((state) => ({
                    employees: state.employees.map((emp) => {
                        if (emp.id !== id) return emp;
                        const isCheckedOut = emp.todayCheckOut !== "—";
                        return {
                            ...emp,
                            todayCheckOut: isCheckedOut ? "—" : "06:15 PM",
                            todayDuration: isCheckedOut ? "0:00:00" : "08:12:00"
                        };
                    })
                }))
        }),
        { name: "erp-employee-storage-v3" }
    )
);