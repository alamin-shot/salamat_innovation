import * as React from "react";
import { useStore } from "zustand";
import { ProductVariant, ProductVariantOption, VariantDraftStore, VariantRowSaveConfig } from "@/types/products";
import { variantSwatchImage } from "@/utils/productRules";
import { VariantTableRow } from "./VariantTableRow";

interface VariantInlineTableProps {
    options: ProductVariantOption[];
    /** Saved values of each row. */
    rows: ProductVariant[];
    drafts: VariantDraftStore;
    rowSave?: VariantRowSaveConfig;
}

export function VariantInlineTable({ options, rows, drafts, rowSave }: VariantInlineTableProps) {
    // A boolean selector: the table re-renders only when "every row in stock" flips, not per keystroke.
    const allInStock = useStore(drafts, (state) => rows.length > 0 && rows.every((row) => (state.drafts[row.id] ?? row).inStock));

    const swatchById = React.useMemo(
        () => new Map(rows.map((row) => [row.id, variantSwatchImage(options, row.title)])),
        [options, rows]
    );

    return (
        <>
            <label className="flex cursor-pointer items-center gap-2 mb-4" title="Mark every variant in stock">
                <input
                    type="checkbox"
                    checked={allInStock}
                    onChange={(e) => drafts.getState().setAllInStock(rows, e.target.checked)}
                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-sm font-medium text-brand-text">Select All</span>
            </label>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <table className="w-full min-w-260 border-separate border-spacing-y-3 text-sm">
                    <thead>
                        <tr className="text-left text-xs font-bold text-brand-subtext uppercase tracking-wider bg-brand-bg/40">
                            <th className="px-4 py-3 rounded-l-xl">VARIANT TITLE</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">MAX RETAIL PRICE</th>
                            <th className="px-4 py-3">SELLING PRICE</th>
                            <th className="px-4 py-3">DISCOUNT (AUTO)</th>
                            <th className="px-4 py-3">IN STOCK</th>
                            <th className={`px-4 py-3 ${rowSave ? "" : "rounded-r-xl"}`}>PREBOOK</th>
                            {rowSave && <th className="px-4 py-3 rounded-r-xl">ACTION</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <VariantTableRow
                                key={row.id}
                                variant={row}
                                swatchImage={swatchById.get(row.id) ?? null}
                                drafts={drafts}
                                rowSave={rowSave}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
