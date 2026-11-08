"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGlobalSettingsStore } from "@/store/useGlobalSettingsStore";
import { useSettingsDraft } from "@/hooks/settings_hooks/useSettingsDraft";
import { SettingsDraftFooter } from "../components/SettingsDraftFooter";
import { ArrowLeft, BellRing, Mail, MessageSquare } from "lucide-react";

export function NotificationSettingsView() {
    const store = useGlobalSettingsStore();
    const [isMounted, setIsMounted] = useState(false);
    const { formData, setFormData, isDirty, isValid, resetDraft } = useSettingsDraft(store.notificationConfig, []);

    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
                <Link href="/admin/settings" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Notifications & Webhooks</h1>
                    <p className="text-xs text-gray-500 mt-1">Configure email/SMS gateways and system event subscriptions.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-32">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-6">
                        <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">Gateway API Keys</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> SMTP / Email Gateway Key</label>
                                <input type="password" className="erp-input font-mono text-xs" placeholder="sk_live_..." value={formData.emailGatewayKey} onChange={e => setFormData({ ...formData, emailGatewayKey: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="erp-label flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> SMS Gateway Key</label>
                                <input type="password" className="erp-input font-mono text-xs" placeholder="Twilio/Nexmo Key" value={formData.smsGatewayKey} onChange={e => setFormData({ ...formData, smsGatewayKey: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="erp-card bg-white p-6 border border-gray-200 rounded-xl flex flex-col gap-4">
                        <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">System Event Subscriptions</h3>
                        <div className="flex flex-col gap-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" checked={formData.notifyOnShopCreate} onChange={e => setFormData({ ...formData, notifyOnShopCreate: e.target.checked })} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">New Shop Creation</span>
                                    <span className="text-xs text-gray-500">Notify Super Admins when a new physical retail shop is added to the ERP.</span>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" checked={formData.notifyOnPayrun} onChange={e => setFormData({ ...formData, notifyOnPayrun: e.target.checked })} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">Payrun Completion</span>
                                    <span className="text-xs text-gray-500">Trigger email notifications to employees when a new Payrun is generated.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
            <SettingsDraftFooter isDirty={isDirty} isValid={isValid} onSave={() => { store.updateNotificationConfig(formData); resetDraft(); }} onDiscard={resetDraft} />
        </div>
    );
}