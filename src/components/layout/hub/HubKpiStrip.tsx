import * as React from "react";
import { HubKpi } from "@/types/hub";
import { HUB_TONE_CLASSES } from "@/constants/hub";

/** Summary tiles above the tabs. Values are computed live by each hub's KPI hook. */
export function HubKpiStrip({ kpis }: { kpis: HubKpi[] }) {
    if (kpis.length === 0) {
        return null;
    }
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div key={kpi.id} className="flex items-center gap-3 rounded-xl border border-brand-subtext/15 bg-white p-4 shadow-sm">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${HUB_TONE_CLASSES[kpi.tone]}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-brand-subtext">{kpi.label}</p>
                            <p className="truncate text-lg font-bold text-brand-text">{kpi.value}</p>
                            {kpi.hint && <p className="truncate text-xs text-brand-subtext">{kpi.hint}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
