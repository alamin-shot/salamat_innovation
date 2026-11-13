"use client";
import * as React from "react";
import { toast } from "sonner";
import { Product, ProductVariant, ProductVariantEdit, ProductVariantOption, UnsavedChangesHandle, VariantRowSaveConfig } from "@/types/products";
import { areVariantOptionsEqual, hasVariantPriceAboveMrp, mergeVariantDrafts } from "@/utils/productRules";
import { useVariantDrafts } from "@/hooks/products_hooks/useVariantDrafts";
import { VariantsManager } from "../VariantsManager";
import { VariantSaveBar } from "../variants/VariantSaveBar";

interface ProductVariantsFormProps {
    product: Product;
    /** Save All: the attribute builder plus every row. */
    onSubmit: (options: ProductVariantOption[], variants: ProductVariant[]) => void;
    /** Row Save: one existing variant's inline fields. */
    onSaveVariant: (variantId: string, edit: ProductVariantEdit) => void;
    ref?: React.Ref<UnsavedChangesHandle>;
}

const PRICE_ABOVE_MRP = "A variant's Selling Price is higher than its MRP.";

export function ProductVariantsForm({ product, onSubmit, onSaveVariant, ref }: ProductVariantsFormProps) {
    const [options, setOptions] = React.useState<ProductVariantOption[]>(product.variantOptions);
    const [variants, setVariants] = React.useState<ProductVariant[]>(product.variants);
    const drafts = useVariantDrafts();

    // Rows show the latest saved values (a row Save updates the store); rows the builder just created have none yet.
    const savedById = React.useMemo(() => new Map(product.variants.map((variant) => [variant.id, variant])), [product.variants]);
    const rows = React.useMemo(() => variants.map((variant) => savedById.get(variant.id) ?? variant), [variants, savedById]);

    const isBuilderDirty = !areVariantOptionsEqual(options, product.variantOptions)
        || rows.length !== product.variants.length
        || rows.some((row) => !savedById.has(row.id));

    React.useImperativeHandle(ref, () => ({
        hasUnsavedChanges: () => isBuilderDirty || Object.keys(drafts.getState().drafts).length > 0,
    }), [isBuilderDirty, drafts]);

    const handleRowSave = React.useCallback((variant: ProductVariant, edit: ProductVariantEdit) => {
        if (hasVariantPriceAboveMrp([edit])) {
            toast.error(`${variant.title}: Selling Price is higher than its MRP.`);
            return;
        }
        onSaveVariant(variant.id, edit);
        drafts.getState().discardVariant(variant.id);
    }, [onSaveVariant, drafts]);

    const rowSave = React.useMemo<VariantRowSaveConfig>(
        () => ({ isBlocked: isBuilderDirty, onSave: handleRowSave }),
        [isBuilderDirty, handleRowSave]
    );

    const handleSaveAll = () => {
        const merged = mergeVariantDrafts(rows, drafts.getState().drafts);
        if (hasVariantPriceAboveMrp(merged)) {
            toast.error(PRICE_ABOVE_MRP);
            return;
        }
        onSubmit(options, merged);
    };

    return (
        <div className="flex w-full flex-col gap-6 pb-32">
            <VariantsManager
                options={options}
                variants={rows}
                drafts={drafts}
                rowSave={rowSave}
                onChange={(nextOptions, nextVariants) => {
                    setOptions(nextOptions);
                    setVariants(nextVariants);
                }}
            />
            <VariantSaveBar drafts={drafts} isBuilderDirty={isBuilderDirty} onSaveAll={handleSaveAll} />
        </div>
    );
}
