"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Filter, Columns, Plus } from "lucide-react";
import { useAttendancesManager } from "@/hooks/attendance_hooks/useAttendancesManager";

export function AttendancesHeader({ manager }: { manager: ReturnType<typeof useAttendancesManager> }) {
    const [showColMenu, setShowColMenu] = useState(false);

    return (
        <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">Attendances</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                    Master biometric & IP attendance ledger across all outlets and shifts.
                </p>
            </div>
            <div className="flex items-center gap-2.5">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => manager.setIsFilterOpen(!manager.isFilterOpen)}
                    className="h-9 flex items-center gap-1.5 bg-white"
                >
                    <Filter className="w-3.5 h-3.5" /> Filter
                </Button>

                <div className="relative">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowColMenu(!showColMenu)}
                        className="h-9 flex items-center gap-1.5 bg-white"
                    >
                        <Columns className="w-3.5 h-3.5" /> Columns
                    </Button>
                    {showColMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-40 flex flex-col gap-2 text-xs">
                            <div className="font-bold text-gray-700 border-b pb-1.5">Toggle Columns</div>
                            {Object.entries(manager.visibleColumns).map(([key, isVis]) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer capitalize text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={isVis}
                                        onChange={() => manager.toggleColumn(key)}
                                        className="rounded text-brand-primary"
                                    />
                                    {key.replace(/([A-Z])/g, " $1")}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <Button variant="default" onClick={manager.openAddDrawer} className="h-9 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Attendance
                </Button>
            </div>
        </div>
    );
}