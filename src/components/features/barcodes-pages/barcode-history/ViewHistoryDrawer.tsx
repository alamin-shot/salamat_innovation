"use client";
import * as React from "react";
import Image from "next/image";
import { X, Eye, Box, Tag, User, Clock, ArrowRightLeft } from "lucide-react";

export function ViewHistoryDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    if (!id && !isOpen) return null;

    return (
        <>
            {/* Animated Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Animated Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full md:left-64 lg:left-[280px] bg-white shadow-2xl border-l border-brand-subtext/20 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-brand-subtext/20 bg-brand-bg/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-brand-text">Audit Log Details</h2>
                            <p className="text-xs text-brand-subtext">Record ID: {id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-subtext hover:bg-white hover:text-brand-text hover:shadow-sm transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="mx-auto max-w-3xl flex flex-col gap-6">

                        {/* Status Hero */}
                        <div className="rounded-xl border border-brand-subtext/20 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
                            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-brand-subtext/15 bg-brand-bg/30">
                                <Image src="/phone.png" alt="Product" fill className="object-contain p-3" />
                            </div>
                            <div className="flex flex-col gap-2 text-center md:text-left flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between w-full">
                                    <h3 className="text-xl font-bold text-brand-text">Redmi 15</h3>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 w-max mx-auto md:mx-0">
                                        <ArrowRightLeft className="h-3 w-3" /> Sale Transaction
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600">
                                    Midnight Black/8GB/256GB
                                </span>
                                <p className="text-sm font-mono text-brand-subtext mt-1">
                                    S/N: 865013000353040
                                </p>
                            </div>
                        </div>

                        {/* Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg border border-brand-subtext/15 bg-brand-bg/30 p-4 flex items-start gap-3">
                                <Tag className="h-5 w-5 text-brand-subtext mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-brand-subtext">Transaction Pricing</span>
                                    <span className="text-sm font-bold text-brand-text">Sale: ৳ 25,500.00</span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-brand-subtext/15 bg-brand-bg/30 p-4 flex items-start gap-3">
                                <User className="h-5 w-5 text-brand-subtext mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-brand-subtext">Entity Details</span>
                                    <span className="text-sm font-bold text-brand-text">Mintu Talukder</span>
                                    <span className="text-xs text-blue-600 font-medium">Customer</span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-brand-subtext/15 bg-brand-bg/30 p-4 flex items-start gap-3">
                                <Box className="h-5 w-5 text-brand-subtext mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-brand-subtext">Warehouse Location</span>
                                    <span className="text-sm font-bold text-brand-text">A-Block</span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-brand-subtext/15 bg-brand-bg/30 p-4 flex items-start gap-3">
                                <Clock className="h-5 w-5 text-brand-subtext mt-0.5" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-brand-subtext">Timestamp</span>
                                    <span className="text-sm font-medium text-brand-text">10/4/2026, 2:40:13 PM</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}