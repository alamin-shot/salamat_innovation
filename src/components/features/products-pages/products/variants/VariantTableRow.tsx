import * as React from "react";
import { useStore } from "zustand";
import { Save } from "lucide-react";
import { ProductVariant, ProductVariantEdit, VariantDraftStore, VariantRowSaveConfig } from "@/types/products";
import { parsePriceInput, pickVariantEdit, toPriceInput } from "@/utils/productRules";
import { DiscountSummary } from "../../shared/DiscountSummary";
import { StatusToggle } from "../../shared/StatusToggle";
import { VariantSwatch } from "./VariantSwatch";

interface VariantTableRowProps {
    /** Saved values; the row's unsaved edits live in `drafts`. */
    variant: ProductVariant;
    swatchImage: string | null;
    drafts: VariantDraftStore;
    rowSave?: VariantRowSaveConfig;
}

const PRICE_INPUT = "w-28 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none";

export const VariantTableRow = React.memo(function VariantTableRow({ variant, swatchImage, drafts, rowSave }: VariantTableRowProps) {
    // Subscribes to this row's draft only: typing here never re-renders the other rows.
    const draft = useStore(drafts, (state) => state.drafts[variant.id]);
    const value: ProductVariantEdit = draft ?? pickVariantEdit(variant);
    const isDirty = draft !== undefined;

    const edit = (changes: Partial<ProductVariantEdit>) => drafts.getState().editVariant(variant, changes);

    const saveTitle = rowSave?.isBlocked
        ? "Attribute changes are not saved yet. Use Save All."
        : isDirty ? "Save this variant" : "No changes to save";

    return (
        <tr className="bg-white shadow-sm outline outline-brand-subtext/20">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <VariantSwatch title={variant.title} image={swatchImage} />
                    <span className="font-medium text-brand-text">{variant.title}</span>
                </div>
            </td>
            <td className="px-4 py-3">
                <input type="text" value={value.sku} onChange={(e) => edit({ sku: e.target.value })} className="w-32 rounded-md border border-brand-subtext/30 bg-white px-3 py-1.5 text-sm focus:border-brand-primary focus:outline-none" />
            </td>
            <td className="px-4 py-3">
                <input type="number" value={toPriceInput(value.maxRetailPrice)} onChange={(e) => edit({ maxRetailPrice: parsePriceInput(e.target.value) })} className={PRICE_INPUT} />
            </td>
            <td className="px-4 py-3">
                <input type="number" value={toPriceInput(value.sellingPrice)} onChange={(e) => edit({ sellingPrice: parsePriceInput(e.target.value) })} className={PRICE_INPUT} />
            </td>
            <td className="px-4 py-3">
                <DiscountSummary maxRetailPrice={value.maxRetailPrice} sellingPrice={value.sellingPrice} compact />
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <StatusToggle
                    checked={value.inStock}
                    onChange={() => edit({ inStock: !value.inStock })}
                    label={value.inStock ? "In Stock" : "Out of Stock"}
                    title="Switching In Stock on switches Prebook off"
                />
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <StatusToggle
                    checked={value.isPrebook}
                    onChange={() => edit({ isPrebook: !value.isPrebook })}
                    label={value.isPrebook ? "Enabled" : "Disabled"}
                    title="Switching Prebook on switches In Stock off"
                />
            </td>
            {rowSave && (
                <td className="px-4 py-3">
                    <button
                        type="button"
                        onClick={() => rowSave.onSave(variant, value)}
                        disabled={!isDirty || rowSave.isBlocked}
                        title={saveTitle}
                        className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-600"
                    >
                        <Save className="h-3.5 w-3.5" /> Save
                    </button>
                </td>
            )}
        </tr>
    );
});

VariantTableRow.displayName = "VariantTableRow";
