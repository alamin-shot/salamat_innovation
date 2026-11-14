import { OperationsTabKey } from "@/types/operations";
import { OrdersHubTabKey } from "@/types/ordersHub";
import { SeoHubTabKey, SeoTabType } from "@/types/seo";
import { NewsVlogTabKey } from "@/types/newsVlog";
import { SettingsHubTabKey } from "@/types/settingsHub";
import { IntegrationTabKey } from "@/types/integrations";
import { HubBackLink } from "@/types/hub";

// Full-page spoke routes of every hub. The hub page is the portal; each spoke is
// `<hub path>/<slug>` (a real Next.js route folder), and old `?tab=<key>` links redirect there.

export type IntegrationSpokeKey = Exclude<IntegrationTabKey, "hub">;
export type ClosingSpokeKey = "daily_closings" | "daily_closing_balance" | "profit_loss" | "sale" | "purchase" | "sale_return" | "purchase_return" | "expense" | "withdrawal" | "deposit" | "stock" | "balance_sheet" | "daily_bank";

export const OPERATIONS_HUB: HubBackLink = { title: "Operations", href: "/admin/operations" };
export const ORDERS_HUB: HubBackLink = { title: "Orders", href: "/admin/orders" };
export const SEO_HUB: HubBackLink = { title: "SEO", href: "/admin/seo" };
export const NEWS_VLOG_HUB: HubBackLink = { title: "News & Vlog", href: "/admin/news-vlog" };
export const SETTINGS_HUB: HubBackLink = { title: "Settings Hub", href: "/admin/settings" };
export const INTEGRATIONS_HUB: HubBackLink = { title: "Integrations & API", href: "/admin/integrations" };
export const DAILY_CLOSING_HUB: HubBackLink = { title: "Daily Closing", href: "/admin/daily-closing" };

export const OPERATIONS_SPOKE_SLUGS: Readonly<Record<OperationsTabKey, string>> = {
    stock_transfers: "stock-transfers",
    damage_products: "damage-products",
    assets: "assets",
    cash_transfers: "cash-transfers",
};

export const ORDERS_SPOKE_SLUGS: Readonly<Record<OrdersHubTabKey, string>> = {
    order_list: "order-list",
    order_options: "order-options",
    // Keeps the long-standing "All Orders" address; status filters ride along as ?status=.
    orders: "all-orders",
};

export const SEO_SPOKE_SLUGS: Readonly<Record<SeoHubTabKey, string>> = {
    site_settings: "site-settings",
    page_metadata: "page-metadata",
    social_tags: "social-tags",
    sitemap_robots: "sitemap-robots",
};

export const NEWS_VLOG_SPOKE_SLUGS: Readonly<Record<NewsVlogTabKey, string>> = {
    news: "news",
    vlogs: "vlogs",
};

export const SETTINGS_SPOKE_SLUGS: Readonly<Record<SettingsHubTabKey, string>> = {
    general: "general",
    store_financials: "store-financials",
    hr_attendance: "hr-attendance",
    shipping: "shipping",
    security: "security",
    notifications: "notifications",
};

export const INTEGRATIONS_SPOKE_SLUGS: Readonly<Record<IntegrationSpokeKey, string>> = {
    chat_channels: "chat-channels",
    sales_channels: "sales-channels",
    logistics_couriers: "logistics-couriers",
    accounting_finance: "accounting-finance",
    developer_api: "developer-api",
};

export const CLOSING_SPOKE_SLUGS: Readonly<Record<ClosingSpokeKey, string>> = {
    daily_closings: "daily-closings",
    daily_closing_balance: "daily-closing-balance",
    profit_loss: "profit-loss",
    daily_bank: "daily-bank",
    sale: "sale",
    purchase: "purchase",
    sale_return: "sale-return",
    purchase_return: "purchase-return",
    expense: "expense",
    withdrawal: "withdrawal",
    deposit: "deposit",
    stock: "stock",
    balance_sheet: "balance-sheet",
};

/** `/admin/operations` + `stock-transfers` (+ optional query) → full spoke URL. */
export function spokeHref(hub: HubBackLink, slug: string, query?: Record<string, string | undefined>): string {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => { if (value) params.set(key, value); });
    const search = params.toString();
    return `${hub.href}/${slug}${search ? `?${search}` : ""}`;
}

// ── Page Metadata: a hub inside the SEO hub ────────────────────────────────
export const PAGE_METADATA_HUB: HubBackLink = { title: "Page Metadata", href: "/admin/seo/page-metadata" };

export const PAGE_METADATA_SECTION_SLUGS: Readonly<Record<SeoTabType, string>> = {
    pages: "pages",
    products: "products",
    categories: "categories",
    brands: "brands",
};
