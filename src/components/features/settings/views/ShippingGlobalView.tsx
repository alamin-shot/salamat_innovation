"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";
import { useSettingsDraft } from "@/hooks/settings_hooks/useSettingsDraft";
import { useSettingsManager } from "@/hooks/settings_hooks/useSettingsManager";
import { SettingsDraftFooter } from "../components/SettingsDraftFooter";
import { ArrowLeft, Truck } from "lucide-react";
import { AreaShippingDrawer } from "../drawers/AreaShippingDrawer";
import { AreaShippingTable } from "../tables/AreaShippingTable";

export function ShippingGlobalView() {
    const store = useGlobalSettingsStore();
    const [isMounted, setIsMounted] = useState(false);

    // Draft Hook for the top Flat Rates form
    const { formData, setFormData, isDirty, isValid, resetDraft } = useSettingsDraft(
        { inside: store.deliveryInsideDhaka, outside: store.deliveryOutsideDhaka }, []
    );

    // Manager Hook for the bottom Area Overrides table
    const shippingManager = useSettingsManager("areaShipping");

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const handleSave = () => {
        store.updateDeliveryCharges(formData.inside, formData.outside);
        resetDraft();
    };

    return (
        <div className="flex flex-col w-full rounded-xl border border-brand-subtext/15 bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Shipping & Logistics</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage default delivery rates and configure specific area overrides.</p>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 pb-32 flex flex-col gap-8">

                {/* 1. Flat Delivery Charges Block */}
                <div className="max-w-4xl flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <h2 className="text-base font-black text-gray-900">Default Delivery Charges</h2>
                    </div>
                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-6">
                        <p className="text-xs font-medium text-gray-500 border-b border-gray-100 pb-4">
                            These are the default charges used when an area doesn't have its own shipping charge configured.
                        </p>
                        <div className="flex flex-col gap-5 max-w-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <label className="erp-label">Inside Dhaka City (BDT) <span className="text-rose-500">*</span></label>
                                    <span className="text-[10px] text-gray-400">Flat fee for orders inside Dhaka.</span>
                                </div>
                                <input type="number" className="erp-input w-full sm:w-32 font-bold" value={formData.inside} onChange={e => setFormData({ ...formData, inside: Number(e.target.value) })} />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-100 pt-5">
                                <div className="flex flex-col">
                                    <label className="erp-label">Outside Dhaka City (BDT) <span className="text-rose-500">*</span></label>
                                    <span className="text-[10px] text-gray-400">Flat fee for orders outside Dhaka.</span>
                                </div>
                                <input type="number" className="erp-input w-full sm:w-32 font-bold" value={formData.outside} onChange={e => setFormData({ ...formData, outside: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Area Shipping Overrides Table */}
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col">
                        <h2 className="text-base font-black text-gray-900">Area Shipping Overrides</h2>
                        <p className="text-xs text-gray-500">Set specific delivery charges for precise areas, or waive fees completely.</p>
                    </div>
                    <AreaShippingTable manager={shippingManager} />
                </div>
            </div>

            <SettingsDraftFooter isDirty={isDirty} isValid={isValid} onSave={handleSave} onDiscard={resetDraft} />
            <AreaShippingDrawer manager={shippingManager} />
        </div>
    );
}