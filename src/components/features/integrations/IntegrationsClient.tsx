"use client";
import React from "react";
import { AlertTriangle, Plug, PlugZap, Webhook } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useGlobalIntegrationsStore } from "@/store/useGlobalIntegrationsStore";
import { getIntegrationHubGroups, IntegrationSpokeKey } from "@/hooks/integrations_hooks/integrationHubFactory";
import { HubKpi } from "@/types/hub";

/** Integrations hub KPIs and spoke cards with live counts. */
export function useIntegrationsOverview() {
    const connections = useGlobalIntegrationsStore((state) => state.connections);
    const webhooks = useGlobalIntegrationsStore((state) => state.webhooks);

    return React.useMemo(() => {
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
}

/** Integrations hub portal (natural page scroll); each card opens its full-page spoke. */
export function IntegrationsClient() {
    const { kpis, groups } = useIntegrationsOverview();
    return <UniversalHubShell title="Integrations & API" subtitle="Manage channels, logistics, and developer webhooks." icon={Plug} groups={groups} kpis={kpis} />;
}
