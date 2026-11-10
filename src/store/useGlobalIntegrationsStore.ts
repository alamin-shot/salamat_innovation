import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IntegrationConnection, ApiCredentialSet, WebhookEndpoint } from "@/types/integrations";

interface IntegrationsState {
    connections: IntegrationConnection[];
    apiCredentials: ApiCredentialSet;
    webhooks: WebhookEndpoint[];

    // Actions
    connectProvider: (providerKey: string, accountName: string, category: any) => void;
    disconnectProvider: (id: string) => void;
    toggleEnvironment: (env: "sandbox" | "production") => void;
    regenerateApiKey: () => void;
    addWebhook: (url: string, events: string[]) => void;
    toggleWebhookStatus: (id: string) => void;
    deleteWebhooks: (ids: string[]) => void;
}

export const useGlobalIntegrationsStore = create<IntegrationsState>()(
    persist(
        (set, get) => ({
            connections: [
                { id: "conn-1", providerKey: "daraz", providerName: "Daraz Storefront", category: "sales_channels", status: "Connected", lastSyncedAt: "2026-11-10 10:30 AM", accountName: "Salamat Innovation BD" },
                { id: "conn-2", providerKey: "whatsapp", providerName: "WhatsApp Business API", category: "chat_channels", status: "Disconnected", lastSyncedAt: null },
                { id: "conn-3", providerKey: "pathao", providerName: "Pathao Courier API", category: "logistics_couriers", status: "Connected", lastSyncedAt: "2026-11-10 11:15 AM", accountName: "Salamat HQ Outlet" },
                { id: "conn-4", providerKey: "woocommerce", providerName: "WooCommerce Store", category: "sales_channels", status: "Connected", lastSyncedAt: "2026-11-10 09:00 AM", accountName: "tekzobd.com" }
            ] as IntegrationConnection[],

            apiCredentials: {
                environment: "sandbox",
                clientId: "dev_67d1eeff1454ce79a9fddbD0",
                clientSecretMasked: "••••••••••••••••••••••••••••••••",
                lastGeneratedAt: "2026-10-15"
            } as ApiCredentialSet,

            webhooks: [
                { id: "wh-1", url: "https://api.salamatinnovation.com/v1/webhook/orders", subscribedEvents: ["order.created", "order.paid"], status: "Active", failureCount: 0, createdAt: "2026-10-20" },
                { id: "wh-2", url: "https://api.salamatinnovation.com/v1/webhook/inventory", subscribedEvents: ["inventory.low_stock"], status: "Active", failureCount: 0, createdAt: "2026-10-22" }
            ] as WebhookEndpoint[],

            connectProvider: (providerKey, accountName, category) => set((state) => {
                const exists = state.connections.some(c => c.providerKey === providerKey);

                if (exists) {
                    return {
                        connections: state.connections.map(c =>
                            c.providerKey === providerKey
                                // FIX: 'as const' locks the string to the exact union literal
                                ? { ...c, status: "Connected" as const, accountName, lastSyncedAt: new Date().toISOString() }
                                : c
                        )
                    };
                }

                return {
                    connections: [
                        ...state.connections,
                        {
                            id: `conn-${Date.now()}`,
                            providerKey,
                            providerName: providerKey.toUpperCase(),
                            category,
                            // FIX: 'as const' locks the string to the exact union literal
                            status: "Connected" as const,
                            accountName,
                            lastSyncedAt: new Date().toISOString()
                        }
                    ]
                };
            }),

            disconnectProvider: (id) => set((state) => ({
                connections: state.connections.map(c => c.id === id ? { ...c, status: "Disconnected", lastSyncedAt: null, accountName: undefined } : c)
            })),

            toggleEnvironment: (env) => set((state) => ({
                apiCredentials: { ...state.apiCredentials, environment: env }
            })),

            regenerateApiKey: () => set((state) => ({
                apiCredentials: {
                    ...state.apiCredentials,
                    clientId: `prod_${Math.random().toString(36).substring(2, 15)}`,
                    clientSecretMasked: "sec_" + Math.random().toString(36).substring(2, 20),
                    lastGeneratedAt: new Date().toISOString()
                }
            })),

            addWebhook: (url, events) => set((state) => ({
                webhooks: [
                    ...state.webhooks,
                    {
                        id: `wh-${Date.now()}`,
                        url,
                        subscribedEvents: events,
                        status: "Active",
                        failureCount: 0,
                        createdAt: new Date().toISOString().split('T')[0]
                    }
                ]
            })),

            toggleWebhookStatus: (id) => set((state) => ({
                webhooks: state.webhooks.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w)
            })),

            deleteWebhooks: (ids) => set((state) => ({
                webhooks: state.webhooks.filter(w => !ids.includes(w.id))
            }))
        }),
        { name: "erp-integrations-storage-v1" }
    )
);