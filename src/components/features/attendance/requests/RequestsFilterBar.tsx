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
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <input
                type="text"
                placeholder="Search..."
                className="erp-input max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusTab(tab)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition ${statusTab === tab
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