"use client";
import * as React from "react";
import { BellRing, Globe, Settings, ShieldAlert, Store, Truck, Users } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useHubTab } from "@/hooks/shared_hooks/useHubTab";
import { HubSpokeGroup } from "@/types/hub";
import { SettingsHubTabKey } from "@/types/settingsHub";
import { SETTINGS_HUB_TABS } from "@/constants/hub";
import { GeneralSettingsView } from "./views/GeneralSettingsView";
import { StoreFinancialsView } from "./views/StoreFinancialsView";
import { HRSettingsView } from "./views/HRSettingsView";
import { ShippingGlobalView } from "./views/ShippingGlobalView";
import { SecuritySettingsView } from "./views/SecuritySettingsView";
import { NotificationSettingsView } from "./views/NotificationSettingsView";

// Same six modules, titles and descriptions the old Settings portal showed.
const GROUPS: HubSpokeGroup<SettingsHubTabKey>[] = [
    {
        title: "Business",
        description: "Company identity, storefronts and money.",
        spokes: [
            { id: "general", label: "General & Localization", description: "Company details, formats, brand colors, and maintenance.", icon: Globe, tone: "blue" },
            { id: "store_financials", label: "Store & Financials", description: "Shops, E-commerce platforms, and active payment methods.", icon: Store, tone: "emerald" },
            { id: "shipping", label: "Shipping & Logistics", description: "Base delivery charges and area-specific shipping overrides.", icon: Truck, tone: "amber" },
        ],
    },
    {
        title: "People & Platform",
        description: "Workforce rules, security and system notifications.",
        spokes: [
            { id: "hr_attendance", label: "HR & Attendance", description: "Payrun schedules, leave policies, and geolocation restrictions.", icon: Users, tone: "violet" },
            { id: "security", label: "Security & Audit", description: "Global 2FA, session controls, and administrative audit logs.", icon: ShieldAlert, tone: "rose" },
            { id: "notifications", label: "Notifications & Webhooks", description: "Email/SMS gateway keys and system event subscriptions.", icon: BellRing, tone: "indigo" },
        ],
    },
];

const SPOKES: Record<SettingsHubTabKey, () => React.ReactNode> = {
    general: () => <GeneralSettingsView />,
    store_financials: () => <StoreFinancialsView />,
    hr_attendance: () => <HRSettingsView />,
    shipping: () => <ShippingGlobalView />,
    security: () => <SecuritySettingsView />,
    notifications: () => <NotificationSettingsView />,
};

/** Settings hub on the shared shell: each settings view is a tab; the page scrolls naturally. */
export function SettingsHubClient() {
    const hub = useHubTab<SettingsHubTabKey>(SETTINGS_HUB_TABS);

    return (
        <UniversalHubShell
            title="Settings Hub"
            subtitle="Manage enterprise configurations, security, and operations."
            icon={Settings}
            groups={GROUPS}
            hub={hub}
            renderSpoke={(tab) => SPOKES[tab]()}
        />
    );
}
