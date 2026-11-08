"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";
import { useSettingsDraft } from "@/hooks/settings_hooks/useSettingsDraft";
import { SettingsDraftFooter } from "../components/SettingsDraftFooter";
import { ArrowLeft, ShieldAlert, Fingerprint, History } from "lucide-react";

export function SecuritySettingsView() {
    const store = useGlobalSettingsStore();
    const [isMounted, setIsMounted] = useState(false);

    const { formData, setFormData, isDirty, isValid, resetDraft } = useSettingsDraft(store.securityConfig, []);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Security & Audit</h1>
                    <p className="text-xs text-gray-500 mt-1">Manage global access policies and session security.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-32">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                    <div className="erp-card bg-white p-6 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4 items-start sm:items-center">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-50 text-rose-600"><Fingerprint className="w-5 h-5" /></div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-black text-gray-900">Enforce Global 2FA</h3>
                                <p className="text-xs font-medium text-gray-500">Require Two-Factor Authentication for all administrative accounts.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={formData.global2FAEnforced} onChange={e => setFormData({ ...formData, global2FAEnforced: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                        </label>
                    </div>

                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-4">
                        <h3 className="text-sm font-black text-gray-900">Session Controls</h3>
                        <div className="flex flex-col gap-1.5 max-w-xs">
                            <label className="erp-label">Idle Session Timeout (Minutes)</label>
                            <input type="number" className="erp-input font-bold" value={formData.sessionTimeoutMinutes} onChange={e => setFormData({ ...formData, sessionTimeoutMinutes: Number(e.target.value) })} />
                        </div>
                    </div>

                    <div className="erp-card bg-gray-50 p-6 border border-gray-200 rounded-xl flex flex-col gap-2 items-center justify-center text-center py-12">
                        <History className="w-8 h-8 text-gray-300 mb-2" />
                        <h3 className="text-sm font-black text-gray-900">Audit Logs (Read-Only)</h3>
                        <p className="text-xs text-gray-500 max-w-sm">System configuration audit logs are tracked securely at the database level and cannot be modified.</p>
                    </div>

                </div>
            </div>
            <SettingsDraftFooter isDirty={isDirty} isValid={isValid} onSave={() => { store.updateSecurityConfig(formData); resetDraft(); }} onDiscard={resetDraft} />
        </div>
    );
}