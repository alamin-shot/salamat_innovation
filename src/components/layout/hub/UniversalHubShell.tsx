import * as React from "react";
import { UniversalHubShellProps } from "@/types/hub";
import { HubHeader } from "./HubHeader";
import { HubKpiStrip } from "./HubKpiStrip";
import { HubPortal } from "./HubPortal";

// The one portal every hub uses: header, KPI strip and the spoke cards. Spokes are separate
// full-page routes (see HubSpokePage); this page never renders spoke content itself.
//
// Scroll contract: AdminLayout's <main> is the ONLY vertical scroller; this shell is min-h-full.
export function UniversalHubShell<SpokeKey extends string>({ title, subtitle, icon, groups, kpis = [], headerActions, isPending = false, parents }: UniversalHubShellProps<SpokeKey>) {
    return (
        <div className="flex min-h-full w-full flex-col gap-4 p-4">
            <HubHeader title={title} subtitle={subtitle} icon={icon} actions={headerActions} parents={parents} />
            <HubKpiStrip kpis={kpis} />
            <div className={`transition-opacity duration-200 ${isPending ? "pointer-events-none opacity-60" : "opacity-100"}`}>
                <HubPortal groups={groups} />
            </div>
        </div>
    );
}
