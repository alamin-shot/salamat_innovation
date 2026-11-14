import { BellRing, Globe, ShieldAlert, Store, Truck, Users } from "lucide-react";
import { HubSpokeGroup } from "@/types/hub";
import { SettingsHubTabKey } from "@/types/settingsHub";
import { SETTINGS_HUB, SETTINGS_SPOKE_SLUGS, spokeHref } from "@/constants/hubRoutes";

const href = (key: SettingsHubTabKey) => spokeHref(SETTINGS_HUB, SETTINGS_SPOKE_SLUGS[key]);

/** Same six modules, titles and descriptions the old Settings portal showed. */
export const SETTINGS_HUB_GROUPS: HubSpokeGroup<SettingsHubTabKey>[] = [
    {
        title: "Business",
        description: "Company identity, storefronts and money.",
        spokes: [
            { id: "general", href: href("general"), label: "General & Localization", description: "Company details, formats, brand colors, and maintenance.", icon: Globe, tone: "blue" },
            { id: "store_financials", href: href("store_financials"), label: "Store & Financials", description: "Shops, E-commerce platforms, and active payment methods.", icon: Store, tone: "emerald" },
            { id: "shipping", href: href("shipping"), label: "Shipping & Logistics", description: "Base delivery charges and area-specific shipping overrides.", icon: Truck, tone: "amber" },
        ],
    },
    {
        title: "People & Platform",
        description: "Workforce rules, security and system notifications.",
        spokes: [
            { id: "hr_attendance", href: href("hr_attendance"), label: "HR & Attendance", description: "Payrun schedules, leave policies, and geolocation restrictions.", icon: Users, tone: "violet" },
            { id: "security", href: href("security"), label: "Security & Audit", description: "Global 2FA, session controls, and administrative audit logs.", icon: ShieldAlert, tone: "rose" },
            { id: "notifications", href: href("notifications"), label: "Notifications & Webhooks", description: "Email/SMS gateway keys and system event subscriptions.", icon: BellRing, tone: "indigo" },
        ],
    },
];
