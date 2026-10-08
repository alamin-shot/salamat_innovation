"use client";
import * as React from "react";
import Image from "next/image";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface UpdatePriceModalProps {
    productId: string;
}

export function UpdatePriceModal({ productId }: UpdatePriceModalProps) {
    const [price, setPrice] = React.useState("53990.00");
    const [discountType, setDiscountType] = React.useState("Fixed");
    const [discountAmount, setDiscountAmount] = React.useState("0.00");
    const [boxAvailable, setBoxAvailable] = React.useState(false);

    const handleSave = () => {
        toast.success("Price updated successfully.");
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Product Summary Header Card */}
            <div className="flex items-center gap-4 rounded-xl border border-brand-subtext/10 bg-brand-bg/50 p-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-brand-subtext/20 bg-white shrink-0">
                    <Image src="https://placehold.co/100x100/e2e8f0/64748b?text=Phone" alt="Product" fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold text-brand-text">iPhone 13 Pro</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-brand-text border border-brand-subtext/20">128GB</span>
                        <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-brand-text border border-brand-subtext/20">Gold</span>
                    </div>
                </div>
            </div>

            {/* Inputs Grid matching your layout */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Discount Type</label>
                    <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                        <option value="Fixed">Fixed</option>
                        <option value="Percentage">Percentage</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Discount Amount</label>
                    <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Price <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-subtext uppercase tracking-wider">Box Available</label>
                    <div className="flex items-center gap-3 h-[38px]">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={boxAvailable}
                                onChange={(e) => setBoxAvailable(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-brand-subtext/30 peer-checked:bg-emerald-500 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full relative"></div>
                            <span className="text-xs font-semibold text-brand-text">{boxAvailable ? "With Box" : "Without Box"}</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-brand-subtext/10">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                    <Save className="h-4 w-4" /> Save Price
                </button>
            </div>
        </div>
    );
}