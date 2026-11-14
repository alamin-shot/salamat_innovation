import { Code, Landmark, MessageSquare, ShoppingCart, Truck } from "lucide-react";
import { HubSpokeGroup } from "@/types/hub";
import { IntegrationTabKey } from "@/types/integrations";

export type IntegrationSpokeKey = Exclude<IntegrationTabKey, "hub">;

/** The Integrations spokes (the only valid `?tab=` values besides the portal). */
export const INTEGRATION_SPOKE_TABS = ["chat_channels", "sales_channels", "logistics_couriers", "accounting_finance", "developer_api"] as const satisfies readonly IntegrationSpokeKey[];

/** Portal cards for the Integrations hub (same groups and wording as before), with live counts. */
export function getIntegrationHubGroups(counts: Partial<Record<IntegrationSpokeKey, number>>): HubSpokeGroup<IntegrationSpokeKey>[] {
    return [
        {
            title: "Omnichannel & Communication",
            description: "Connect customer-facing touchpoints and social commerce channels.",
            spokes: [
                { id: "chat_channels", label: "Chat Channels", icon: MessageSquare, description: "WhatsApp, Facebook Messenger & Instagram unified inbox", tone: "blue", count: counts.chat_channels },
                { id: "sales_channels", label: "Sales Channels", icon: ShoppingCart, description: "WooCommerce, Daraz BD & Custom Storefront sync", tone: "emerald", count: counts.sales_channels },
            ],
        },
        {
            title: "Fulfillment & Finance",
            description: "Automate logistics dispatch and backend ledger reconciliation.",
            spokes: [
                { id: "logistics_couriers", label: "Logistics Couriers", icon: Truck, description: "Pathao Commerce API, Steadfast & RedX dispatch", tone: "indigo", count: counts.logistics_couriers },
                { id: "accounting_finance", label: "Accounting & Finance", icon: Landmark, description: "QuickBooks & automated bank reconciliation feeds", tone: "teal", count: counts.accounting_finance },
            ],
        },
        {
            title: "Developer Infrastructure",
            description: "Manage API access tokens, sandbox environments, and webhooks.",
            spokes: [
                { id: "developer_api", label: "Developer API & Webhooks", icon: Code, description: "OAuth keys, event-driven webhooks & sandbox toggles", tone: "violet", count: counts.developer_api },
            ],
        },
    ];
}
