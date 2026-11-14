"use client";
import * as React from "react";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { SettingsHubTabKey } from "@/types/settingsHub";
import { SETTINGS_HUB } from "@/constants/hubRoutes";
import { SETTINGS_HUB_GROUPS } from "@/constants/settingsHub";
import { findSpoke } from "@/utils/hubSpokes";
import { GeneralSettingsView } from "./views/GeneralSettingsView";
import { StoreFinancialsView } from "./views/StoreFinancialsView";
import { HRSettingsView } from "./views/HRSettingsView";
import { ShippingGlobalView } from "./views/ShippingGlobalView";
import { SecuritySettingsView } from "./views/SecuritySettingsView";
import { NotificationSettingsView } from "./views/NotificationSettingsView";

const SPOKES: Record<SettingsHubTabKey, () => React.ReactNode> = {
    general: () => <GeneralSettingsView />,
    store_financials: () => <StoreFinancialsView />,
    hr_attendance: () => <HRSettingsView />,
    shipping: () => <ShippingGlobalView />,
    security: () => <SecuritySettingsView />,
    notifications: () => <NotificationSettingsView />,
};

/** Full-page settings view with "Back to Settings Hub". */
export function SettingsSpokePage({ spoke }: { spoke: SettingsHubTabKey }) {
    const meta = findSpoke(SETTINGS_HUB_GROUPS, spoke);
    return (
        <HubSpokePage hub={SETTINGS_HUB} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone}>
            {SPOKES[spoke]()}
        </HubSpokePage>
    );
}
