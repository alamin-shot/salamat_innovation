"use client";
import { ShieldCheck, Tag, Globe, Package } from "lucide-react";

interface ProductPreviewContentProps {
    productId: string | null;
}

export function ProductPreviewContent({ productId }: ProductPreviewContentProps) {

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Visual Header Banner */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-bg/60 p-8 border border-brand-subtext/10">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-white shadow-md border border-brand-subtext/10 mb-4">
                    <Package className="h-10 w-10 text-brand-primary" />
                </div>
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 mb-2">
                    Active Storefront Item
                </span>
                <h2 className="text-xl font-bold text-brand-text text-center">vivo S2 (ID: {productId})</h2>
                <p className="text-sm text-brand-subtext text-center mt-1">Smart Phones • VIVO</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider mb-1">Base Price</p>
                    <p className="text-lg font-bold text-brand-text">$499.00</p>
                </div>
                <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider mb-1">Stock Status</p>
                    <p className="text-lg font-bold text-green-600">In Stock (45)</p>
                </div>
            </div>

            {/* Badges & Tags Section */}
            <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm flex flex-col gap-3">
                <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Applied Tags & Flags</p>
                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <Tag className="h-3 w-3" /> Featured
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        <Globe className="h-3 w-3" /> Official
                    </span>
                </div>
            </div>

            {/* Warranty & Care Summary */}
            <div className="rounded-xl border border-brand-subtext/10 bg-white p-4 shadow-sm flex flex-col gap-3">
                <p className="text-xs font-semibold text-brand-subtext uppercase tracking-wider">Warranty & Support</p>
                <div className="flex items-center gap-2 text-sm text-brand-text font-medium">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span>1 Year Official Brand Warranty (365 Days)</span>
                </div>
            </div>
        </div>
    );
}