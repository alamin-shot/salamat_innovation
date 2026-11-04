"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { LeaveRequestStatus, LeaveTypeItem } from "@/types/leaves.types";

interface LeaveRequestFilterBarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    statusFilter: "All" | LeaveRequestStatus;
    setStatusFilter: (val: "All" | LeaveRequestStatus) => void;
    typeFilter: string;
    setTypeFilter: (val: string) => void;
    leaveTypes: LeaveTypeItem[];
}

export function LeaveRequestFilterBar({
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, typeFilter, setTypeFilter, leaveTypes
}: LeaveRequestFilterBarProps) {
    const typeOptions = ["All Types", ...leaveTypes.map(lt => lt.name)];

    return (
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
                <input
                    type="text"
                    placeholder="Search employee..."
                    className="erp-input max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="w-48">
                    <CustomSelect value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
                </div>
            </div>

            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition ${statusFilter === tab ? "bg-white text-brand-primary shadow-2xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}