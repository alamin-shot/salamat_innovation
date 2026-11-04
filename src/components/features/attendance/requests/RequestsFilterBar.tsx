"use client";
import { AttendanceRecordStatus } from "@/types/attendance.types";

interface RequestsFilterBarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    statusTab: "All" | AttendanceRecordStatus;
    setStatusTab: (tab: "All" | AttendanceRecordStatus) => void;
}

export function RequestsFilterBar({
    searchQuery,
    setSearchQuery,
    statusTab,
    setStatusTab
}: RequestsFilterBarProps) {
    return (
        // RESPONSIVE FIX: flex-col on mobile, flex-row on desktop
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* RESPONSIVE FIX: w-full on mobile */}
            <input
                type="text"
                placeholder="Search..."
                className="erp-input w-full sm:max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* RESPONSIVE FIX: wrap tabs on tiny screens, w-full */}
            <div className="inline-flex flex-wrap rounded-lg border border-gray-200 p-0.5 bg-gray-50 w-full sm:w-auto">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusTab(tab)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex-1 sm:flex-none text-center transition ${statusTab === tab
                            ? "bg-white text-brand-primary shadow-2xs"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}