"use client";
import { WorkShiftTemplate } from "@/types/attendance.types";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CustomSelect } from "@/components/ui/CustomSelect";

const SHORT_TO_FULL_DAY: Record<string, string> = {
    Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
    Thu: "Thursday", Fri: "Friday", Sat: "Saturday"
};

interface WeeklyRosterTableProps {
    employees: any[];
    workShifts: WorkShiftTemplate[];
    employeeShiftMap: Record<string, string>;
    onAssignShift: (empId: string, shiftName: string, empName: string) => void;
}

export function WeeklyRosterTable({ employees, workShifts, employeeShiftMap, onAssignShift }: WeeklyRosterTableProps) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell>Employee</TableHeadCell>
                <TableHeadCell className="w-48">Assigned Work Shift</TableHeadCell>
                <TableHeadCell className="text-center">Sun</TableHeadCell>
                <TableHeadCell className="text-center">Mon</TableHeadCell>
                <TableHeadCell className="text-center">Tue</TableHeadCell>
                <TableHeadCell className="text-center">Wed</TableHeadCell>
                <TableHeadCell className="text-center">Thu</TableHeadCell>
                <TableHeadCell className="text-center">Fri</TableHeadCell>
                <TableHeadCell className="text-center">Sat</TableHeadCell>
            </TableHeader>
            <TableBody>
                {employees.map((emp) => {
                    const assignedShiftName = employeeShiftMap[emp.id] || "Showroom";
                    const shiftObj = workShifts.find((s) => s.name === assignedShiftName) || workShifts[0];
                    const shiftOffDays = shiftObj?.weekends || ["Wednesday"];

                    return (
                        <TableRow key={emp.id} className="hover:bg-gray-50/70">
                            <TableCell>
                                <div className="font-semibold text-gray-900 text-xs">{emp.name}</div>
                                <div className="text-[10px] text-gray-400">{emp.empCode} • {emp.outlet}</div>
                            </TableCell>
                            <TableCell>
                                <CustomSelect
                                    value={assignedShiftName}
                                    options={workShifts.map((s) => s.name)}
                                    onChange={(newShift) => onAssignShift(emp.id, newShift, emp.name)}
                                />
                            </TableCell>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((shortDay) => {
                                const isOff = shiftOffDays.includes(SHORT_TO_FULL_DAY[shortDay]);
                                return (
                                    <TableCell key={shortDay} className="text-center">
                                        {isOff ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                                OFF
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {shiftObj?.startTime.replace(":00 ", "")}–{shiftObj?.endTime.replace(":00 ", "")}
                                            </span>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}