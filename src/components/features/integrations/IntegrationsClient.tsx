"use client";
import React from "react";
import { useIntegrationManager } from "@/hooks/integrations_hooks/useIntegrationManager";
import { IntegrationHubPortal } from "./components/IntegrationHubPortal";
import { IntegrationSpokeView } from "./components/IntegrationSpokeView";
import { WebhookDrawer } from "./drawers/WebhookDrawer";

export function IntegrationsClient() {
    const manager = useIntegrationManager();

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50 relative overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Integrations & API</h1>
                    <p className="text-xs text-gray-500 font-medium mt-1">Manage channels, logistics, and developer webhooks.</p>
                </div>
            </div>

            {/* FIX: Changed to overflow-y-auto so the ENTIRE right side of the screen scrolls naturally */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                {manager.activeTab === "hub" ? (
                    <IntegrationHubPortal manager={manager} />
                ) : (
                    <div className="p-4 sm:p-6 min-h-full">
                        <IntegrationSpokeView manager={manager} />
                    </div>
                )}
            </div>

            <WebhookDrawer manager={manager} />
        </div>
    );
}