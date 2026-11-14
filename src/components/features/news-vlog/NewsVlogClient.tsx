"use client";
import { Newspaper } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useNewsVlogOverview } from "@/hooks/news_vlog_hooks/useNewsVlogOverview";

/** News & Vlog hub portal. */
export function NewsVlogClient() {
    const { kpis, groups } = useNewsVlogOverview();

    return (
        <UniversalHubShell
            title="News & Vlog"
            subtitle="News articles and video vlogs for the storefront."
            icon={Newspaper}
            groups={groups}
            kpis={kpis}
        />
    );
}
