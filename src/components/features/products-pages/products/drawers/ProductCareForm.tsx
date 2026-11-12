"use client";
import * as React from "react";
import { Save, Trash2 } from "lucide-react";
import { Product } from "@/types/products";
import { useProductCareOptions } from "@/hooks/products_hooks/useProductCatalogOptions";
import { CarePlanSelect } from "../../shared/CarePlanSelect";

interface ProductCareFormProps {
    product: Product;
    onSubmit: (carePlanId: string | null) => void;
}

/** Care plan picker fed from the /admin/care page (replaces the free-text care box). */
export function ProductCareForm({ product, onSubmit }: ProductCareFormProps) {
    const careOptions = useProductCareOptions();
    const [carePlanId, setCarePlanId] = React.useState<string | null>(product.carePlanId);

    const selectedLabel = careOptions.find((option) => option.id === carePlanId)?.label ?? "";

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 pb-32 min-h-[300px]">
            <CarePlanSelect
                options={careOptions}
                selectedLabel={selectedLabel}
                isSelected={(option) => option.id === carePlanId}
                onSelect={(option) => setCarePlanId(option.id)}
            />

            <div className="flex items-center justify-between pt-6 border-t border-brand-subtext/10 mt-auto">
                <button
                    onClick={() => setCarePlanId(null)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Remove Care"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onSubmit(carePlanId)}
                    className="rounded-md bg-brand-primary px-6 py-2 text-sm font-semibold text-white flex items-center gap-2"
                >
                    <Save className="h-4 w-4" /> Save Care Details
                </button>
            </div>
        </div>
    );
}
