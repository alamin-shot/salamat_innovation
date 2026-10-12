"use client";
import * as React from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface SpecGroupModalProps {
    isOpen: boolean;
    groupId: string | null;
    onClose: () => void;
}

export function SpecGroupModal({ isOpen, groupId, onClose }: SpecGroupModalProps) {
    const isEditMode = !!groupId;

    const [specification, setSpecification] = React.useState("");
    const [subValues, setSubValues] = React.useState<string[]>(["", ""]); // Starts with 2 empty inputs like the screenshot

    React.useEffect(() => {
        if (isEditMode) {
            setSpecification("Platform");
            setSubValues(["Operating System", "Chipset", "CPU"]);
        } else {
            setSpecification("");
            setSubValues(["", ""]);
        }
    }, [isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleValueChange = (index: number, val: string) => {
        setSubValues(prev => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    const handleAddValue = () => {
        setSubValues(prev => [...prev, ""]);
    };

    const handleRemoveValue = (index: number) => {
        if (subValues.length === 1) return;
        setSubValues(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!specification) {
            toast.error("Please select a specification.");
            return;
        }

        const validValues = subValues.map(v => v.trim()).filter(Boolean);
        if (validValues.length === 0) {
            toast.error("At least one sub-specification value is required.");
            return;
        }

        toast.success(isEditMode ? "Specification group updated." : "Specification group created.");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between border-b border-brand-subtext/15 px-6 py-4">
                    <h2 className="text-base font-bold text-brand-text">
                        {isEditMode ? "Update Specification Groups" : "Add Specification Groups"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-subtext tracking-wider">
                            Specifications <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={specification}
                            onChange={(e) => setSpecification(e.target.value)}
                            className="w-full appearance-none rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="" disabled>Choose a Specification</option>
                            <option value="General">General</option>
                            <option value="Platform">Platform</option>
                            <option value="Body">Body</option>
                            <option value="Launch">Launch</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-xs font-bold text-brand-subtext tracking-wider">
                            Sub Specification Value <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                            {subValues.map((val, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        required
                                        value={val}
                                        onChange={(e) => handleValueChange(idx, e.target.value)}
                                        placeholder="Enter Sub Specification Value"
                                        className="flex-1 rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    {subValues.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveValue(idx)}
                                            className="flex h-9 w-10 shrink-0 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                                            title="Remove Value"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleAddValue}
                                className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-800 shadow-sm"
                            >
                                <Plus className="h-4 w-4" /> Add Value
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-brand-subtext/30 px-5 py-2 text-sm font-bold text-emerald-700 hover:bg-brand-bg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                        >
                            <Save className="h-4 w-4" /> Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}