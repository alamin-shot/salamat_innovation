"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { LeaveTypeItem } from "@/types/leaves.types";
import { toast } from "sonner";

interface LeaveTypeDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activeType: LeaveTypeItem | null;
    onClose: () => void;
    onSave: (payload: Omit<LeaveTypeItem, "id">) => void;
}

export function LeaveTypeDrawer({ isOpen, mode, activeType, onClose, onSave }: LeaveTypeDrawerProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<"Paid" | "Unpaid">("Paid");
    const [days, setDays] = useState(1.0);
    const [status, setStatus] = useState<"Enabled" | "Disabled">("Enabled");

    // Enterprise Extensions
    const [carryForward, setCarryForward] = useState(false);
    const [prorate, setProrate] = useState(false);

    useEffect(() => {
        if (mode === "edit" && activeType) {
            setName(activeType.name);
            setType(activeType.type);
            setDays(activeType.days);
            setStatus(activeType.status);
            setCarryForward(activeType.carryForward);
            setProrate(activeType.prorate);
        } else if (isOpen) {
            setName("");
            setType("Paid");
            setDays(1.0);
            setStatus("Enabled");
            setCarryForward(false);
            setProrate(true);
        }
    }, [isOpen, mode, activeType]);

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error("Leave Type Name is required");
            return;
        }
        if (days < 0) {
            toast.error("Days quota cannot be negative");
            return;
        }
        onSave({ name, type, days, status, carryForward, prorate });
    };

    return (
        <Drawer
            title={mode === "edit" ? "Update Leave Type" : "Add Leave Type"}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full lg:w-[calc(100vw-260px)] max-w-full"
        >
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="erp-input"
                            placeholder="Enter leave type name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Type <span className="text-red-500">*</span></label>
                            <CustomSelect value={type} options={["Paid", "Unpaid"]} onChange={(v) => setType(v as typeof type)} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="erp-label">Day (Annual Quota) <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                step="0.5"
                                min={0}
                                className="erp-input"
                                placeholder="Enter number of days"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Enable <span className="text-red-500">*</span></label>
                        <CustomSelect value={status} options={["Enabled", "Disabled"]} onChange={(v) => setStatus(v as typeof status)} />
                    </div>

                    {/* Enterprise Checkboxes */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Advanced Policy Rules</label>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={carryForward} onChange={(e) => setCarryForward(e.target.checked)} className="rounded text-brand-primary" />
                            Allow Carry Forward (Roll over unused balance to next year)
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={prorate} onChange={(e) => setProrate(e.target.checked)} className="rounded text-brand-primary" />
                            Pro-Rate Accrual (Calculate based on employee joining date)
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleSubmit}>Save</Button>
                </div>
            </div>
        </Drawer>
    );
}