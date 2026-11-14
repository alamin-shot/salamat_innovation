"use client";
import * as React from "react";
import { Newspaper, Video } from "lucide-react";
import { UniversalHubShell } from "@/components/layout/hub/UniversalHubShell";
import { useHubTab } from "@/hooks/shared_hooks/useHubTab";
import { useNewsStore } from "@/store/useNewsStore";
import { useVlogStore } from "@/store/useVlogStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { NewsVlogTabKey } from "@/types/newsVlog";
import { NEWS_VLOG_HUB_TABS } from "@/constants/hub";
import { NewsClient } from "@/components/features/news/NewsClient";
import { VlogsSpoke } from "./spokes/vlogs/VlogsSpoke";

const SPOKES: Record<NewsVlogTabKey, () => React.ReactNode> = {
    news: () => <NewsClient />,
    vlogs: () => <VlogsSpoke />,
};

/** News & Vlog hub: articles and videos stay separate resources under one roof. */
export function NewsVlogClient() {
    const hub = useHubTab<NewsVlogTabKey>(NEWS_VLOG_HUB_TABS);
    const articles = useNewsStore((state) => state.articles);
    const vlogs = useVlogStore((state) => state.vlogs);

    const { kpis, groups } = React.useMemo(() => {
        const liveVlogs = vlogs.filter((vlog) => vlog.status === "Active").length;
        const kpis: HubKpi[] = [
            { id: "news", label: "News Articles", value: String(articles.length), hint: `${articles.filter((article) => article.seo).length} with SEO metadata`, icon: Newspaper, tone: "blue" },
            { id: "vlogs", label: "Vlogs", value: String(vlogs.length), hint: `${liveVlogs} live on the storefront`, icon: Video, tone: "rose" },
        ];
        const groups: HubSpokeGroup<NewsVlogTabKey>[] = [{
            title: "Storefront Content",
            description: "Written news and video vlogs published to the storefront.",
            spokes: [
                { id: "news", label: "News", description: "Articles with rich text, cover image and SEO", icon: Newspaper, tone: "blue", count: articles.length },
                { id: "vlogs", label: "Vlog", description: "Video posts from YouTube, Vimeo or a direct link", icon: Video, tone: "rose", count: vlogs.length },
            ],
        }];
        return { kpis, groups };
    }, [articles, vlogs]);

    return (
        <UniversalHubShell
            title="News & Vlog"
            subtitle="News articles and video vlogs for the storefront."
            icon={Newspaper}
            groups={groups}
            kpis={kpis}
            hub={hub}
            renderSpoke={(tab) => SPOKES[tab]()}
        />
    );
}
