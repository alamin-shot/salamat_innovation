"use client";
import * as React from "react";
import { Save } from "lucide-react";
import { FormInput } from "@/components/ui/forms/FormInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Product, ProductInput } from "@/types/products";
import { useWarrantyCareTextOptions } from "@/hooks/products_hooks/useProductCatalogOptions";
import { parsePriceInput, toPriceInput } from "@/utils/productRules";
import { StatusToggle } from "../../shared/StatusToggle";

interface WarrantyDetailsFormProps {
    product: Product;
    onSubmit: (updates: Partial<ProductInput>) => void;
}

const NO_TEXT = "";

export function WarrantyDetailsForm({ product, onSubmit }: WarrantyDetailsFormProps) {
    const { activeTexts, findText } = useWarrantyCareTextOptions();

    const [warrantyActive, setWarrantyActive] = React.useState(product.warrantyActive);
    const [bookingMoneyEnabled, setBookingMoneyEnabled] = React.useState(product.bookingMoneyEnabled);
    const [bookingMoney, setBookingMoney] = React.useState(toPriceInput(product.bookingMoney));
    const [purchasePoint, setPurchasePoint] = React.useState(product.warranty.purchasePoint);
    const [warrantyDays, setWarrantyDays] = React.useState(toPriceInput(product.warranty.warrantyDays));
    const [warrantyCareTextId, setWarrantyCareTextId] = React.useState(product.warranty.warrantyCareTextId ?? NO_TEXT);
    const [serviceWarranty, setServiceWarranty] = React.useState(product.warranty.serviceWarranty);

    // The selected text stays listed even if it has since been deactivated.
    const selectedText = findText(warrantyCareTextId || null);
    const textOptions = [
        { value: NO_TEXT, label: "None" },
        ...activeTexts.map((item) => ({ value: item.id, label: item.text })),
        ...(selectedText && selectedText.status !== "Active" ? [{ value: selectedText.id, label: `${selectedText.text} (Inactive)` }] : []),
    ];

    const handleSave = () => {
        onSubmit({
            warrantyActive,
            bookingMoneyEnabled,
            bookingMoney: bookingMoneyEnabled ? parsePriceInput(bookingMoney) : product.bookingMoney,
            warranty: {
                purchasePoint: purchasePoint.trim(),
                warrantyDays: parsePriceInput(warrantyDays),
                warrantyCareTextId: warrantyCareTextId || null,
                serviceWarranty: serviceWarranty.trim(),
            },
        });
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32">
            {/* On/Off controls */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4">
                    <span className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Warranty Status</span>
                    <StatusToggle checked={warrantyActive} onChange={() => setWarrantyActive(!warrantyActive)} label={warrantyActive ? "On" : "Off"} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-brand-subtext/10 bg-brand-bg/30 p-4">
                    <span className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Booking Money</span>
                    <StatusToggle checked={bookingMoneyEnabled} onChange={() => setBookingMoneyEnabled(!bookingMoneyEnabled)} label={bookingMoneyEnabled ? "On" : "Off"} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                    label="Purchase Point"
                    value={purchasePoint}
                    onChange={(e) => setPurchasePoint(e.target.value)}
                />
                <FormInput
                    label="Warranty Days"
                    type="number"
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(e.target.value)}
                />
                {/* Hidden entirely while Booking Money is off */}
                {bookingMoneyEnabled && (
                    <FormInput
                        label="Booking Money"
                        type="number"
                        value={bookingMoney}
                        onChange={(e) => setBookingMoney(e.target.value)}
                    />
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-text">Warranty Care Text</label>
                <CustomSelect value={warrantyCareTextId} onChange={setWarrantyCareTextId} options={textOptions} placeholder="Choose a warranty care text" />
                <span className="text-xs text-brand-subtext">Texts are managed globally on the Warranty Care Text page.</span>
            </div>

            <FormInput
                label="Service Warranty"
                value={serviceWarranty}
                onChange={(e) => setServiceWarranty(e.target.value)}
            />

            <div className="mt-4 flex justify-end gap-3">
                <button onClick={handleSave} className="flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2 text-sm font-semibold text-white">
                    <Save className="h-4 w-4" /> Save Changes
                </button>
            </div>
        </div>
    );
}
