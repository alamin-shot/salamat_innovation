// LAYER 1: Universal Hub & Spoke contract.
// A hub page (e.g. /admin/operations) is only a portal: header, KPI strip and one card per spoke.
// Every spoke is its own full-page route (e.g. /admin/operations/stock-transfers) with a
// "Back to <hub>" action; spokes keep their own stores and managers.
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Colour family for cards and KPI tiles (semantic first, then the palette). */
export type HubTone =
    | "emerald" | "amber" | "rose"
    | "blue" | "indigo" | "violet" | "teal" | "cyan" | "sky" | "fuchsia" | "orange" | "slate";

/** A spoke as the hub portal shows it. */
export interface HubSpokeDefinition<SpokeKey extends string> {
    id: SpokeKey;
    label: string;
    description: string;
    icon: LucideIcon;
    tone: HubTone;
    /** Full-page route of the spoke (may carry hub-wide params, e.g. `?platform=`). */
    href: string;
    /** Live record count shown on the card; omit when not meaningful. */
    count?: number;
}

/** Portal cards are grouped under a heading. */
export interface HubSpokeGroup<SpokeKey extends string> {
    title: string;
    description?: string;
    spokes: HubSpokeDefinition<SpokeKey>[];
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

export interface UniversalHubShellProps<SpokeKey extends string> {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    groups: HubSpokeGroup<SpokeKey>[];
    kpis?: HubKpi[];
    /** Right side of the header, e.g. the SEO platform switch. */
    headerActions?: ReactNode;
    /** Dims the portal while a hub-wide switch (e.g. SEO platform) re-renders. */
    isPending?: boolean;
    /** For a hub inside another hub (e.g. SEO › Page Metadata): back link + breadcrumb to the parents, outermost first. */
    parents?: HubBackLink[];
}

/** Where a spoke page returns to. */
export interface HubBackLink {
    title: string;
    href: string;
}

export interface HubSpokePageProps {
    hub: HubBackLink;
    /** Hubs above `hub` for the breadcrumb, outermost first (e.g. SEO above Page Metadata). */
    parents?: HubBackLink[];
    label: string;
    description: string;
    icon: LucideIcon;
    tone: HubTone;
    /** Right side of the spoke header (e.g. the SEO platform switch, the closing date). */
    actions?: ReactNode;
    children: ReactNode;
}
