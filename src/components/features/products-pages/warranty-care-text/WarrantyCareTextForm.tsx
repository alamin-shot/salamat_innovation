"use client";
import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { WarrantyCareText, WarrantyCareTextInput } from "@/types/products";
import { AuditFooter } from "../shared/AuditCells";

interface WarrantyCareTextFormProps {
    record: WarrantyCareText | null;
    usageCount: number;
    onSubmit: (input: WarrantyCareTextInput) => void;
    onCancel: () => void;
}

export function WarrantyCareTextForm({ record, usageCount, onSubmit, onCancel }: WarrantyCareTextFormProps) {
    const [text, setText] = React.useState(record?.text ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            toast.error("Warranty care text is required.");
            return;
        }
        onSubmit({ text: text.trim(), status: record?.status ?? "Active" });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-4xl flex-col gap-5 pb-32">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">
                    Warranty Care Text <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Warranty will be applicable for..."
                    className="w-full resize-none rounded-md border border-brand-subtext/30 bg-white p-3 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 custom-scrollbar"
                />
                {record && usageCount > 0 && (
                    <p className="text-xs font-medium text-amber-600">
                        Saving updates this text on {usageCount} {usageCount === 1 ? "product" : "products"} that use it.
                    </p>
                )}
            </div>

            {record && (
                <AuditFooter
                    createdBy={record.createdBy}
                    createdAt={record.createdAt}
                    updatedBy={record.updatedBy}
                    updatedAt={record.updatedAt}
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
