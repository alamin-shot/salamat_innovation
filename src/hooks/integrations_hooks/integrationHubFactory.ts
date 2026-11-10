import { IntegrationTabKey } from "@/types/integrations";
import { MessageSquare, ShoppingCart, Truck, Landmark, Code, LucideIcon } from "lucide-react";

export interface IntegrationHubCategory {
    title: string;
    description: string;
    items: {
        id: IntegrationTabKey;
        label: string;
        icon: LucideIcon;
        desc: string;
        color: string;
    }[];
}

export function getIntegrationHubCategories(): IntegrationHubCategory[] {
    return [
        {
            title: "Omnichannel & Communication",
            description: "Connect customer-facing touchpoints and social commerce channels.",
            items: [
                { id: "chat_channels", label: "Chat Channels", icon: MessageSquare, desc: "WhatsApp, Facebook Messenger & Instagram unified inbox", color: "text-blue-600 bg-blue-50 border-blue-100" },
                { id: "sales_channels", label: "Sales Channels", icon: ShoppingCart, desc: "WooCommerce, Daraz BD & Custom Storefront sync", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
            ]
        },
        {
            title: "Fulfillment & Finance",
            description: "Automate logistics dispatch and backend ledger reconciliation.",
            items: [
                { id: "logistics_couriers", label: "Logistics Couriers", icon: Truck, desc: "Pathao Commerce API, Steadfast & RedX dispatch", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
                { id: "accounting_finance", label: "Accounting & Finance", icon: Landmark, desc: "QuickBooks & automated bank reconciliation feeds", color: "text-teal-600 bg-teal-50 border-teal-100" }
            ]
        },
        {
            title: "Developer Infrastructure",
            description: "Manage API access tokens, sandbox environments, and webhooks.",
            items: [
                { id: "developer_api", label: "Developer API & Webhooks", icon: Code, desc: "OAuth keys, event-driven webhooks & sandbox toggles", color: "text-purple-600 bg-purple-50 border-purple-100" }
            ]
        }
    ];
}