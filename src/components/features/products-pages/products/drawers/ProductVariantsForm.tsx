"use client";
import * as React from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Product, ProductVariant, ProductVariantOption } from "@/types/products";
import { hasVariantPriceAboveMrp } from "@/utils/productRules";
import { VariantsManager } from "../VariantsManager";

interface ProductVariantsFormProps {
    product: Product;
    onSubmit: (options: ProductVariantOption[], variants: ProductVariant[]) => void;
}

export function ProductVariantsForm({ product, onSubmit }: ProductVariantsFormProps) {
    const [options, setOptions] = React.useState<ProductVariantOption[]>(product.variantOptions);
    const [variants, setVariants] = React.useState<ProductVariant[]>(product.variants);

    const handleSave = () => {
        if (hasVariantPriceAboveMrp(variants)) {
            toast.error("A variant's Selling Price is higher than its MRP.");
            return;
        }
        onSubmit(options, variants);
    };

    return (
        <div className="flex w-full flex-col gap-6 pb-32">
            <VariantsManager
                options={options}
                variants={variants}
                onChange={(nextOptions, nextVariants) => {
                    setOptions(nextOptions);
                    setVariants(nextVariants);
                }}
            />
            <div className="flex justify-end border-t border-brand-subtext/10 pt-4">
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save Variants
                </button>
            </div>
        </div>
    );
}
