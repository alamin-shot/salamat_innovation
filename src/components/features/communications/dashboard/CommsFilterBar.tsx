"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";

export function CommsFilterBar({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    return (
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search titles..."
                    className="erp-input w-full sm:w-72 bg-white"
                    value={manager.searchQuery}
                    onChange={(e) => manager.setSearchQuery(e.target.value)}
                />

                <div className="w-full sm:w-44">
                    <CustomSelect
                        value={manager.typeFilter}
                        options={["All", "Holiday", "Event", "Announcement"]}
                        onChange={(val) => manager.setTypeFilter(val as any)}
                    />
                </div>
            </div>
        </div>
    );
}