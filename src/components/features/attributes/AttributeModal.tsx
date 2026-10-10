"use client";
import * as React from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface AttributeModalProps {
    isOpen: boolean;
    attributeId: string | null;
    onClose: () => void;
}

export function AttributeModal({ isOpen, attributeId, onClose }: AttributeModalProps) {
    const isEditMode = !!attributeId;

    const [name, setName] = React.useState("");
    const [values, setValues] = React.useState<string[]>([""]);

    React.useEffect(() => {
        if (isEditMode) {
            setName("Otecto K77");
            setValues(["3/32GB"]);
        } else {
            setName("");
            setValues([""]);
        }
    }, [isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleValueChange = (index: number, val: string) => {
        setValues(prev => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    const handleAddValueInput = () => {
        setValues(prev => [...prev, ""]);
    };

    const handleRemoveValueInput = (index: number) => {
        if (values.length === 1) return;
        setValues(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Attribute name is required.");
            return;
        }

        const validValues = values.map(v => v.trim()).filter(Boolean);
        if (validValues.length === 0) {
            toast.error("At least one value is required.");
            return;
        }

        toast.success(isEditMode ? "Attribute updated successfully." : "Attribute created successfully.");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex items-center justify-between border-b border-brand-subtext/15 px-6 py-4">
                    <h2 className="text-base font-bold text-brand-text">
                        {isEditMode ? "Update Attribute" : "Add Attribute"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                            Value <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                            {values.map((val, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={val}
                                        onChange={(e) => handleValueChange(idx, e.target.value)}
                                        placeholder="Enter Value"
                                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                    />
                                    {values.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveValueInput(idx)}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
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
                                onClick={handleAddValueInput}
                                className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Value
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
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