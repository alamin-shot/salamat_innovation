"use client";
import { Drawer } from "@/components/ui/Drawer";
import { LeaveRequestItem } from "@/types/leaves.types";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface LeaveRequestViewDrawerProps {
    request: LeaveRequestItem | null;
    onClose: () => void;
}

export function LeaveRequestViewDrawer({ request, onClose }: LeaveRequestViewDrawerProps) {
    return (
        <Drawer title="Leave Request Details" isOpen={!!request} onClose={onClose} width="drawer-full-content">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-2xl">
                    {request && (
                        <>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Leave Type</p>
                                    <p className="text-sm font-semibold text-gray-900">{request.leaveTypeName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Leave Duration</p>
                                    <p className="text-sm font-semibold text-gray-900">{request.duration}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Date Period</p>
                                    <p className="text-sm text-gray-700">
                                        {request.duration === "Multi-Day" ? `${request.startDate} to ${request.endDate}` : request.startDate}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Status</p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-flex ${request.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : request.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200"
                                                : "bg-rose-50 text-rose-600 border-rose-200"
                                        }`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Note</p>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-gray-50 border border-gray-100 rounded-lg leading-relaxed">
                                    {request.note || "No note provided."}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Attachment</p>
                                {request.attachment ? (
                                    <Button variant="outline" size="sm" className="h-8 flex items-center gap-1.5 text-xs text-blue-600">
                                        <Download className="w-3.5 h-3.5" /> Download File
                                    </Button>
                                ) : (
                                    <p className="text-sm text-gray-400">—</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Drawer>
    );
}