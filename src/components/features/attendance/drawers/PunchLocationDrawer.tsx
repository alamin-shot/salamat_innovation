"use client";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

interface PunchLocationDrawerProps {
    locationData: {
        type: "In" | "Out";
        ip: string;
        coordinates: string;
        address: string;
        employeeName: string;
    } | null;
    onClose: () => void;
}

export function PunchLocationDrawer({ locationData, onClose }: PunchLocationDrawerProps) {
    if (!locationData) return null;

    const coords = locationData.coordinates || "23.813332914798302, 90.42318685871054";
    const addr = locationData.address || "RC7F+9C, Dhaka, Bangladesh";

    return (
        <Drawer
            title={`Punch ${locationData.type} Location — ${locationData.employeeName}`}
            isOpen={!!locationData}
            onClose={onClose}
            width="drawer-full-content"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-4xl">
                    <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100 relative">
                        <iframe
                            title="Live Punch Location"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(coords)}&t=m&z=16&output=embed`}
                            className="absolute inset-0"
                        />
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5 flex flex-col gap-3.5 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <span className="text-gray-500 font-medium">Ip location</span>
                            <span className="sm:col-span-3 font-semibold text-gray-900 font-mono">
                                {locationData.ip}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <span className="text-gray-500 font-medium">Coordinates</span>
                            <span className="sm:col-span-3 font-semibold text-gray-900 font-mono">{coords}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <span className="text-gray-500 font-medium">Address</span>
                            <span className="sm:col-span-3 font-semibold text-gray-900">{addr}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                            <span className="text-gray-500 font-medium">Provider</span>
                            <div className="sm:col-span-3">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-600 border border-cyan-200">
                                    Google Map
                                </span>
                            </div>
                        </div>
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