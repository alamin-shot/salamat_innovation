"use client";
import React from "react";
import { AlertTriangle, Plug, PlugZap, Webhook } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useIntegrationManager } from "@/hooks/integrations_hooks/useIntegrationManager";
import { getIntegrationHubGroups, INTEGRATION_SPOKE_TABS, IntegrationSpokeKey } from "@/hooks/integrations_hooks/integrationHubFactory";
import { HubKpi, HubTabState } from "@/types/hub";
import { HUB_HOME } from "@/constants/hub";
import { IntegrationSpokeView } from "./components/IntegrationSpokeView";
import { WebhookDrawer } from "./drawers/WebhookDrawer";

/** Integrations hub on the shared shell (natural page scroll). The manager keeps owning `?tab=`. */
export function IntegrationsClient() {
    const manager = useIntegrationManager();
    const { connections, webhooks } = manager.store;

    // The manager's own router resets search / selection / page on every tab change.
    const activeTab = INTEGRATION_SPOKE_TABS.find((tab) => tab === manager.activeTab) ?? HUB_HOME;
    const hub: HubTabState<IntegrationSpokeKey> = {
        activeTab,
        isPending: manager.isPending,
        openTab: (tab) => manager.handleRouteChange("tab", tab),
    };

    const { kpis, groups } = React.useMemo(() => {
        const byCategory = (category: IntegrationSpokeKey) => connections.filter((connection) => connection.category === category).length;
        const connected = connections.filter((connection) => connection.status === "Connected").length;
        const warnings = connections.filter((connection) => connection.status === "Sync_Warning").length;
        const failing = webhooks.filter((webhook) => webhook.status === "Failing").length;

        const kpis: HubKpi[] = [
            { id: "connected", label: "Connected", value: `${connected} / ${connections.length}`, hint: "Channels, couriers and finance feeds", icon: PlugZap, tone: "emerald" },
            { id: "warnings", label: "Sync Warnings", value: String(warnings), hint: warnings ? "Check the affected connections" : "All syncing normally", icon: AlertTriangle, tone: warnings ? "amber" : "emerald" },
            { id: "webhooks", label: "Webhooks", value: String(webhooks.length), hint: `${webhooks.filter((webhook) => webhook.status === "Active").length} active`, icon: Webhook, tone: "violet" },
            { id: "failing", label: "Failing Webhooks", value: String(failing), hint: failing ? "Deliveries are being rejected" : "No delivery failures", icon: Plug, tone: failing ? "rose" : "emerald" },
        ];
        const groups = getIntegrationHubGroups({
            chat_channels: byCategory("chat_channels"),
            sales_channels: byCategory("sales_channels"),
            logistics_couriers: byCategory("logistics_couriers"),
            accounting_finance: byCategory("accounting_finance"),
            developer_api: webhooks.length,
        });
        return { kpis, groups };
    }, [connections, webhooks]);

    return (
        <>
            <UniversalHubShell
                title="Integrations & API"
                subtitle="Manage channels, logistics, and developer webhooks."
                icon={Plug}
                groups={groups}
                kpis={kpis}
                hub={hub}
                renderSpoke={() => <IntegrationSpokeView manager={manager} />}
            />
            <WebhookDrawer manager={manager} />
        </>
    );
}
