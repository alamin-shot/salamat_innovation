import * as React from "react";
import { BarcodeFormDropdown } from "@/components/features/barcodes-pages/shared/BarcodeFormDropdown";
import { BARCODE_LOCATIONS } from "@/constants/barcodes";
import { PurchaseLocation } from "@/types/purchases";

const LOCATION_OPTIONS = BARCODE_LOCATIONS.map((location) => ({ value: location, label: location }));

const isLocation = (value: string): value is PurchaseLocation =>
    BARCODE_LOCATIONS.some((location) => location === value);

interface PurchaseLocationFieldProps {
    value: PurchaseLocation | null;
    onChange: (location: PurchaseLocation) => void;
}

/** Required Location, the same dropdown and list the Barcodes module uses. */
export function PurchaseLocationField({ value, onChange }: PurchaseLocationFieldProps) {
    return (
        <BarcodeFormDropdown
            label="Location"
            required
            placeholder="Choose a location"
            value={value ?? ""}
            options={LOCATION_OPTIONS}
            onChange={(next) => {
                if (isLocation(next)) {
                    onChange(next);
                }
            }}
        />
    );
}
