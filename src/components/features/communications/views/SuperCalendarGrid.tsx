"use client";
import { useCommsManager } from "@/hooks/comms_hooks/useCommsManager";
import { Button } from "@/components/ui/Button";
import { QrCode, AlertTriangle, BellRing, Target, Clock, CalendarCheck2, Plus } from "lucide-react";

export function SuperCalendarGrid({ manager }: { manager: ReturnType<typeof useCommsManager> }) {
    // For demonstration, we lock the grid to November 2026. 
    // In production, this would use a standard date-math library like date-fns.
    const currentYear = 2026;
    const currentMonth = 10; // November (0-indexed)
    const todayDay = 15;

    // Cell Click Handler: Opens the correct drawer and pre-fills the clicked date
    const handleCellClick = (day: number) => {
        manager.setSelectedDate(new Date(currentYear, currentMonth, day));
        manager.setActiveRecord(null); // Clear any edit state

        if (manager.activeModule === "holidays") manager.setDrawerMode("holiday");
        if (manager.activeModule === "events") manager.setDrawerMode("event");
        if (manager.activeModule === "announcements") manager.setDrawerMode("announcement");
    };

    // Record Click Handler: Opens the record for editing
    const handleRecordClick = (e: React.MouseEvent, record: any, type: "holiday" | "event" | "announcement") => {
        e.stopPropagation(); // Prevent the cell click from firing
        manager.setActiveRecord(record);
        manager.setDrawerMode(type);
    };

    return (
        <div className="flex-1 overflow-y-auto w-full p-4 bg-gray-50/30">
            <div className="grid grid-cols-7 gap-2 h-full min-h-[650px]">
                {/* Calendar Header */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{day}</div>
                ))}

                {/* Interactive Day Cells */}
                {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === todayDay;

                    // Dynamically filter data for this specific cell's date
                    const cellDateStr = new Date(currentYear, currentMonth, day).toDateString();
                    const dayHolidays = manager.holidays.filter(h => new Date(h.startDate).toDateString() === cellDateStr);
                    const dayEvents = manager.events.filter(e => new Date(e.startDateTime).toDateString() === cellDateStr);
                    const dayAnnouncements = manager.announcements.filter(a => new Date(a.publishDate).toDateString() === cellDateStr);

                    return (
                        <div
                            key={i}
                            onClick={() => handleCellClick(day)}
                            className={`bg-white border ${isToday ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-gray-200'} rounded-lg p-2 min-h-[110px] flex flex-col gap-1.5 hover:shadow-md hover:border-brand-primary/50 transition cursor-pointer group relative`}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-bold ${isToday ? 'text-brand-primary' : 'text-gray-400'}`}>{day}</span>

                                <div className="flex flex-col items-end gap-1">
                                    {isToday && <span className="text-[8px] font-black uppercase bg-brand-primary text-white px-1.5 py-0.5 rounded shadow-2xs">Today</span>}
                                    {/* Hover Quick-Add Icon */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary/10 text-brand-primary rounded p-0.5">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                                {/* HOLIDAY RENDERING */}
                                {manager.activeModule === "holidays" && dayHolidays.map(holiday => (
                                    <div
                                        key={holiday.id}
                                        onClick={(e) => handleRecordClick(e, holiday, "holiday")}
                                        className="flex flex-col gap-0.5 p-1.5 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition hover:shadow-2xs group/pill relative"
                                    >
                                        <div className="flex items-center gap-1">
                                            <CalendarCheck2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                            <span className="text-[9px] font-bold text-emerald-900 leading-tight truncate">{holiday.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <span className="text-[8px] font-mono text-emerald-700 bg-emerald-100/50 px-1 rounded">1.5x Pay</span>
                                            {day % 2 === 0 && (
                                                <span title="Leave Overlap Detected">
                                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* EVENT RENDERING */}
                                {manager.activeModule === "events" && dayEvents.map(event => {
                                    const fillPercent = event.capacityLimit ? (event.rsvps.length / event.capacityLimit) * 100 : 0;
                                    return (
                                        <div
                                            key={event.id}
                                            onClick={(e) => handleRecordClick(e, event, "event")}
                                            className="flex flex-col gap-1 p-1.5 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition hover:shadow-2xs"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-gray-800 truncate">{event.title}</span>
                                                <span className="text-[8px] font-bold text-amber-700">{event.rsvps.length} RSVP</span>
                                            </div>
                                            <div className="w-full bg-amber-200/50 h-1 rounded-full overflow-hidden">
                                                <div className={`h-full ${fillPercent >= 100 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(fillPercent, 100)}%` }}></div>
                                            </div>
                                            {isToday && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full h-6 mt-0.5 text-[8px] flex items-center justify-center gap-1 shadow-2xs"
                                                    onClick={(e) => { e.stopPropagation(); alert("Opening QR Scanner for: " + event.title); }}
                                                >
                                                    <QrCode className="w-2.5 h-2.5" /> Scan QR
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* ANNOUNCEMENT RENDERING */}
                                {manager.activeModule === "announcements" && dayAnnouncements.map(memo => (
                                    <div
                                        key={memo.id}
                                        onClick={(e) => handleRecordClick(e, memo, "announcement")}
                                        className="flex flex-col gap-1 p-1.5 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition hover:shadow-2xs"
                                    >
                                        <div className="flex items-start gap-1">
                                            <Target className={`w-3 h-3 shrink-0 mt-0.5 ${memo.priority === 'High' ? 'text-rose-500' : 'text-blue-500'}`} />
                                            <span className="text-[9px] font-bold text-blue-900 leading-tight line-clamp-2">{memo.title}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                            <div className="text-[8px] font-mono text-gray-500 flex items-center gap-0.5">
                                                <Clock className="w-2.5 h-2.5" /> {memo.acknowledgedBy.length} Reads
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); alert("Nudging unread employees..."); }}
                                                className="text-[8px] font-bold text-amber-600 bg-amber-100 px-1 py-0.5 rounded hover:bg-amber-200 transition flex items-center gap-0.5"
                                            >
                                                <BellRing className="w-2 h-2" /> Nudge
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}