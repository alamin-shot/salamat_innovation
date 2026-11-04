"use client";
import { useState, useEffect } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { BeneficiaryItem, BeneficiaryType, BeneficiaryStatus } from "@/types/payroll.types";
import { toast } from "sonner";
import { PlusCircle, MinusCircle, Landmark } from "lucide-react";

interface BeneficiaryDrawerProps {
    isOpen: boolean;
    mode: "add" | "edit";
    activeItem: BeneficiaryItem | null;
    onClose: () => void;
    onSave: (payload: Omit<BeneficiaryItem, "id">) => void;
}

export function BeneficiaryDrawer({ isOpen, mode, activeItem, onClose, onSave }: BeneficiaryDrawerProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<BeneficiaryType>("Allowance");
    const [status, setStatus] = useState<BeneficiaryStatus>("Active");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (mode === "edit" && activeItem) {
            setName(activeItem.name);
            setType(activeItem.type);
            setStatus(activeItem.status);
            setDescription(activeItem.description);
        } else if (isOpen) {
            setName("");
            setType("Allowance");
            setStatus("Active");
            setDescription("");
        }
    }, [isOpen, mode, activeItem]);

    const handleSubmit = () => {
        if (!name.trim()) return toast.error("Beneficiary Name is required");
        onSave({ name, type, status, description });
    };

    return (
        <Drawer title={mode === "edit" ? "Update Beneficiary" : "Add Beneficiary"} isOpen={isOpen} onClose={onClose} width="drawer-full-content">
            <div className="flex flex-col h-full pt-6">
                <div className="flex-1 px-6 overflow-y-auto custom-scrollbar pb-12 flex flex-col gap-6 max-w-3xl mx-auto w-full">

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Beneficiary Name <span className="text-red-500">*</span></label>
                        <input type="text" className="erp-input" placeholder="e.g. KPI, Transport, Income Tax" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="erp-label">Classification Type <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button
                                onClick={() => setType("Allowance")}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${type === "Allowance" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                            >
                                <PlusCircle className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wide">Allowance (Earning)</span>
                            </button>
                            <button
                                onClick={() => setType("Deduction")}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${type === "Deduction" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                            >
                                <MinusCircle className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wide">Deduction (Standard)</span>
                            </button>
                            <button
                                onClick={() => setType("Statutory")}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition ${type === "Statutory" ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                            >
                                <Landmark className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wide">Statutory (Tax/Gov)</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Status <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-4 mt-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="radio" name="b_status" checked={status === "Active"} onChange={() => setStatus("Active")} className="text-brand-primary" /> Active
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                                <input type="radio" name="b_status" checked={status === "Inactive"} onChange={() => setStatus("Inactive")} className="text-brand-primary" /> Inactive
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="erp-label">Description / Formula Notes</label>
                        <textarea className="erp-input min-h-[100px] py-2" placeholder="Write description here..." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 bg-white px-6 pb-4 mt-auto">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="default" onClick={handleSubmit}>Save Beneficiary</Button>
                </div>
            </div>
        </Drawer>
    );
}