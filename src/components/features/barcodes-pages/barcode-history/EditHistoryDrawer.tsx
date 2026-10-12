"use client";
import * as React from "react";
import Image from "next/image";
import { X, Save, Edit3 } from "lucide-react";

export function EditHistoryDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    // Mock local state for interactive form feel
    const [warehouse, setWarehouse] = React.useState("A-Block");
    const [salePrice, setSalePrice] = React.useState("25500");
    const [entityName, setEntityName] = React.useState("Mintu Talukder");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
    };

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
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-brand-text">Edit History Log</h2>
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
                    <form id="edit-history-form" onSubmit={handleSave} className="mx-auto max-w-3xl flex flex-col gap-6">
                        {/* Read-Only Identity Card */}
                        <div className="rounded-xl border border-brand-subtext/20 bg-brand-bg/30 p-5 flex items-start gap-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-subtext/15 bg-white">
                                <Image src="/phone.png" alt="Product" fill className="object-contain p-2" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-brand-text">Redmi 15</span>
                                <span className="text-xs font-semibold text-emerald-600">Midnight Black/8GB/256GB</span>
                                <span className="text-xs font-mono text-brand-subtext mt-1">S/N: 865013000353040</span>
                            </div>
                        </div>

                        {/* Editable Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                                    Entity Name (Customer/Supplier) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={entityName}
                                    onChange={(e) => setEntityName(e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                                    Warehouse <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={warehouse}
                                    onChange={(e) => setWarehouse(e.target.value)}
                                    className="w-full appearance-none rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                    <option value="A-Block">A-Block</option>
                                    <option value="B-Block">B-Block</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext tracking-wider">
                                    Sale Price (৳)
                                </label>
                                <input
                                    type="number"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    className="w-full rounded-md border border-brand-subtext/30 bg-white px-3 py-2.5 text-sm text-brand-text focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-brand-subtext/20 bg-brand-bg/30 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-md border border-brand-subtext/30 bg-white px-5 py-2 text-sm font-bold text-brand-text hover:bg-brand-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-history-form"
                        className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        Save Record
                    </button>
                </div>
            </div>
        </>
    );
}