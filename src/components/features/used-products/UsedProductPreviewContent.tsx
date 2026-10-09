"use client";
import * as React from "react";
import Image from "next/image";
import { Battery, Box, ShieldCheck, Hash, Smartphone } from "lucide-react";

interface UsedProductPreviewContentProps {
    productId?: string | null;
}

export function UsedProductPreviewContent({ productId }: UsedProductPreviewContentProps) {

    const product = {
        name: "iPhone 13 Pro",
        variant: "128GB / Gold",
        price: 53990.00,
        batteryHealth: "90%",
        serialNumber: "359052378710667",
        boxAvailable: "No",
        warranty: "1 Year Official Service",
    };

    return (
        <div className="flex h-full flex-col bg-brand-bg/30">
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-sm border border-brand-subtext/20 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Gallery Mock */}
                        <div className="bg-brand-bg/50 p-8 flex items-center justify-center border-r border-brand-subtext/10">
                            <div className="relative h-72 w-72 sm:h-96 sm:w-96 rounded-xl overflow-hidden shadow-lg border border-brand-subtext/20 bg-white">
                                <Image src="https://placehold.co/800x800/e2e8f0/64748b?text=Pre-Owned+Device" alt="Product" fill className="object-cover" />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-8 flex flex-col">
                            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 mb-4">
                                <Smartphone className="h-3.5 w-3.5" /> Pre-Owned Device
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-2">{product.name}</h1>
                            <p className="text-sm font-medium text-brand-subtext mb-6">Variant: {product.variant}</p>

                            <div className="text-3xl font-black text-emerald-600 mb-8">
                                ৳ {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>

                            {/* Specific Used Product Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-subtext/20 bg-brand-bg/40">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-subtext/10 text-emerald-600">
                                        <Battery className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider">Battery Health</span>
                                        <span className="text-sm font-bold text-brand-text">{product.batteryHealth}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-subtext/20 bg-brand-bg/40">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-subtext/10 text-brand-primary">
                                        <Box className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider">Box Available</span>
                                        <span className="text-sm font-bold text-brand-text">{product.boxAvailable}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-subtext/20 bg-brand-bg/40">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-subtext/10 text-brand-text">
                                        <Hash className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider">Serial Number</span>
                                        <span className="text-xs font-mono font-bold text-brand-text mt-0.5">{product.serialNumber}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-subtext/20 bg-brand-bg/40">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-brand-subtext/10 text-pink-600">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-brand-subtext uppercase tracking-wider">Warranty</span>
                                        <span className="text-sm font-bold text-brand-text truncate">{product.warranty}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}