"use client";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { EmployeePayrollRecord } from "@/types/employee.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { PayslipPrintTemplate } from "../drawers/PayslipPrintTemplate";
import { Printer, Eye, Plus } from "lucide-react";

export function PayrollTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const { payrollRecords } = manager.employee;
    const [filter, setFilter] = useState("All");
    const [year, setYear] = useState("2026");
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter logic
    const filteredRecords = payrollRecords.filter(p => {
        const matchesStatus = filter === "All" || p.status === filter;
        const matchesYear = p.year === year;
        return matchesStatus && matchesYear;
    });

    // Printing Setup
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Payslip_${manager.employee.empCode}`,
        pageStyle: "@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; } * { border-color: #e5e7eb !important; } }"
    });

    const triggerPrint = (record: EmployeePayrollRecord) => {
        manager.setPrintablePayslip(record);
        // Add a micro-delay to allow state to render into the hidden div
        setTimeout(() => handlePrint(), 100);
    };

    const handleGenerate = () => {
        manager.createPayslip("November 2026", "2026", 2000, 500);
        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="erp-card bg-white p-6 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Payroll</h2>
                        <p className="text-xs text-gray-500 mt-1">Payslip history and earnings overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-md p-1 bg-gray-50">
                            {["All", "Generated", "Sent"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 text-xs font-semibold rounded ${filter === f ? "bg-white shadow-sm text-gray-900 border border-gray-200" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="w-24">
                            <CustomSelect value={year} options={["2025", "2026", "2027"]} onChange={setYear} />
                        </div>
                        {!isGenerating && (
                            <Button variant="default" size="sm" onClick={() => setIsGenerating(true)} className="h-[34px]">
                                <Plus className="w-3.5 h-3.5 mr-1" /> Generate
                            </Button>
                        )}
                    </div>
                </div>

                {isGenerating && (
                    <div className="mb-6 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand-primary">Generate Payslip for November 2026?</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsGenerating(false)}>Cancel</Button>
                            <Button variant="default" size="sm" onClick={handleGenerate}>Confirm Generation</Button>
                        </div>
                    </div>
                )}

                <div className="border border-gray-100 rounded-lg overflow-hidden min-h-[350px] pb-32">
                    <Table>
                        <TableHeader>
                            <TableHeadCell>Payrun</TableHeadCell>
                            <TableHeadCell>Period</TableHeadCell>
                            <TableHeadCell>Consider Type</TableHeadCell>
                            <TableHeadCell>Payrun Type</TableHeadCell>
                            <TableHeadCell className="text-right">Salary</TableHeadCell>
                            <TableHeadCell className="text-right">Net Salary</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell className="text-right">Action</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">Nothing to show here</TableCell></TableRow>
                            ) : (
                                filteredRecords.map(record => (
                                    <TableRow key={record.id} className="group">
                                        <TableCell className="font-bold text-gray-900">{record.payrun}</TableCell>
                                        <TableCell>{record.period}</TableCell>
                                        <TableCell className="text-gray-600">{record.considerType}</TableCell>
                                        <TableCell className="text-gray-600">{record.payrunType}</TableCell>
                                        <TableCell className="text-right font-medium text-gray-700">$ {record.basicSalary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-bold text-emerald-600">$ {record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="w-28">
                                                <CustomSelect
                                                    value={record.status}
                                                    options={["Generated", "Sent", "Paid"]}
                                                    onChange={(val) => manager.changePayslipStatus(record.id, val as any)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon-sm" onClick={() => triggerPrint(record)} title="Print / PDF">
                                                    <Printer className="w-4 h-4 text-gray-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Hidden Printable Layer */}
            {manager.printablePayslip && (
                <PayslipPrintTemplate ref={printRef} employee={manager.employee} payroll={manager.printablePayslip} />
            )}
        </div>
    );
}