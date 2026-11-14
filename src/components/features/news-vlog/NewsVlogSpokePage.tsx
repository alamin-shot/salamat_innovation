"use client";
import * as React from "react";
import { HubSpokePage } from "@/components/layout/hub/HubSpokePage";
import { useNewsVlogOverview } from "@/hooks/news_vlog_hooks/useNewsVlogOverview";
import { NewsVlogTabKey } from "@/types/newsVlog";
import { NEWS_VLOG_HUB } from "@/constants/hubRoutes";
import { findSpoke } from "@/utils/hubSpokes";
import { NewsClient } from "@/components/features/news/NewsClient";
import { VlogsSpoke } from "./spokes/vlogs/VlogsSpoke";

const SPOKES: Record<NewsVlogTabKey, () => React.ReactNode> = {
    news: () => <NewsClient />,
    vlogs: () => <VlogsSpoke />,
};

/** Full-page News or Vlog spoke with "Back to News & Vlog". */
export function NewsVlogSpokePage({ spoke }: { spoke: NewsVlogTabKey }) {
    const meta = findSpoke(useNewsVlogOverview().groups, spoke);
    return (
        <HubSpokePage hub={NEWS_VLOG_HUB} label={meta.label} description={meta.description} icon={meta.icon} tone={meta.tone}>
            {SPOKES[spoke]()}
        </HubSpokePage>
    );
}
