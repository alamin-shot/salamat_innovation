"use client";
import { AttendancesManagerType } from "@/hooks/attendance_hooks/useAttendancesManager";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { getInitials, getAvatarColorClass } from "@/utils/bdGeography";
import { LogIn, LogOut, Clock, MapPin } from "lucide-react";

export function PunchDetailsDrawer({ manager }: { manager: AttendancesManagerType }) {
    const log = manager.getDetailsLog();
    const isOpen = !!log;

    if (!log) return null;

    return (
        <Drawer title={`${log.employeeName} — ${log.date}`} isOpen={isOpen} onClose={manager.closeDetails} width="w-full sm:w-[calc(100vw-260px)] max-w-4xl">
            <div className="flex flex-col h-full pt-6 bg-gray-50/30">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 w-full mx-auto">

                    {/* Header Card */}
                    <div className="erp-card bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${getAvatarColorClass(log.employeeId)}`}>{getInitials(log.employeeName)}</div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold text-gray-900">{log.employeeName}</h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {log.date}</p>
                        </div>
                    </div>

                    {/* Timeline Summary Card */}
                    <div className="erp-card bg-white p-6 shadow-sm border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><LogIn className="w-5 h-5" /></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First In</div>
                            <div className="font-bold text-gray-900">{log.punchIn}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center"><LogOut className="w-5 h-5 ml-1" /></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Out</div>
                            <div className="font-bold text-gray-900">{log.punchOut}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Worked</div>
                            <div className="font-bold text-blue-600">{log.totalHours}</div>
                        </div>
                    </div>

                    {/* Detailed Timeline with Live Map */}
                    <div className="erp-card bg-white p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center">1</span>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Punch In</span>
                                <span className="font-bold text-gray-900 text-sm">{log.punchIn}</span>
                            </div>
                            <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100">{log.totalHours}</div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 flex flex-col items-center gap-1 opacity-50 pt-1">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span className="text-[9px] font-bold">IN</span>
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="text-sm font-mono text-gray-700">{log.inLocation}</div>
                                {log.inCoordinates && (
                                    <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative shadow-inner">
                                        <iframe
                                            width="100%" height="100%" frameBorder="0" scrolling="no"
                                            src={`https://maps.google.com/maps?q=${log.inCoordinates}&t=m&z=15&output=embed`}
                                            className="absolute inset-0"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={manager.closeDetails} className="px-6">Close Details</Button>
                </div>
            </div>
        </Drawer>
    );
}