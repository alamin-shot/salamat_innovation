"use client";
import Link from "next/link";
import { Globe, Store, Users, Truck, ShieldAlert, BellRing, ChevronRight } from "lucide-react";

const HUB_MODULES = [
    { title: "General & Localization", description: "Company details, formats, brand colors, and maintenance.", icon: Globe, href: "/admin/settings/general", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Store & Financials", description: "Shops, E-commerce platforms, and active payment methods.", icon: Store, href: "/admin/settings/store-financials", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "HR & Attendance", description: "Payrun schedules, leave policies, and geolocation restrictions.", icon: Users, href: "/admin/settings/hr-attendance", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Shipping & Logistics", description: "Base delivery charges and area-specific shipping overrides.", icon: Truck, href: "/admin/settings/shipping", color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Security & Audit", description: "Global 2FA, session controls, and administrative audit logs.", icon: ShieldAlert, href: "/admin/settings/security", color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Notifications & Webhooks", description: "Email/SMS gateway keys and system event subscriptions.", icon: BellRing, href: "/admin/settings/notifications", color: "text-indigo-500", bg: "bg-indigo-500/10" }
];

export function SettingsHubClient() {
    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings Hub</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage enterprise configurations, security, and operations.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {HUB_MODULES.map((mod) => (
                        <Link key={mod.title} href={mod.href} className="erp-card bg-white p-6 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-brand-primary/30 transition-all group flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mod.bg} ${mod.color}`}>
                                <mod.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col flex-1 gap-1">
                                <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{mod.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{mod.description}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors text-gray-400">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}