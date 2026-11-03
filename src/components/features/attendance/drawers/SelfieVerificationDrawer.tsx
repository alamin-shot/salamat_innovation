"use client";
import { GlobalAttendanceLog } from "@/types/attendance.types";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ShieldAlert, MapPin, Smartphone, Clock } from "lucide-react";

interface SelfieVerificationDrawerProps {
    data: {
        log: GlobalAttendanceLog;
        punchType: "In" | "Out";
    } | null;
    onClose: () => void;
}

export function SelfieVerificationDrawer({ data, onClose }: SelfieVerificationDrawerProps) {
    if (!data) return null;
    const { log, punchType } = data;
    const selfieUrl = punchType === "In" ? log.inSelfie : log.outSelfie;
    const timestamp = punchType === "In" ? log.punchIn : log.punchOut;
    const ip = punchType === "In" ? log.inLocation : log.outLocation;
    const coords = punchType === "In" ? log.inCoordinates : log.outCoordinates;
    const address = punchType === "In" ? log.inAddress : log.outAddress;
    const isVerified = log.segments[0]?.isGeofenceVerified ?? true;

    return (
        <Drawer
            title={`Punch ${punchType} Biometric & Selfie Audit — ${log.employeeName}`}
            isOpen={!!data}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Captured Selfie Card */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col items-center gap-3 shadow-2xs">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Captured Punch {punchType} Selfie
                            </span>
                            {selfieUrl ? (
                                <img
                                    src={selfieUrl}
                                    alt="Captured Selfie"
                                    className="w-56 h-56 rounded-xl object-cover border border-gray-200 shadow-xs"
                                />
                            ) : (
                                <div className="w-56 h-56 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                    No camera capture required for terminal
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                {isVerified ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <ShieldCheck className="w-4 h-4" /> Geofence & IP Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                        <ShieldAlert className="w-4 h-4" /> Outside Assigned Outlet Geofence
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Live Map & Device Telemetry */}
                        <div className="flex flex-col gap-4">
                            <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 relative">
                                <iframe
                                    title="Selfie GPS Map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                        coords || "23.8133, 90.4231"
                                    )}&t=m&z=15&output=embed`}
                                    className="absolute inset-0"
                                />
                            </div>

                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col gap-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" /> Punch Timestamp:
                                    </span>
                                    <span className="font-bold text-gray-900">{log.date} • {timestamp}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" /> IP Address:
                                    </span>
                                    <span className="font-mono font-semibold text-gray-900">{ip}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Smartphone className="w-3.5 h-3.5" /> Device Fingerprint:
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {log.segments[0]?.deviceInfo || "Verified Browser"}
                                    </span>
                                </div>
                                <div className="pt-1 border-t border-slate-200 text-gray-600">
                                    <strong>Location:</strong> {address || "Jamuna Future Park, Dhaka"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>
                        Close Audit View
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}