"use client";
import { GlobalAttendanceLog } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { LogIn, LogOut, Clock, MapPin, Calendar, ListChecks, ShieldCheck } from "lucide-react";

interface PunchDetailsDrawerProps {
    log: GlobalAttendanceLog | null;
    onClose: () => void;
    onOpenLocation: (loc: {
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    }) => void;
}

export function PunchDetailsDrawer({ log, onClose, onOpenLocation }: PunchDetailsDrawerProps) {
    if (!log) return null;

    return (
        <Drawer
            title={`${log.employeeName} — ${log.date}`}
            isOpen={!!log}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-4xl">
                    {/* Employee Summary Header matching screenshot */}
                    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white shadow-2xs">
                        <div className="flex items-center gap-3.5">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColorClass(
                                    log.employeeId
                                )}`}
                            >
                                {getInitials(log.employeeName)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-base">{log.employeeName}</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="w-3.5 h-3.5" /> {log.date} • {log.outlet}
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                            <ListChecks className="w-3.5 h-3.5" /> {log.segments.length} records
                        </span>
                    </div>

                    {/* 3 KPI Strip: FIRST IN | LAST OUT | TOTAL WORKED */}
                    <div className="grid grid-cols-3 border border-gray-100 rounded-xl bg-gray-50/70 p-5 text-center divide-x divide-gray-200/60">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <LogIn className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                FIRST IN
                            </span>
                            <span className="text-sm font-bold text-gray-900">{log.punchIn}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <LogOut className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                LAST OUT
                            </span>
                            <span className="text-sm font-bold text-gray-900">{log.punchOut}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                TOTAL WORKED
                            </span>
                            <span className="text-sm font-bold text-gray-900">{log.totalHours}</span>
                        </div>
                    </div>

                    {/* Individual Punch Segments List */}
                    <div className="flex flex-col gap-3">
                        {log.segments.map((seg, idx) => (
                            <div
                                key={seg.id}
                                className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-3 shadow-2xs"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">
                                            {idx + 1}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                            <LogIn className="w-3 h-3" /> Punch In
                                        </span>
                                        <span className="font-bold text-sm text-gray-900">{seg.punchIn}</span>
                                        {seg.inSelfie && (
                                            <img
                                                src={seg.inSelfie}
                                                alt="Punch In Selfie"
                                                className="w-7 h-7 rounded-full object-cover border border-gray-300"
                                            />
                                        )}
                                        <span className="text-gray-400">→</span>
                                        <span className="font-bold text-sm text-gray-700">{seg.punchOut}</span>
                                    </div>

                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 text-xs font-mono font-bold border border-cyan-200">
                                        <Clock className="w-3 h-3" /> {seg.duration}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
                                    <button
                                        onClick={() =>
                                            onOpenLocation({
                                                type: "In",
                                                ip: seg.inLocation,
                                                coordinates: seg.inCoordinates,
                                                address: seg.inAddress,
                                                employeeName: log.employeeName
                                            })
                                        }
                                        className="inline-flex items-center gap-1 font-mono text-gray-700 underline hover:text-brand-primary"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> in: {seg.inLocation}
                                    </button>

                                    <span className="text-gray-500 flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {seg.deviceInfo}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}