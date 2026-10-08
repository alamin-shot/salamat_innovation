import * as React from "react";
import { FormInput } from "@/components/ui/forms/FormInput";

interface WarrantyModalProps {
    isEditMode: boolean;
    setIsEditMode: (val: boolean) => void;
    productId: string;
}

export function WarrantyModal({ isEditMode, setIsEditMode, productId }: WarrantyModalProps) {
    // Mock Data
    const [data, setData] = React.useState({
        purchasePoint: "Official Store",
        warrantyDay: "365",
        warrantyText: "1 Year Official Brand Warranty",
        serviceWarranty: "1 Year Free Servicing (Parts excluded)"
    });

    if (!isEditMode) {
        return (
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-brand-bg/50 p-3">
                        <p className="text-xs font-medium text-brand-subtext mb-1">Purchase Point</p>
                        <p className="text-sm font-semibold text-brand-text">{data.purchasePoint}</p>
                    </div>
                    <div className="rounded-lg bg-brand-bg/50 p-3">
                        <p className="text-xs font-medium text-brand-subtext mb-1">Warranty Days</p>
                        <p className="text-sm font-semibold text-brand-text">{data.warrantyDay} Days</p>
                    </div>
                </div>
                <div className="rounded-lg bg-brand-bg/50 p-3">
                    <p className="text-xs font-medium text-brand-subtext mb-1">Warranty Text</p>
                    <p className="text-sm font-semibold text-brand-text">{data.warrantyText}</p>
                </div>
                <div className="rounded-lg bg-brand-bg/50 p-3">
                    <p className="text-xs font-medium text-brand-subtext mb-1">Service Warranty</p>
                    <p className="text-sm font-semibold text-brand-text">{data.serviceWarranty}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    label="Purchase Point"
                    value={data.purchasePoint}
                    onChange={(e) => setData({ ...data, purchasePoint: e.target.value })}
                />
                <FormInput
                    label="Warranty Days"
                    type="number"
                    value={data.warrantyDay}
                    onChange={(e) => setData({ ...data, warrantyDay: e.target.value })}
                />
            </div>
            <FormInput
                label="Warranty Text"
                value={data.warrantyText}
                onChange={(e) => setData({ ...data, warrantyText: e.target.value })}
            />
            <FormInput
                label="Service Warranty"
                value={data.serviceWarranty}
                onChange={(e) => setData({ ...data, serviceWarranty: e.target.value })}
            />

            <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => setIsEditMode(false)} className="px-4 py-2 text-sm font-medium text-brand-subtext hover:text-brand-text">
                    Cancel
                </button>
                <button onClick={() => setIsEditMode(false)} className="rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-white">
                    Save Changes
                </button>
            </div>
        </div>
    );
}