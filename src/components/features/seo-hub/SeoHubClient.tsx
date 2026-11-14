"use client";
import { Search } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useSeoPlatform } from "@/hooks/seo_hooks/useSeoPlatform";
import { useSeoHubOverview } from "@/hooks/seo_hooks/useSeoHubOverview";
import { SeoPlatformSwitch } from "./SeoPlatformSwitch";

/** SEO hub portal: the Salamat / TEKZO switch drives the KPIs and is carried into every spoke link. */
export function SeoHubClient() {
    const { platform, setPlatform, isPending } = useSeoPlatform();
    const { kpis, groups } = useSeoHubOverview(platform);

    return (
        <UniversalHubShell
            title="SEO"
            subtitle="Search appearance, social sharing, sitemap and robots for each storefront."
            icon={Search}
            groups={groups}
            kpis={kpis}
            isPending={isPending}
            headerActions={<SeoPlatformSwitch platform={platform} onChange={setPlatform} />}
        />
    );
}
