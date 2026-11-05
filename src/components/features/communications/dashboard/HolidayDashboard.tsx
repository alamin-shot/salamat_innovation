"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Download, Globe2 } from "lucide-react";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { SuperCalendarGrid } from "../views/SuperCalendarGrid";
import { SuperTimelineFeed } from "../tables/SuperTimelineFeed";

export function HolidayDashboard({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    // Local toggle to switch between List and Calendar
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    return (
        <div className="flex flex-col h-full gap-2">
            {/* Analytics Ribbon (Scenario Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-indigo-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Holidays (2026)</p>
                    <p className="text-2xl font-black mt-1">{manager.holidays.length}</p>
                </div>
                <div className="bg-emerald-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">This Month</p>
                    <p className="text-2xl font-black mt-1">2</p>
                </div>
                <div className="bg-purple-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Upcoming</p>
                    <p className="text-2xl font-black mt-1">1</p>
                </div>
                <div className="bg-amber-500 rounded-xl p-4 text-white shadow-2xs flex flex-col justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Optional / Floating</p>
                    <p className="text-2xl font-black mt-1">3</p>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="flex-1 erp-card p-0 flex flex-col bg-white overflow-hidden shadow-sm">

                {/* Header & Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-brand-primary" /> Global Timeline
                    </h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

                        {/* Feed vs Calendar Toggle */}
                        <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5">
                            <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded text-[10px] font-bold transition ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>List Feed</button>
                            <button onClick={() => setViewMode("calendar")} className={`px-3 py-1 rounded text-[10px] font-bold transition ${viewMode === "calendar" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}>Calendar</button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 bg-white text-[10px] px-2 hidden sm:flex"><Download className="w-3 h-3 mr-1" /> ICS Export</Button>
                            <Button variant="default" size="sm" onClick={() => manager.setDrawerMode("holiday")} className="h-8 text-[10px] px-2"><Plus className="w-3 h-3 mr-1" /> Add Holiday</Button>
                        </div>
                    </div>
                </div>

                {/* Dynamic View Injection */}
                {viewMode === "list" ? (
                    <SuperTimelineFeed manager={manager} />
                ) : (
                    <SuperCalendarGrid manager={manager} />
                )}
            </div>
        </div>
    );
}