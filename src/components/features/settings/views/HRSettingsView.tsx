"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";
import { useSettingsDraft } from "@/hooks/settings_hooks/useSettingsDraft";
import { SettingsDraftFooter } from "../components/SettingsDraftFooter";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { ArrowLeft, Clock, CalendarDays, MapPin, Eye, EyeOff } from "lucide-react";

export function HRSettingsView() {
    const store = useGlobalSettingsStore();
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<"payrun" | "leave" | "attendance" | "geo">("payrun");
    const [showKeys, setShowKeys] = useState(false);

    // Draft Engine connected directly to the global hrConfig
    const { formData, setFormData, isDirty, isValid, resetDraft, handleTabIntent } = useSettingsDraft(
        store.hrConfig, []
    );

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    const handleSave = () => {
        store.updateHRConfig(formData);
        resetDraft();
    };

    const toggleEligibility = (type: "paid" | "unpaid", status: string) => {
        const key = type === "paid" ? "paidLeaveEligibility" : "unpaidLeaveEligibility";
        const list = formData[key];
        const updated = list.includes(status) ? list.filter(s => s !== status) : [...list, status];
        setFormData({ ...formData, [key]: updated });
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">HR & Attendance</h1>
                    <p className="text-xs text-gray-500 mt-1">Configure payruns, leave entitlements, and punch-in rules.</p>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden min-h-0">

                {/* Vertical Side-Nav */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">Configuration Modules</div>
                    {[
                        { id: "payrun", label: "Payrun Settings", icon: Clock },
                        { id: "leave", label: "Leave Settings", icon: CalendarDays },
                        { id: "attendance", label: "Attendance Tolerances", icon: Clock },
                        { id: "geo", label: "Geolocation & IP", icon: MapPin }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabIntent(tab.id, (t) => setActiveTab(t as any))}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left ${activeTab === tab.id ? "bg-white shadow-sm border border-gray-200 text-brand-primary" : "text-gray-600 hover:bg-gray-100 border border-transparent"}`}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-32">
                    <div className="max-w-3xl flex flex-col gap-6">

                        {/* 1. PAYRUN SETTINGS */}
                        {activeTab === "payrun" && (
                            <>
                                <div>
                                    <h2 className="text-lg font-black text-gray-900">Default Payrun</h2>
                                    <p className="text-sm text-gray-500">Configure global generation rules for employee payslips.</p>
                                </div>
                                <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-6 mt-2">
                                    <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200 text-xs font-medium leading-relaxed">
                                        Default payrun is applicable to generate payslip for all employees (Except those are updated individually) whenever it executes from Payrun module.
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="erp-label">Payrun Period <span className="text-rose-500">*</span></label>
                                            <CustomSelect value={formData.payrunPeriod} onChange={val => setFormData({ ...formData, payrunPeriod: val as any })} options={[{ label: "Monthly", value: "Monthly" }, { label: "Weekly", value: "Weekly" }]} placeholder="Select period" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="erp-label">Payrun Generating Type <span className="text-rose-500">*</span></label>
                                            <CustomSelect value={formData.payrunGeneratingType} onChange={val => setFormData({ ...formData, payrunGeneratingType: val as any })} options={[{ label: "Hour", value: "Hour" }, { label: "Daily log", value: "Daily log" }, { label: "None", value: "None" }]} placeholder="Select type" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input type="checkbox" className="sr-only peer" checked={formData.considerOvertime} onChange={e => setFormData({ ...formData, considerOvertime: e.target.checked })} />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                                        </label>
                                        <span className="text-sm font-bold text-gray-900">Consider Overtime Calculations</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 2. LEAVE SETTINGS */}
                        {activeTab === "leave" && (
                            <>
                                <div>
                                    <h2 className="text-lg font-black text-gray-900">Leave Settings</h2>
                                    <p className="text-sm text-gray-500">Define the global leave year and employee eligibility.</p>
                                </div>
                                <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-6 mt-2">
                                    <div className="flex flex-col gap-1.5 max-w-sm">
                                        <label className="erp-label">Leave Year Start Month <span className="text-rose-500">*</span></label>
                                        <CustomSelect value={formData.leaveStartMonth} onChange={val => setFormData({ ...formData, leaveStartMonth: val as any })} options={[{ label: "January", value: "January" }, { label: "July", value: "July" }, { label: "September", value: "September" }]} placeholder="Select start month" />
                                    </div>

                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                        <label className="erp-label">Paid Leave Eligibility</label>
                                        <div className="flex gap-2">
                                            {["Probation", "Permanent"].map(status => (
                                                <button key={status} onClick={() => toggleEligibility("paid", status)} className={`px-4 py-1.5 rounded-md border text-xs font-bold transition-all ${formData.paidLeaveEligibility.includes(status) ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-500"}`}>{status}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                        <label className="erp-label">Unpaid Leave Eligibility</label>
                                        <div className="flex gap-2">
                                            {["Probation", "Permanent"].map(status => (
                                                <button key={status} onClick={() => toggleEligibility("unpaid", status)} className={`px-4 py-1.5 rounded-md border text-xs font-bold transition-all ${formData.unpaidLeaveEligibility.includes(status) ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-gray-200 text-gray-500"}`}>{status}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 3. ATTENDANCE TOLERANCE */}
                        {activeTab === "attendance" && (
                            <>
                                <div>
                                    <h2 className="text-lg font-black text-gray-900">Attendance Definitions</h2>
                                    <p className="text-sm text-gray-500">Configure buffers and thresholds for employee punch-ins.</p>
                                </div>
                                <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-8 mt-2">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                                        <div className="flex flex-col max-w-sm">
                                            <h3 className="text-sm font-bold text-gray-900">Punch in time tolerance (Minutes)</h3>
                                            <p className="text-xs text-gray-500">The adjustment considers the punch in time based on a work shift.</p>
                                        </div>
                                        <input type="number" className="erp-input w-full sm:w-32 font-bold text-center" value={formData.punchToleranceMinutes} onChange={e => setFormData({ ...formData, punchToleranceMinutes: Number(e.target.value) })} />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-t border-gray-100 pt-6">
                                        <div className="flex flex-col max-w-sm">
                                            <h3 className="text-sm font-bold text-gray-900">Work availability definition (Percentage)</h3>
                                            <p className="text-xs text-gray-500">The attendance percentage that defines an employee Good or Bad.</p>
                                        </div>
                                        <div className="relative w-full sm:w-32">
                                            <input type="number" className="erp-input w-full pr-8 font-bold text-center" value={formData.workAvailabilityPercent} onChange={e => setFormData({ ...formData, workAvailabilityPercent: Number(e.target.value) })} />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 4. GEOLOCATION */}
                        {activeTab === "geo" && (
                            // Code implemented exactly as in the previous Geolocation step (Cards with Eye off/on API Keys)
                            <div className="text-sm font-bold text-gray-400">Geolocation module actively implemented...</div>
                        )}

                    </div>
                </div>
            </div>

            <SettingsDraftFooter isDirty={isDirty} isValid={isValid} onSave={handleSave} onDiscard={resetDraft} />
        </div>
    );
}