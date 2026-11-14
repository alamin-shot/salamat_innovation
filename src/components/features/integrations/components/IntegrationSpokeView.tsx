"use client";
import { Search, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DeveloperApiSpoke } from "../tables/DeveloperApiSpoke";
import { IntegrationConnection } from "@/types/integrations";

export function IntegrationSpokeView({ manager }: { manager: any }) {
    const titleMap: Record<string, string> = {
        chat_channels: "Chat & Social Inbox",
        sales_channels: "Sales Channels & Storefronts",
        logistics_couriers: "Logistics & Fulfillment",
        accounting_finance: "Accounting & Finance",
        developer_api: "Developer API & Webhooks"
    };

    const isApiView = manager.activeTab === "developer_api";
    const connections = manager.activeTabData as IntegrationConnection[];

    return (
        // FIX: Removed 'h-full' and 'overflow-hidden'. Now it grows as tall as the content needs.
        <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-right-4 duration-300">
            <div className="px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                    <h2 className="text-base font-black text-gray-900">{titleMap[manager.activeTab as string] || "Integrations"}</h2>
                </div>

                {isApiView && (
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search webhooks..."
                            className="w-full pl-9 pr-3 h-9 text-sm border border-gray-200 rounded-lg focus:ring-brand-primary shadow-sm"
                            value={manager.searchQuery}
                            onChange={(e) => manager.setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
                {isApiView ? (
                    <DeveloperApiSpoke manager={manager} />
                ) : connections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <Search className="w-8 h-8 text-gray-300 mb-3" />
                        <h3 className="text-sm font-black text-gray-900">No Integrations Found</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">There are currently no active or available connections for this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {/* ... Existing Connection Card Mapping ... */}
                    </div>
                )}
            </div>
        </div>
    );
}