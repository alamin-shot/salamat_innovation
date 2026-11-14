"use client";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useIntegrationManager } from "@/hooks/integrations_hooks/useIntegrationManager";
import { IntegrationSpokeKey, INTEGRATIONS_HUB } from "@/constants/hubRoutes";
import { findSpoke } from "@/utils/hubSpokes";
import { useIntegrationsOverview } from "./IntegrationsClient";
import { IntegrationSpokeView } from "./components/IntegrationSpokeView";
import { WebhookDrawer } from "./drawers/WebhookDrawer";

/** Full-page Integrations spoke with "Back to Integrations & API". */
export function IntegrationsSpokePage({ spoke }: { spoke: IntegrationSpokeKey }) {
    const manager = useIntegrationManager(spoke);
    const meta = findSpoke(useIntegrationsOverview().groups, spoke);

    return (
        <HubSpokePage hub={INTEGRATIONS_HUB} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone}>
            <IntegrationSpokeView manager={manager} />
            <WebhookDrawer manager={manager} />
        </HubSpokePage>
    );
}
