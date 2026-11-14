"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";
import { useSettingsDraft } from "@/hooks/settings_hooks/useSettingsDraft";
import { SettingsDraftFooter } from "../components/SettingsDraftFooter";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ArrowLeft, Building2, UploadCloud, CheckCircle2, AlertTriangle, Paintbrush } from "lucide-react";

const CURRENCY_OPTIONS = [{ label: "৳ (BDT)", value: "BDT" }, { label: "$ (USD)", value: "USD" }, { label: "€ (EUR)", value: "EUR" }, { label: "£ (GBP)", value: "GBP" }];

export function GeneralSettingsView() {
    const store = useGlobalSettingsStore();
    const [isMounted, setIsMounted] = useState(false);

    const { formData, setFormData, isDirty, isValid, resetDraft } = useSettingsDraft(
        store.generalConfig, ["companyName", "email", "currency"]
    );

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const handleSave = () => { store.updateGeneralConfig(formData); resetDraft(); };

    return (
        <div className="flex flex-col w-full rounded-xl border border-brand-subtext/15 bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">General & Localization</h1>
                    <p className="text-xs text-gray-500 mt-1">Configure global company details, currency, and brand formats.</p>
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 pb-32">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">

                    {/* Maintenance Mode (Enterprise Upgrade) */}
                    <div className={`erp-card p-6 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${formData.maintenanceMode ? "bg-rose-50 border-rose-200" : "bg-white border-gray-200"}`}>
                        <div className="flex gap-4 items-start sm:items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${formData.maintenanceMode ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-500"}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className={`text-sm font-black ${formData.maintenanceMode ? "text-rose-900" : "text-gray-900"}`}>System Maintenance Mode</h3>
                                <p className={`text-xs font-medium ${formData.maintenanceMode ? "text-rose-700" : "text-gray-500"}`}>When active, all non-admin employees are locked out of the ERP.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={formData.maintenanceMode} onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                        </label>
                    </div>

                    {/* Company Profile (Existing) */}
                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-5">
                        <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">Company Profile</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="erp-label">Company Name <span className="text-rose-500">*</span></label>
                                <input type="text" className="erp-input font-bold" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Tax / VAT Registration Number</label>
                                <input type="text" className="erp-input font-mono text-xs uppercase" placeholder="e.g. BIN-123456789" value={formData.taxNumber} onChange={e => setFormData({ ...formData, taxNumber: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Default Tax Rate (%)</label>
                                <input type="number" className="erp-input" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })} />
                            </div>
                        </div>
                    </div>

                    {/* Localization & Formatting (Phase 1 Completed) */}
                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-6">
                        <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">Localization & Formatting</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Base Currency <span className="text-rose-500">*</span></label>
                                <CustomSelect value={formData.currency} onChange={val => setFormData({ ...formData, currency: val as any })} options={CURRENCY_OPTIONS} placeholder="Select global currency" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label">Currency Position</label>
                                <CustomSelect
                                    value={formData.currencyPosition}
                                    onChange={val => setFormData({ ...formData, currencyPosition: val as any })}
                                    options={[{ label: "Left ($100)", value: "left" }, { label: "Left with space ($ 100)", value: "left_space" }, { label: "Right (100$)", value: "right" }, { label: "Right with space (100 $)", value: "right_space" }]}
                                    placeholder="Select format"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="erp-label">Decimal Separator</label>
                                <div className="flex gap-2">
                                    {[{ val: "dot", label: "Dot (.)" }, { val: "comma", label: "Comma (,)" }].map(opt => (
                                        <button key={opt.val} onClick={() => setFormData({ ...formData, decimalSeparator: opt.val as any })} className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${formData.decimalSeparator === opt.val ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="erp-label">Thousand Separator</label>
                                <div className="flex gap-2">
                                    {[{ val: "comma", label: "Comma (,)" }, { val: "dot", label: "Dot (.)" }, { val: "space", label: "Space ( )" }].map(opt => (
                                        <button key={opt.val} onClick={() => setFormData({ ...formData, thousandSeparator: opt.val as any })} className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${formData.thousandSeparator === opt.val ? "bg-brand-primary/10 border-brand-primary text-brand-primary" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand Assets (Phase 2 Enhancement) */}
                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-5">
                        <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">Brand Identity</h3>
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="erp-label flex items-center gap-1"><Paintbrush className="w-3.5 h-3.5" /> Primary Brand Color</label>
                                <div className="flex items-center gap-3 mt-1">
                                    <input type="color" className="w-10 h-10 rounded cursor-pointer border-0 p-0" value={formData.brandColor} onChange={e => setFormData({ ...formData, brandColor: e.target.value })} />
                                    <input type="text" className="erp-input font-mono text-xs w-24" value={formData.brandColor} onChange={e => setFormData({ ...formData, brandColor: e.target.value })} />
                                </div>
                                <span className="text-[10px] text-gray-500 max-w-[200px]">Used dynamically for accents on generated invoices and UI highlights.</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="erp-label">Company Logo</label>
                                <button className="w-32 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors">
                                    <UploadCloud className="w-5 h-5 mb-1" />
                                    <span className="text-[9px] font-bold uppercase">Upload PNG</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SettingsDraftFooter isDirty={isDirty} isValid={isValid} onSave={handleSave} onDiscard={resetDraft} />
        </div>
    );
}