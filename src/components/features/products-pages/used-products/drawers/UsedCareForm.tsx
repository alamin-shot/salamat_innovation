"use client";
import * as React from "react";
import { Save, Trash2 } from "lucide-react";
import { UsedProduct, UsedProductInput } from "@/types/products";
import { useProductCareOptions } from "@/hooks/products_hooks/useProductCatalogOptions";
import { CarePlanSelect } from "../../shared/CarePlanSelect";

interface UsedCareFormProps {
    product: UsedProduct;
    onSubmit: (updates: Partial<UsedProductInput>) => void;
}

/** Label stored on a used product that has no care plan. */
const NO_CARE_PLAN = "None";

export function UsedCareForm({ product, onSubmit }: UsedCareFormProps) {
    const careOptions = useProductCareOptions();
    const [selectedCare, setSelectedCare] = React.useState<string>(product.carePlan === NO_CARE_PLAN ? "" : product.carePlan);

    const handleSave = () => {
        onSubmit({ carePlan: selectedCare || NO_CARE_PLAN });
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 pb-32 min-h-[300px]">
            <CarePlanSelect
                options={careOptions}
                selectedLabel={selectedCare}
                isSelected={(option) => option.label === selectedCare}
                onSelect={(option) => setSelectedCare(option.label)}
            />

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-brand-subtext/10 mt-auto">
                <button
                    onClick={() => setSelectedCare("")}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Remove Care"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save
                </button>
            </div>
        </div>
    );
}
