"use client";
import * as React from "react";
import Image from "next/image";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Barcode, BarcodeEditInput, BarcodeLocation } from "@/types/barcodes";
import { BARCODE_LOCATIONS } from "@/constants/barcodes";
import { parsePriceInput } from "@/utils/productRules";
import { BarcodeStatusBadge } from "./BarcodeStatusBadge";

interface BarcodeEditFormProps {
    barcode: Barcode;
    /** False once the barcode is received: location then changes only through a transfer. */
    canEditLocation: boolean;
    onSubmit: (changes: BarcodeEditInput) => void;
    onCancel: () => void;
}

const LOCATION_OPTIONS = [...BARCODE_LOCATIONS];

const isLocation = (value: string): value is BarcodeLocation => BARCODE_LOCATIONS.some((location) => location === value);

export function BarcodeEditForm({ barcode, canEditLocation, onSubmit, onCancel }: BarcodeEditFormProps) {
    const [mrp, setMrp] = React.useState(barcode.mrp === null ? "" : String(barcode.mrp));
    const [location, setLocation] = React.useState<BarcodeLocation>(barcode.currentLocation);

    const handleLocationChange = (value: string) => {
        if (isLocation(value)) {
            setLocation(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedMrp = parsePriceInput(mrp);
        if (parsedMrp === null || parsedMrp < 0) {
            toast.error("Enter a valid MRP.");
            return;
        }
        const changes: BarcodeEditInput = { mrp: parsedMrp };
        if (canEditLocation) {
            changes.currentLocation = location;
        }
        onSubmit(changes);
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-32">
            <div className="rounded-xl border border-brand-subtext/20 bg-brand-bg/30 p-5 flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-subtext/15 bg-white">
                    {barcode.image && <Image src={barcode.image} alt={barcode.productName} fill sizes="64px" className="object-contain p-2" />}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-sm font-bold text-brand-text">{barcode.productName}</span>
                    <span className="text-xs font-semibold text-emerald-600">{barcode.variant}</span>
                    <span className="text-xs font-mono text-brand-subtext mt-1 break-all">S/N: {barcode.serialNumber}</span>
                    <BarcodeStatusBadge status={barcode.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext tracking-wider">
                        MRP (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext tracking-wider">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <CustomSelect
                        value={location}
                        onChange={handleLocationChange}
                        options={LOCATION_OPTIONS}
                        disabled={!canEditLocation}
                        triggerClassName="h-[42px]"
                    />
                    {!canEditLocation && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                            <Lock className="h-3 w-3" /> Already {barcode.status}: location changes through a stock transfer.
                        </p>
                    )}
                </div>
            </div>

            <p className="text-xs text-brand-subtext">Every changed field is recorded in the Barcode Journey with its old and new value.</p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-subtext/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save Changes
                </button>
            </div>
        </form>
    );
}
