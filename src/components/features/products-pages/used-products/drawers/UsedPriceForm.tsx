"use client";
import * as React from "react";
import Image from "next/image";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { UsedProduct, UsedProductInput } from "@/types/products";
import { computeDiscount, parsePriceInput, toPriceInput } from "@/utils/productRules";
import { DiscountSummary } from "../../shared/DiscountSummary";

interface UsedPriceFormProps {
    product: UsedProduct;
    onSubmit: (updates: Partial<UsedProductInput>) => void;
}

const INPUT_CLASS = "w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const LABEL_CLASS = "text-xs font-bold text-brand-subtext uppercase tracking-wider";

export function UsedPriceForm({ product, onSubmit }: UsedPriceFormProps) {
    const [maxRetailPrice, setMaxRetailPrice] = React.useState(toPriceInput(product.maxRetailPrice));
    const [sellingPrice, setSellingPrice] = React.useState(toPriceInput(product.sellingPrice));
    const [boxAvailable, setBoxAvailable] = React.useState(product.boxAvailable);

    const mrp = parsePriceInput(maxRetailPrice);
    const selling = parsePriceInput(sellingPrice);

    const handleSave = () => {
        if (mrp === null || selling === null) {
            toast.error("MRP and Selling Price are required.");
            return;
        }
        if (computeDiscount(mrp, selling).state === "selling_above_mrp") {
            toast.error("Selling Price cannot be higher than MRP.");
            return;
        }
        onSubmit({ maxRetailPrice: mrp, sellingPrice: selling, boxAvailable });
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32">
            {/* Product Summary Header Card */}
            <div className="flex items-center gap-4 rounded-xl border border-brand-subtext/10 bg-brand-bg/50 p-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-brand-subtext/20 bg-white shrink-0">
                    {product.image && <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold text-brand-text">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {product.variant.split("/").map((part) => (
                            <span key={part} className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-brand-text border border-brand-subtext/20">{part.trim()}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Max Retail Price <span className="text-red-500">*</span></label>
                    <input type="number" value={maxRetailPrice} onChange={(e) => setMaxRetailPrice(e.target.value)} className={INPUT_CLASS} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Selling Price <span className="text-red-500">*</span></label>
                    <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className={INPUT_CLASS} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Discount (Auto)</label>
                    <DiscountSummary maxRetailPrice={mrp} sellingPrice={selling} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLASS}>Box Available</label>
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
