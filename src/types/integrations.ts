export type IntegrationTabKey =
    | "hub"
    | "chat_channels"
    | "sales_channels"
    | "logistics_couriers"
    | "accounting_finance"
    | "developer_api";

export type IntegrationDrawerMode = "none" | "webhook_form" | "credentials_config";

export interface IntegrationConnection {
    id: string;
    providerKey: string; // e.g. "whatsapp", "woocommerce", "pathao"
    providerName: string; // e.g. "WhatsApp Business", "WooCommerce", "Pathao Courier"
    category: "chat_channels" | "sales_channels" | "logistics_couriers" | "accounting_finance";
    status: "Connected" | "Disconnected" | "Sync_Warning";
    lastSyncedAt: string | null;
    accountName?: string;
    metadata?: Record<string, string>;
}

export interface ApiCredentialSet {
    environment: "sandbox" | "production";
    clientId: string;
    clientSecretMasked: string;
    lastGeneratedAt: string | null;
}

export interface WebhookEndpoint {
    id: string;
    url: string;
    subscribedEvents: string[];
    status: "Active" | "Paused" | "Failing";
    failureCount: number;
    createdAt: string;
}