"use client";
import Image from "next/image";
import { ShieldCheck, Tag, Package } from "lucide-react";
import { Product } from "@/types/products";
import { useWarrantyCareTextOptions } from "@/hooks/products_hooks/useProductCatalogOptions";
import { formatTaka } from "@/utils/productRules";

interface ProductPreviewContentProps {
    product: Product | null;
}

export function ProductPreviewContent({ product }: ProductPreviewContentProps) {
    const { findText } = useWarrantyCareTextOptions();

    if (!product) {
        return null;
    }

    const prices = product.variants
        .map((variant) => variant.sellingPrice)
        .filter((price): price is number => price !== null);
    const basePrice = prices.length > 0 ? formatTaka(Math.min(...prices)) : "—";
    const inStockCount = product.variants.filter((variant) => variant.inStock).length;
    const warrantyText = findText(product.warranty.warrantyCareTextId)?.text;
    const isActive = product.status === "Active";

    return (
        <div className="flex flex-col gap-2 p-6">
            {/* Visual Header Banner */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-bg/60 p-8 border border-brand-subtext/10">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md border border-brand-subtext/10 mb-4">
                    {product.image ? (
                        <Image src={product.image} alt={product.name} fill sizes="96px" className="object-contain p-2" />
                    ) : (
                        <Package className="h-10 w-10 text-brand-primary" />
                    )}
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset mb-2 ${isActive ? "bg-green-500/10 text-green-700 ring-green-600/20" : "bg-red-500/10 text-red-700 ring-red-600/20"}`}>
                    {isActive ? "Active Storefront Item" : "Inactive Item"}
                </span>
                <h2 className="text-xl font-bold text-brand-text text-center">{product.name}</h2>
                <p className="text-sm text-brand-subtext text-center mt-1">{product.category} • {product.brand}</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider mb-1">Base Price</p>
                    <p className="text-lg font-bold text-brand-text">{basePrice}</p>
                </div>
                <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider mb-1">Stock Status</p>
                    <p className={`text-lg font-bold ${inStockCount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {inStockCount > 0 ? `In Stock (${inStockCount} of ${product.variants.length} variants)` : "Out of Stock"}
                    </p>
                </div>
            </div>

            {/* Badges & Tags Section */}
            <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm flex flex-col gap-3">
                <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Applied Tags & Flags</p>
                <div className="flex flex-wrap gap-2">
                    {product.tags.length === 0 ? (
                        <span className="text-xs text-brand-subtext">No tags applied</span>
                    ) : (
                        product.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium capitalize text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                <Tag className="h-3 w-3" /> {tag.replace(/_/g, " ")}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Warranty & Care Summary */}
            <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm flex flex-col gap-3">
                <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Warranty & Support</p>
                <div className="flex items-center gap-2 text-sm text-brand-text font-medium">
                    <ShieldCheck className={`h-4 w-4 ${product.warrantyActive ? "text-green-600" : "text-brand-subtext"}`} />
                    <span>
                        {product.warrantyActive
                            ? `${warrantyText ?? "No warranty care text selected"}${product.warranty.warrantyDays ? ` (${product.warranty.warrantyDays} Days)` : ""}`
                            : "Warranty is switched off"}
                    </span>
                </div>
                {product.bookingMoneyEnabled && product.bookingMoney !== null && (
                    <p className="text-sm text-brand-text">Booking Money: <span className="font-semibold">{formatTaka(product.bookingMoney)}</span></p>
                )}
            </div>
        </div>
    );
}
