"use client";
import * as React from "react";
import Image from "next/image";
import { Plus, Trash2, Save, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { AttributeValue, ProductAttribute, ProductAttributeInput } from "@/types/products";
import { isColorAttribute } from "@/utils/productRules";
import { AuditFooter } from "../shared/AuditCells";

interface AttributeFormProps {
    attribute: ProductAttribute | null;
    onSubmit: (input: ProductAttributeInput) => void;
    onCancel: () => void;
}

const newValue = (): AttributeValue => ({
    id: `val-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    label: "",
    image: null,
});

export function AttributeForm({ attribute, onSubmit, onCancel }: AttributeFormProps) {

    const [name, setName] = React.useState(attribute?.name ?? "");
    const [values, setValues] = React.useState<AttributeValue[]>(attribute ? attribute.values : [newValue()]);

    // Image upload is offered only for a Color / Colour attribute.
    const showValueImages = isColorAttribute(name);

    const handleValueChange = (id: string, label: string) => {
        setValues((prev) => prev.map((value) => (value.id === id ? { ...value, label } : value)));
    };

    const handleMockUpload = (id: string) => {
        setValues((prev) => prev.map((value) => (value.id === id ? { ...value, image: "/phone.png" } : value)));
        toast.success("Image uploaded successfully.");
    };

    const handleRemoveImage = (id: string) => {
        setValues((prev) => prev.map((value) => (value.id === id ? { ...value, image: null } : value)));
    };

    const handleAddValueInput = () => {
        setValues((prev) => [...prev, newValue()]);
    };

    const handleRemoveValueInput = (id: string) => {
        if (values.length === 1) return;
        setValues((prev) => prev.filter((value) => value.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Attribute name is required.");
            return;
        }

        const validValues = values
            .map((value) => ({ ...value, label: value.label.trim() }))
            .filter((value) => value.label !== "");
        if (validValues.length === 0) {
            toast.error("At least one value is required.");
            return;
        }

        onSubmit({
            name: name.trim(),
            // Images are kept only while the attribute is a colour attribute.
            values: validValues.map((value) => ({ ...value, image: showValueImages ? value.image : null })),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-32">
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

                <div className="flex flex-col gap-2">
                    {values.map((value) => (
                        <div key={value.id} className="flex items-center gap-2">
                            {showValueImages && (
                                value.image ? (
                                    <div className="relative h-9 w-9 shrink-0 rounded-md border border-brand-subtext/20 bg-brand-bg">
                                        <Image src={value.image} alt={value.label || "Color"} fill sizes="36px" className="rounded-md object-contain p-0.5" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(value.id)}
                                            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors"
                                            title="Remove image"
                                        >
                                            <X className="h-2.5 w-2.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleMockUpload(value.id)}
                                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-brand-subtext/30 bg-brand-bg/50 transition-colors hover:border-emerald-500/50 hover:bg-emerald-50/50"
                                        title="Upload color image"
                                    >
                                        <UploadCloud className="h-4 w-4 text-brand-subtext" />
                                    </button>
                                )
                            )}
                            <input
                                type="text"
                                required
                                value={value.label}
                                onChange={(e) => handleValueChange(value.id, e.target.value)}
                                placeholder="Enter Value"
                                className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            {values.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveValueInput(value.id)}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Remove Value"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {showValueImages && (
                    <p className="text-xs text-brand-subtext">Upload one image for each color value.</p>
                )}

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

            {attribute && (
                <AuditFooter
                    createdBy={attribute.createdBy}
                    createdAt={attribute.createdAt}
                    updatedBy={attribute.updatedBy}
                    updatedAt={attribute.updatedAt}
                />
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                <button
                    type="button"
                    onClick={onCancel}
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
    );
}
