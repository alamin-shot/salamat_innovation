"use client";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { useAttendanceReportManager } from "@/hooks/attendance_hooks/useAttendanceReportManager";

export function ReportPayrollTable({ manager }: { manager: ReturnType<typeof useAttendanceReportManager> }) {
    return (
        <Table containerClassName="flex-1 min-h-[380px]">
            <TableHeader>
                <TableHeadCell className="sticky left-0 bg-gray-50 z-10">Employee</TableHeadCell>
                <TableHeadCell>Shift</TableHeadCell>
                <TableHeadCell className="text-center">Target Days</TableHeadCell>
                <TableHeadCell className="text-center">Present (P)</TableHeadCell>
                <TableHeadCell className="text-center">Paid Leave (L)</TableHeadCell>
                <TableHeadCell className="text-center">Holidays (H)</TableHeadCell>
                <TableHeadCell className="text-center">Weekly Off (—)</TableHeadCell>
                <TableHeadCell className="text-center">Late (Penalty)</TableHeadCell>
                <TableHeadCell className="text-center">Absent / LOP</TableHeadCell>
                <TableHeadCell className="text-center">Worked Hours</TableHeadCell>
                <TableHeadCell className="text-center">Overtime (OT)</TableHeadCell>
                <TableHeadCell className="text-right">Net Payable Days</TableHeadCell>
            </TableHeader>
            <TableBody>
                {manager.reportRows.map((r) => (
                    <TableRow key={r.employeeId} className="hover:bg-gray-50/80">
                        <TableCell className="sticky left-0 bg-white z-10">
                            <div className="font-semibold text-gray-900 text-xs">{r.employeeName}</div>
                            <div className="text-[10px] text-gray-400">{r.empCode} • {r.department}</div>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-gray-700">{r.shiftName}</TableCell>
                        <TableCell className="text-center text-xs text-gray-600 font-mono">{r.workingDaysTarget}/{r.totalCalendarDays}</TableCell>
                        <TableCell className="text-center font-bold text-emerald-600">{r.presentCount}</TableCell>
                        <TableCell className="text-center font-bold text-cyan-600">{r.leaveCount}</TableCell>
                        <TableCell className="text-center font-bold text-amber-600">{r.holidayCount}</TableCell>
                        <TableCell className="text-center font-semibold text-gray-600">{r.weeklyOffCount}</TableCell>
                        <TableCell className="text-center">
                            <span className="font-bold text-orange-600">{r.lateCount}</span>
                            {r.latePenaltyDays > 0 && <span className="ml-1 text-[10px] text-rose-600 font-semibold">(-{r.latePenaltyDays}d LOP)</span>}
                        </TableCell>
                        <TableCell className="text-center font-bold text-rose-600">{r.lopDays}</TableCell>
                        <TableCell className="text-center font-mono text-xs text-gray-700">{r.totalWorkedHours}</TableCell>
                        <TableCell className="text-center font-mono text-xs text-indigo-600 font-semibold">{r.overtimeHours}</TableCell>
                        <TableCell className="text-right">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {r.payableDays} / {r.totalCalendarDays} Days
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}