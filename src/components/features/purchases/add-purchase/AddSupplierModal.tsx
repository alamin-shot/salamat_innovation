"use client";
import * as React from "react";
import { X, ImageIcon } from "lucide-react";

export function AddSupplierModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

            <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between border-b border-brand-subtext/20 px-6 py-4">
                    <h2 className="text-lg font-bold text-brand-text">Add Supplier</h2>
                    <button onClick={onClose} className="rounded-full p-1.5 text-brand-subtext hover:bg-brand-bg hover:text-brand-text transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <form className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Supplier Name *</label>
                                <input type="text" placeholder="Name" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Business Name *</label>
                                <input type="text" placeholder="Business Name" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Phone *</label>
                                <input type="tel" placeholder="Phone" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Secondary Phone</label>
                                <input type="tel" placeholder="Secondary Phone" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Email</label>
                                <input type="email" placeholder="Email" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Profile Picture</label>
                                <div className="flex items-center gap-4 rounded-md border border-dashed border-brand-subtext/30 bg-brand-bg/10 p-3">
                                    <ImageIcon className="h-8 w-8 text-brand-subtext" />
                                    <div className="flex flex-col text-[11px] text-brand-subtext">
                                        <span>Recommended size 800x600</span>
                                        <span>Max file size: 2MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-brand-subtext">Business Logo</label>
                                <div className="flex items-center gap-4 rounded-md border border-dashed border-brand-subtext/30 bg-brand-bg/10 p-3">
                                    <ImageIcon className="h-8 w-8 text-brand-subtext" />
                                    <div className="flex flex-col text-[11px] text-brand-subtext">
                                        <span>Recommended size 800x600</span>
                                        <span>Max file size: 2MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-brand-text mb-4 border-b border-brand-subtext/20 pb-2">Address *</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <select className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-brand-subtext"><option>Choose a Country</option></select>
                                <select className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-brand-subtext"><option>Select District</option></select>
                                <select className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-brand-subtext"><option>Select Area</option></select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Enter Thana" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Enter Postal Code" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                                <input type="text" placeholder="Enter Your Street Address" className="w-full rounded-md border border-brand-subtext/30 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-brand-subtext/20 px-6 py-4 bg-brand-bg/30 rounded-b-xl">
                    <button onClick={onClose} className="rounded-md border border-brand-subtext/30 bg-white px-6 py-2 text-sm font-bold text-brand-text hover:bg-brand-bg transition-colors">Cancel</button>
                    <button onClick={onClose} className="rounded-md bg-emerald-600 px-8 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm">Save</button>
                </div>
            </div>
        </div>
    );
}