// LAYER 1: Universal Hub & Spoke contract.
// One shell renders every hub (Operations, Orders, SEO, News & Vlog, Integrations, Settings).
// Each spoke stays its own page component with its own store and manager; the hub only routes.
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Colour family for cards, tabs and KPI tiles (semantic first, then the palette). */
export type HubTone =
    | "emerald" | "amber" | "rose"
    | "blue" | "indigo" | "violet" | "teal" | "cyan" | "sky" | "fuchsia" | "orange" | "slate";

/** The landing view (portal) of every hub. The value lives in constants/hub.ts (HUB_HOME). */
export type HubHome = "hub";

/** A spoke as the hub shows it: a portal card and a tab. */
export interface HubSpokeDefinition<TabKey extends string> {
    id: TabKey;
    label: string;
    description: string;
    icon: LucideIcon;
    tone: HubTone;
    /** Live record count shown on the card and the tab; omit when not meaningful. */
    count?: number;
}

/** Portal cards are grouped under a heading. */
export interface HubSpokeGroup<TabKey extends string> {
    title: string;
    description?: string;
    spokes: HubSpokeDefinition<TabKey>[];
}

/** One tile of the KPI strip. Values arrive pre-formatted from the hub's KPI hook. */
export interface HubKpi {
    id: string;
    label: string;
    value: string;
    hint?: string;
    icon: LucideIcon;
    tone: HubTone;
}

/** Returned by useHubTab: the active view and how to change it. */
export interface HubTabState<TabKey extends string> {
    activeTab: TabKey | HubHome;
    /** True while a tab change is rendering (React transition). */
    isPending: boolean;
    openTab: (tab: TabKey | HubHome) => void;
}

export interface UniversalHubShellProps<TabKey extends string> {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    groups: HubSpokeGroup<TabKey>[];
    kpis?: HubKpi[];
    hub: HubTabState<TabKey>;
    /** Right side of the header, e.g. the SEO platform switch. */
    headerActions?: ReactNode;
    /** Renders the active spoke. Called only when a spoke (not the portal) is open. */
    renderSpoke: (tab: TabKey) => ReactNode;
}
