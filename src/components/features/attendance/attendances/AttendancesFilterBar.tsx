"use client";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";

export function AttendancesFilterBar({ manager }: { manager: ReturnType<typeof useAttendancesManager> }) {
    if (!manager.isFilterOpen) return null;

    return (
        <div className="erp-card bg-white p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 border border-gray-100 shadow-sm">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Department</label>
                <CustomSelect
                    value={manager.departmentFilter}
                    options={["All Departments", "Marketing", "Sales", "HR & Administration", "Procurement"]}
                    onChange={manager.setDepartmentFilter}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Behavior</label>
                <CustomSelect
                    value={manager.behaviorFilter}
                    options={["All Behaviors", "Regular", "Late", "Early", "Absent"]}
                    onChange={manager.setBehaviorFilter}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">Work Shift</label>
                <CustomSelect
                    value={manager.shiftFilter}
                    options={["All Shifts", "Showroom", "Head Office"]}
                    onChange={manager.setShiftFilter}
                />
            </div>
            <div className="flex items-end">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-[38px]"
                    onClick={() => {
                        manager.setDepartmentFilter("All Departments");
                        manager.setBehaviorFilter("All Behaviors");
                        manager.setShiftFilter("All Shifts");
                    }}
                >
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}