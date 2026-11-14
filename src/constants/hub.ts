import { HubHome, HubTone } from "@/types/hub";
import { NewsVlogTabKey } from "@/types/newsVlog";
import { OrdersHubTabKey } from "@/types/ordersHub";
import { OrderStatus } from "@/store/useOrderStore";
import { SettingsHubTabKey } from "@/types/settingsHub";

/** The landing view (portal) of every hub: no `?tab=` in the URL. */
export const HUB_HOME: HubHome = "hub";

/** Icon chip / card accent per tone (bg-50 + text-600 + border-100, the project's colour grammar). */
export const HUB_TONE_CLASSES: Readonly<Record<HubTone, string>> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    fuchsia: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
};

/** URL params a tab change must clear, so a drawer or page from one spoke never leaks into another. */
export const HUB_SPOKE_SCOPED_PARAMS = ["drawer", "modal", "id", "page", "search", "status"] as const;

// ── Hub tab registries (the only valid `?tab=` values per hub) ─────────────
export const ORDERS_HUB_TABS = ["order_list", "order_options", "orders"] as const satisfies readonly OrdersHubTabKey[];
export const NEWS_VLOG_HUB_TABS = ["news", "vlogs"] as const satisfies readonly NewsVlogTabKey[];

/** Order statuses in workflow order (also the `?status=` values of the Orders spoke). */
export const ORDER_STATUS_FLOW = ["Pending", "Hold", "Confirmed", "Approved", "Processing", "Onway", "Return", "Complete", "Rejected"] as const satisfies readonly OrderStatus[];
export const SETTINGS_HUB_TABS = ["general", "store_financials", "hr_attendance", "shipping", "security", "notifications"] as const satisfies readonly SettingsHubTabKey[];
