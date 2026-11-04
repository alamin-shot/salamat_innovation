"use client";
import { usePayrunManager } from "@/hooks/payroll_hooks/usePayrunManager";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Play, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";

export function PayrunClient() {
    const manager = usePayrunManager();

    if (manager.view === "wizard") {
        return (
            <div className="flex flex-col w-full h-full gap-2 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Run Payroll</h1>
                    <Button variant="outline" onClick={() => manager.setView("list")}>Cancel</Button>
                </div>

                <div className="erp-card bg-white p-6 flex-1 flex flex-col shadow-sm border border-gray-100">
                    {/* Stepper Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                        {[1, 2, 3, 4].map(step => (
                            <div key={step} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${manager.wizardStep >= step ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                                    {manager.wizardStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider ${manager.wizardStep >= step ? "text-gray-900" : "text-gray-400"}`}>
                                    {step === 1 ? "Audience" : step === 2 ? "Period" : step === 3 ? "Notes" : "Review"}
                                </span>
                                {step < 4 && <ChevronRight className="w-4 h-4 text-gray-300 mx-4" />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Audience */}
                    {manager.wizardStep === 1 && (
                        <div className="max-w-xl flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Target Departments</label>
                                <CustomSelect value="All Departments" options={["All Departments", "Sales", "Engineering"]} onChange={() => { }} />
                            </div>
                            <Button variant="default" onClick={() => manager.setWizardStep(2)} className="w-fit">Next: Period & Rules</Button>
                        </div>
                    )}

                    {/* Step 2: Period */}
                    {manager.wizardStep === 2 && (
                        <div className="max-w-xl flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Month</label>
                                    <CustomSelect value={manager.targetMonth} options={["October", "November", "December"]} onChange={manager.setTargetMonth} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="erp-label">Year</label>
                                    <CustomSelect value={manager.targetYear} options={["2026", "2027"]} onChange={manager.setTargetYear} />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={manager.includeOvertime} onChange={e => manager.setIncludeOvertime(e.target.checked)} className="rounded text-brand-primary" />
                                Synchronize Overtime from Attendance Matrix
                            </label>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => manager.setWizardStep(1)}>Back</Button>
                                <Button variant="default" onClick={() => manager.setWizardStep(3)}>Next: Notes</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Notes */}
                    {manager.wizardStep === 3 && (
                        <div className="max-w-xl flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Internal Payrun Note</label>
                                <textarea className="erp-input min-h-[100px]" value={manager.payrunNote} onChange={e => manager.setPayrunNote(e.target.value)} />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => manager.setWizardStep(2)}>Back</Button>
                                <Button variant="default" onClick={manager.generateDrafts} className="bg-emerald-600 hover:bg-emerald-700">Generate Calculations</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: High-Density Data Grid */}
                    {manager.wizardStep === 4 && (
                        <div className="flex flex-col flex-1 gap-4">
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                <strong>Review Draft:</strong> Ensure all deductions (including LOP) and allowances are correct before finalizing.
                            </div>
                            <Table containerClassName="flex-1 min-h-[300px]">
                                <TableHeader>
                                    <TableHeadCell>Employee</TableHeadCell>
                                    <TableHeadCell className="text-right">Basic Salary</TableHeadCell>
                                    <TableHeadCell className="text-right text-emerald-700">Allowances</TableHeadCell>
                                    <TableHeadCell className="text-right text-rose-700">Deductions</TableHeadCell>
                                    <TableHeadCell className="text-right">Net Payable</TableHeadCell>
                                </TableHeader>
                                <TableBody>
                                    {manager.draftPayslips.map(ps => {
                                        const totalAllow = ps.allowances.reduce((sum, a) => sum + a.amount, 0);
                                        const totalDed = ps.deductions.reduce((sum, d) => sum + d.amount, 0);
                                        return (
                                            <TableRow key={ps.id}>
                                                <TableCell className="font-bold text-xs">{ps.employeeName}</TableCell>
                                                <TableCell className="text-right font-mono text-xs">৳ {ps.basicSalary.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono text-xs text-emerald-600">+ ৳ {totalAllow.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono text-xs text-rose-600">- ৳ {totalDed.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-mono text-xs font-bold bg-gray-50">৳ {ps.netSalary.toLocaleString()}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <Button variant="outline" onClick={() => manager.setWizardStep(3)}>Back</Button>
                                <Button variant="default" onClick={manager.finalizePayrun}>Finalize & Generate Payslips</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full gap-2 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Payruns</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Automated payroll execution engine.</p>
                </div>
                <Button variant="default" onClick={() => manager.setView("wizard")} className="flex items-center gap-1.5 h-9">
                    <Play className="w-4 h-4" /> Run Payroll
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {manager.payruns.map(pr => (
                    <div key={pr.id} className="erp-card bg-white p-5 border border-gray-100 rounded-xl shadow-sm flex flex-col gap-4">
                        <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{pr.title}</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Generated: {pr.generatedOn}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            <FileText className="w-4 h-4 text-brand-primary" /> {pr.totalPayslips} Payslips Generated
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}