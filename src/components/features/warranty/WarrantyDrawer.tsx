"use client";
import { useState, useEffect } from "react";
import { WarrantyManagerType } from "@/hooks/warranty_hooks/useWarrantyManager";
import { WarrantyStatus } from "@/store/useWarrantyStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function WarrantyDrawer({ manager }: { manager: WarrantyManagerType }) {
    const isEditing = manager.activeDrawer === "view_edit";
    const activeRequest = manager.getActiveRequest();

    const [adminNote, setAdminNote] = useState("");
    const [status, setStatus] = useState<WarrantyStatus>("Pending");

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
            title={`Ticket Details: ${activeRequest.ticketNumber}`}
            isOpen={manager.activeDrawer !== "none"}
            onClose={manager.closeDrawer}
            width="w-full sm:w-[calc(100vw-260px)] md:w-[700px]"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 w-full flex flex-col gap-6 px-4 overflow-y-auto custom-scrollbar pb-10">

                    {/* Read-Only Context Block */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">

                        <div className="md:col-span-2 pb-2 border-b border-gray-200">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Device Issue Claim</span>
                            <p className="text-sm font-medium text-gray-900 mt-1">{activeRequest.issueDescription}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Product</span>
                            <p className="text-sm text-gray-800 mt-0.5 font-medium">{activeRequest.productName}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Serial / IMEI</span>
                            <p className="text-sm text-gray-800 mt-0.5 font-mono bg-white inline-block px-1.5 py-0.5 rounded border border-gray-200">{activeRequest.serialNumber}</p>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Customer</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.customerName}</p>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact Phone</span>
                            <p className="text-sm text-gray-800 mt-0.5">{activeRequest.phone}</p>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Admin Editor Block */}
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Internal Resolution Note</label>
                        <textarea
                            className="erp-input h-32 resize-none"
                            placeholder="Type internal tracking notes, updates, or resolution details here..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <span className="text-xs text-gray-400">Notes are for internal staff use only.</span>
                    </div>

                    <div className="flex flex-col gap-1.5 w-1/2">
                        <label className="erp-label">Ticket Status <span className="text-red-500">*</span></label>
                        <CustomSelect
                            value={status}
                            options={["Pending", "Processing", "Resolved", "Rejected"]}
                            onChange={(val) => setStatus(val as WarrantyStatus)}
                        />
                    </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white mt-auto shrink-0 px-4">
                    <Button variant="outline" onClick={manager.closeDrawer} className="px-6 h-9">Cancel</Button>
                    <Button variant="success" onClick={handleSubmit} className="px-8 h-9">Save Ticket</Button>
                </div>
            </div>
        </Drawer>
    );
}