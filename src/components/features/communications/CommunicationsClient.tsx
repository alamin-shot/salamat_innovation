"use client";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { HolidayDashboard } from "./dashboard/HolidayDashboard";
import { EventDashboard } from "./dashboard/EventDashboard";
import { AnnouncementDashboard } from "./dashboard/AnnouncementDashboard";
import { HolidayDrawer } from "./drawers/HolidayDrawer";
import { EventDrawer } from "./drawers/EventDrawer";
import { AnnouncementDrawer } from "./drawers/AnnouncementDrawer";
import { CalendarCheck2, Calendar, Megaphone } from "lucide-react";

export function CommunicationsClient() {
    const manager = useCommsManager();

    return (
        <div className="flex flex-col w-full h-full gap-2 p-3 sm:p-4">
            {/* Top-Level Module Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Corporate Communications</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage global holidays, attendance-linked events, and compliance announcements.</p>
                </div>

                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 w-full sm:w-auto shadow-sm">
                    <button onClick={() => manager.setActiveModule("holidays")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "holidays" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <CalendarCheck2 className="w-3.5 h-3.5" /> Holidays
                    </button>
                    <button onClick={() => manager.setActiveModule("events")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "events" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <Calendar className="w-3.5 h-3.5" /> Events
                    </button>
                    <button onClick={() => manager.setActiveModule("announcements")} className={`flex items-center gap-2 flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-md text-xs font-semibold transition ${manager.activeModule === "announcements" ? "bg-brand-primary text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"}`}>
                        <Megaphone className="w-3.5 h-3.5" /> Announcements
                    </button>
                </div>
            </div>

            {/* Dynamic Dashboard Rendering */}
            <div className="flex-1 flex flex-col min-h-0">
                {manager.activeModule === "holidays" && <HolidayDashboard manager={manager} />}
                {manager.activeModule === "events" && <EventDashboard manager={manager} />}
                {manager.activeModule === "announcements" && <AnnouncementDashboard manager={manager} />}
            </div>

            {/* Hidden Drawers */}
            <HolidayDrawer manager={manager} />
            <EventDrawer manager={manager} />
            <AnnouncementDrawer manager={manager} />
        </div>
    );
}