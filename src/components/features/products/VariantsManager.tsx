"use client";
import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useVariantMatrix } from "@/hooks/useVariantMatrix";
import { FormInput } from "@/components/ui/forms/FormInput";
import { FormToggle } from "@/components/ui/forms/FormToggle";

export function VariantsManager() {
    const {
        attributes, variants, setVariants, addAttribute, updateAttribute, removeAttribute
    } = useVariantMatrix();

    // Helper to handle comma-separated typing for instant tag creation
    const handleValueTyping = (id: string, input: string) => {
        const values = input.split(",").map(v => v.trim()).filter(Boolean);
        updateAttribute(id, "values", values);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Step 1: Attribute Builder */}
            <div className="flex flex-col gap-3">
                {attributes.map((attr) => (
                    <div key={attr.id} className="flex items-end gap-3 rounded-lg border border-brand-subtext/20 bg-brand-bg/10 p-3">
                        <div className="w-1/3">
                            <FormInput
                                label="Attribute Name"
                                placeholder="e.g. Color, Storage"
                                value={attr.name}
                                onChange={(e) => updateAttribute(attr.id, "name", e.target.value)}
                            />
                        </div>
                        <div className="w-2/3">
                            <FormInput
                                label="Attribute Values (Comma separated)"
                                placeholder="e.g. Red, Blue, Green"
                                defaultValue={attr.values.join(", ")}
                                onBlur={(e) => handleValueTyping(attr.id, e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => removeAttribute(attr.id)}
                            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}

                <button
                    onClick={addAttribute}
                    className="flex w-max items-center gap-2 rounded-md bg-brand-primary/10 px-3 py-2 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/20"
                >
                    <Plus className="h-4 w-4" /> Add Another Option
                </button>
            </div>

            {/* Step 2: Auto-Generated Matrix Grid */}
            {variants.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-brand-subtext/20 custom-scrollbar">
                    <table className="w-full text-left text-sm text-brand-text">
                        <thead className="bg-brand-bg/50 font-semibold text-brand-subtext">
                            <tr>
                                <th className="px-4 py-3">Variant Title</th>
                                <th className="px-4 py-3 w-32">SKU</th>
                                <th className="px-4 py-3 w-32">Retail Price</th>
                                <th className="px-4 py-3 w-28">Discount (%)</th>
                                <th className="px-4 py-3 w-24">In Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-subtext/10 bg-white">
                            {variants.map((variant, index) => (
                                <tr key={variant.id} className="transition-colors hover:bg-brand-bg/40">
                                    <td className="px-4 py-3 font-medium text-brand-primary">
                                        <span className="rounded-md bg-brand-primary/10 px-2 py-1 text-xs">
                                            {variant.title}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            className="w-full rounded-md border border-brand-subtext/30 px-2 py-1 text-sm focus:border-brand-primary focus:outline-none"
                                            placeholder="SKU-123"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            className="w-full rounded-md border border-brand-subtext/30 px-2 py-1 text-sm focus:border-brand-primary focus:outline-none"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            className="w-full rounded-md border border-brand-subtext/30 px-2 py-1 text-sm focus:border-brand-primary focus:outline-none"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-4 py-2 pt-3">
                                        <FormToggle defaultChecked={variant.inStock} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}