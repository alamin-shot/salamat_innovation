import * as React from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { OperationsShop } from "@/types/operations";
import { OPERATIONS_SHOPS } from "@/constants/operations";
import { isOperationsShop } from "@/utils/operationsRules";

interface ShopSelectFieldProps {
    label: string;
    value: OperationsShop | null;
    onChange: (shop: OperationsShop) => void;
}

/** Required shop dropdown shared by the Operations create forms. */
export function ShopSelectField({ label, value, onChange }: ShopSelectFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-gray-500 font-medium">{label} <span className="text-red-500">*</span></label>
            <CustomSelect
                value={value ?? ""}
                onChange={(next) => { if (isOperationsShop(next)) onChange(next); }}
                options={[...OPERATIONS_SHOPS]}
                placeholder={`Select ${label}`}
            />
        </div>
    );
}
