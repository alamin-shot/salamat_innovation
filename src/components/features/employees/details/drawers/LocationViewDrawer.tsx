"use client";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export interface PunchLocationData {
    type: "In" | "Out";
    ip: string;
    coordinates?: string;
    address?: string;
}

interface LocationViewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    locationData: PunchLocationData | null;
}

export function LocationViewDrawer({ isOpen, onClose, locationData }: LocationViewDrawerProps) {
    if (!locationData) return null;

    // Mocking metadata based on screenshot since only IP is stored in the current mock logs
    const coordinates = locationData.coordinates || "23.813332914798302, 90.42318685871054";
    const address = locationData.address || "RC7F+9C, Dhaka, Bangladesh";

    return (
        <Drawer
            title={`Punch ${locationData.type} Location`}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full sm:w-[calc(100vw-260px)]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-4xl mx-auto w-full">

                    {/* Map Area */}
                    <div className="w-full h-80 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative shadow-sm">
                        {/* Using an iframe for real Google Maps embed based on coordinates */}
                        <iframe
                            title="Punch Location Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${coordinates}&t=m&z=15&output=embed&iwloc=near`}
                            className="absolute inset-0"
                        ></iframe>
                    </div>

                    {/* Metadata Card */}
                    <div className="erp-card bg-gray-50/50 p-6 flex flex-col gap-4 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-2 border-b border-gray-100/50">
                            <div className="text-sm font-semibold text-gray-600">IP Location</div>
                            <div className="sm:col-span-3 text-sm text-gray-900 font-medium">{locationData.ip}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-2 border-b border-gray-100/50">
                            <div className="text-sm font-semibold text-gray-600">Coordinates</div>
                            <div className="sm:col-span-3 text-sm text-gray-900 font-mono text-xs">{coordinates}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-2 border-b border-gray-100/50">
                            <div className="text-sm font-semibold text-gray-600">Address</div>
                            <div className="sm:col-span-3 text-sm text-gray-900">{address}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-2">
                            <div className="text-sm font-semibold text-gray-600">Provider</div>
                            <div className="sm:col-span-3">
                                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                                    Google Map
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose} className="px-6">Close</Button>
                </div>
            </div>
        </Drawer>
    );
}