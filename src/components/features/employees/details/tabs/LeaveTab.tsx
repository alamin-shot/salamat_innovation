"use client";
import { useState } from "react";
import { EmployeeDetailManagerType } from "@/hooks/employee_hooks/useEmployeeDetailManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Plus, CheckCircle2, Clock, XCircle } from "lucide-react";

export function LeaveTab({ manager }: { manager: EmployeeDetailManagerType }) {
    const { leaveRequests } = manager.employee;
    const pending = leaveRequests.filter(r => r.status === "Pending").length;
    const approved = leaveRequests.filter(r => r.status === "Approved").length;
    const rejected = leaveRequests.filter(r => r.status === "Rejected").length;

    // Fast inline recording simulation for HR
    const [isQuickAdding, setIsQuickAdding] = useState(false);
    const [newType, setNewType] = useState("Casual Leave");
    const [newDays, setNewDays] = useState(1);

    const handleQuickAdd = () => {
        manager.createLeaveRequest({
            date: new Date().toISOString().slice(0, 10),
            leaveDuration: `${newDays} Day${newDays > 1 ? 's' : ''}`,
            daysCount: newDays,
            leaveType: newType,
            note: "Recorded by HR",
            attachment: null,
            status: "Approved"
        });
        setIsQuickAdding(false);
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="erp-card bg-white p-6 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Leave</h2>
                        <p className="text-xs text-gray-500 mt-1">Leave requests and status overview</p>
                    </div>
                    {!isQuickAdding && (
                        <Button variant="default" size="sm" onClick={() => setIsQuickAdding(true)} className="h-8">
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Record Leave
                        </Button>
                    )}
                </div>

                {isQuickAdding && (
                    <div className="mb-6 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-lg flex items-end gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <label className="erp-label">Leave Type</label>
                            <CustomSelect value={newType} options={["Casual Leave", "Sick Leave", "Annual Leave", "Unpaid Leave"]} onChange={setNewType} />
                        </div>
                        <div className="flex flex-col gap-1.5 w-32">
                            <label className="erp-label">Days</label>
                            <input type="number" className="erp-input py-1.5" min={1} value={newDays} onChange={e => setNewDays(Number(e.target.value))} />
                        </div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Button variant="outline" onClick={() => setIsQuickAdding(false)}>Cancel</Button>
                            <Button variant="default" onClick={handleQuickAdd}>Approve & Save</Button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border border-amber-200 rounded-lg p-4 bg-white shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100"><Clock className="w-5 h-5" /></div>
                        <div className="flex flex-col"><span className="text-2xl font-bold text-gray-900">{pending}</span><span className="text-xs font-bold text-gray-500 uppercase">Pending requests</span></div>
                    </div>
                    <div className="border border-emerald-200 rounded-lg p-4 bg-white shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100"><CheckCircle2 className="w-5 h-5" /></div>
                        <div className="flex flex-col"><span className="text-2xl font-bold text-gray-900">{approved}</span><span className="text-xs font-bold text-gray-500 uppercase">Approved leave</span></div>
                    </div>
                    <div className="border border-rose-200 rounded-lg p-4 bg-white shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100"><XCircle className="w-5 h-5" /></div>
                        <div className="flex flex-col"><span className="text-2xl font-bold text-gray-900">{rejected}</span><span className="text-xs font-bold text-gray-500 uppercase">Rejected leave</span></div>
                    </div>
                </div>

                <div className="border border-gray-100 rounded-lg overflow-hidden min-h-[250px] pb-24">
                    <Table>
                        <TableHeader>
                            <TableHeadCell>Date</TableHeadCell>
                            <TableHeadCell>Duration</TableHeadCell>
                            <TableHeadCell>Leave Type</TableHeadCell>
                            <TableHeadCell>Note</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                        </TableHeader>
                        <TableBody>
                            {leaveRequests.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-400">No leave requests found.</TableCell></TableRow>
                            ) : (
                                leaveRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.date}</TableCell>
                                        <TableCell className="text-gray-600">{req.leaveDuration}</TableCell>
                                        <TableCell className="font-medium text-gray-800">{req.leaveType}</TableCell>
                                        <TableCell className="text-gray-500 text-xs truncate max-w-[200px]">{req.note}</TableCell>
                                        <TableCell>
                                            <div className="w-32">
                                                <CustomSelect
                                                    value={req.status}
                                                    options={["Pending", "Approved", "Rejected"]}
                                                    onChange={(val) => manager.changeLeaveStatus(req.id, val as any)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}