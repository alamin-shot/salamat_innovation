import * as React from "react";
import { useStore } from "zustand";
import { Save } from "lucide-react";
import { VariantDraftStore } from "@/types/products";

interface VariantSaveBarProps {
    drafts: VariantDraftStore;
    isBuilderDirty: boolean;
    onSaveAll: () => void;
}

function statusText(editedRows: number, isBuilderDirty: boolean): string {
    const rowsText = `${editedRows} unsaved variant ${editedRows === 1 ? "change" : "changes"}`;
    if (isBuilderDirty && editedRows > 0) return `Attribute changes and ${rowsText}`;
    if (isBuilderDirty) return "Unsaved attribute changes";
    if (editedRows > 0) return rowsText;
    return "No unsaved changes";
}

/** Sticks to the bottom of the drawer's scroll area so Save All is always in reach. */
export function VariantSaveBar({ drafts, isBuilderDirty, onSaveAll }: VariantSaveBarProps) {
    const editedRows = useStore(drafts, (state) => Object.keys(state.drafts).length);
    const isDirty = isBuilderDirty || editedRows > 0;

    return (
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t border-brand-subtext/10 bg-white pt-4 pb-2">
            <p className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${isDirty ? "text-amber-700" : "text-brand-subtext"}`} role="status">
                {isDirty && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />}
                {statusText(editedRows, isBuilderDirty)}
            </p>
            <button
                type="button"
                onClick={onSaveAll}
                disabled={!isDirty}
                className="flex shrink-0 items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-600"
            >
                <Save className="h-4 w-4" /> Save All
            </button>
        </div>
    );
}
