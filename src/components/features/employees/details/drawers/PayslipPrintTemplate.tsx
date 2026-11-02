"use client";
import * as React from "react";
import { Employee, EmployeePayrollRecord } from "@/types/employee.types";

interface PayslipPrintTemplateProps {
    employee: Employee;
    payroll: EmployeePayrollRecord;
}

export const PayslipPrintTemplate = React.forwardRef<HTMLDivElement, PayslipPrintTemplateProps>(
    ({ employee, payroll }, ref) => {
        return (
            <div className="hidden">
                <div
                    ref={ref}
                    className="w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] mx-auto box-border"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900">Payslip</h1>
                            <p className="text-sm text-gray-600 mt-1 font-medium">{payroll.period}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-900">Salamat Innovation</h2>
                            <p className="text-xs text-gray-600">Jamuna Future Park, Dhaka, Bangladesh</p>
                            <p className="text-xs text-gray-600">contact@salamatinnovation.com</p>
                        </div>
                    </div>

                    {/* Employee Info */}
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Employee Name:</span>
                                <span className="font-bold">{employee.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Employee ID:</span>
                                <span>{employee.empCode}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Designation:</span>
                                <span>{employee.designation}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Department:</span>
                                <span>{employee.department}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Payrun ID:</span>
                                <span>{payroll.payrun}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Consider Type:</span>
                                <span>{payroll.considerType}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="font-semibold text-gray-600">Generated On:</span>
                                <span>{payroll.generatedAt}</span>
                            </div>
                        </div>
                    </div>

                    {/* Earnings & Deductions */}
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        {/* Earnings */}
                        <div>
                            <h3 className="text-lg font-bold border-b border-gray-800 pb-2 mb-4 uppercase">Earnings</h3>
                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Basic Salary</span>
                                    <span>$ {payroll.basicSalary.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Allowances</span>
                                    <span>$ {payroll.allowances.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        {/* Deductions */}
                        <div>
                            <h3 className="text-lg font-bold border-b border-gray-800 pb-2 mb-4 uppercase">Deductions</h3>
                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Tax / Deductions</span>
                                    <span className="text-red-600">- $ {payroll.deductions.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-gray-800 pt-4 flex flex-col items-end">
                        <div className="w-1/2 flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-semibold text-gray-600">
                                <span>Total Earnings:</span>
                                <span>$ {(payroll.basicSalary + payroll.allowances).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-gray-600">
                                <span>Total Deductions:</span>
                                <span>$ {payroll.deductions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold bg-gray-100 p-3 mt-2">
                                <span>Net Salary:</span>
                                <span>$ {payroll.netSalary.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-32 pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center">
                        <div>
                            <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Employer Signature</span>
                        </div>
                        <div>
                            <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Employee Signature</span>
                        </div>
                    </div>
                    <div className="text-center text-[10px] text-gray-400 mt-12">
                        This is a computer-generated document. No signature is strictly required for digital issuance.
                    </div>
                </div>
            </div>
        );
    }
);

PayslipPrintTemplate.displayName = "PayslipPrintTemplate";