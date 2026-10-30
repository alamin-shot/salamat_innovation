"use client";
import { useState, useEffect } from "react";
import { SellDeviceManagerType } from "@/hooks/sell_device_hooks/useSellDeviceManager";
import { SellDeviceStatus } from "@/store/useSellDeviceStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function SellDeviceDrawer({ manager }: { manager: SellDeviceManagerType }) {
    const isEditing = manager.activeDrawer === "view_edit";
    const activeRequest = manager.getActiveRequest();

    const [adminNote, setAdminNote] = useState("");
    const [status, setStatus] = useState<SellDeviceStatus>("Pending");

    useEffect(() => {
        if (isEditing && activeRequest) {
            setAdminNote(activeRequest.adminNote || "");
            setStatus(activeRequest.status);
        }
    }, [isEditing, activeRequest]);

    const handleSubmit = () => {
        manager.handleSubmit({
            adminNote: adminNote.trim() === "" ? null : adminNote,
            status
        });
    };

    if (!activeRequest) return null;

    return (
        <Drawer
            title={`Device Evaluation: ${activeRequest.requestId}`}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)] md:w-[700px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Read-Only Intake Block */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">

                        <div className="sm:col-span-2 pb-3 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expected Customer Price</span>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">৳{activeRequest.expectedPrice.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Submitted On</span>
                                <p className="text-sm font-medium text-gray-700 mt-0.5">
                                    {new Date(activeRequest.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Customer</span>
                            <p className="text-sm text-gray-800 mt-0.5 font-medium">{activeRequest.customerName}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.phone}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Device Model</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.deviceBrand} {activeRequest.deviceModel}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">RAM / Storage</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.ramStorage}</p>
                        </div>

                        <div className="sm:col-span-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reported Condition</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.condition}</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Admin Negotiator Editor Block */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Negotiation & Evaluation Notes</label>
                        <textarea
                            className="erp-input h-32 resize-none"
                            placeholder="Type internal tracking notes, counter-offers, or physical evaluation details here..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <span className="text-xs text-gray-400">Notes are strictly for internal staff reference.</span>
                    </div>

                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label className="erp-label">Status <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={status}
                            options={["Pending", "Contacted", "Approved", "Rejected"]}
                            onChange={(val) => setStatus(val as SellDeviceStatus)}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save Evaluation</Button>
                </div>
            </div>
        </Drawer>
    );
}