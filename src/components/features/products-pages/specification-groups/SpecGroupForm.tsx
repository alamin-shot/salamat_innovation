"use client";
import * as React from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SpecGroup, SpecGroupInput } from "@/types/products";
import { AuditFooter } from "../shared/AuditCells";

interface SpecGroupFormProps {
    group: SpecGroup | null;
    onSubmit: (input: SpecGroupInput) => void;
    onCancel: () => void;
}

// Same choices the previous form offered.
const SPECIFICATION_OPTIONS = ["General", "Platform", "Body", "Launch"];

export function SpecGroupForm({ group, onSubmit, onCancel }: SpecGroupFormProps) {
    const [specification, setSpecification] = React.useState(group?.name ?? "");
    // Starts with 2 empty inputs when adding, as before.
    const [subValues, setSubValues] = React.useState<string[]>(group ? group.subGroups : ["", ""]);

    // When editing a group whose name is outside the fixed list, keep it selectable.
    const options = group && !SPECIFICATION_OPTIONS.includes(group.name)
        ? [group.name, ...SPECIFICATION_OPTIONS]
        : SPECIFICATION_OPTIONS;

    const handleValueChange = (index: number, val: string) => {
        setSubValues((prev) => {
            const next = [...prev];
            next[index] = val;
            return next;
        });
    };

    const handleAddValue = () => {
        setSubValues((prev) => [...prev, ""]);
    };

    const handleRemoveValue = (index: number) => {
        if (subValues.length === 1) return;
        setSubValues((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!specification) {
            toast.error("Please select a specification.");
            return;
        }

        const validValues = subValues.map((v) => v.trim()).filter(Boolean);
        if (validValues.length === 0) {
            toast.error("At least one sub-specification value is required.");
            return;
        }

        onSubmit({ name: specification, subGroups: validValues });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                    Specifications <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                    value={specification}
                    onChange={setSpecification}
                    options={options}
                    placeholder="Choose a Specification"
                />
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                    Sub Specification Value <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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

            {group && (
                <AuditFooter
                    createdBy={group.createdBy}
                    createdAt={group.createdAt}
                    updatedBy={group.updatedBy}
                    updatedAt={group.updatedAt}
                />
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                <button
                    type="button"
                    onClick={onCancel}
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
    );
}
