import { useMemo } from "react";
import { Newspaper, Video } from "lucide-react";
import { useNewsStore } from "@/store/useNewsStore";
import { useVlogStore } from "@/store/useVlogStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { NewsVlogTabKey } from "@/types/newsVlog";
import { NEWS_VLOG_HUB, NEWS_VLOG_SPOKE_SLUGS, spokeHref } from "@/constants/hubRoutes";

/** News & Vlog hub KPIs and spoke cards (articles and videos stay separate resources). */
export function useNewsVlogOverview(): { kpis: HubKpi[]; groups: HubSpokeGroup<NewsVlogTabKey>[] } {
    const articles = useNewsStore((state) => state.articles);
    const vlogs = useVlogStore((state) => state.vlogs);

    return useMemo(() => {
        const liveVlogs = vlogs.filter((vlog) => vlog.status === "Active").length;
        const kpis: HubKpi[] = [
            { id: "news", label: "News Articles", value: String(articles.length), hint: `${articles.filter((article) => article.seo).length} with SEO metadata`, icon: Newspaper, tone: "blue" },
            { id: "vlogs", label: "Vlogs", value: String(vlogs.length), hint: `${liveVlogs} live on the storefront`, icon: Video, tone: "rose" },
        ];
        const groups: HubSpokeGroup<NewsVlogTabKey>[] = [{
            title: "Storefront Content",
            description: "Written news and video vlogs published to the storefront.",
            spokes: [
                { id: "news", href: spokeHref(NEWS_VLOG_HUB, NEWS_VLOG_SPOKE_SLUGS.news), label: "News", description: "Articles with rich text, cover image and SEO", icon: Newspaper, tone: "blue", count: articles.length },
                { id: "vlogs", href: spokeHref(NEWS_VLOG_HUB, NEWS_VLOG_SPOKE_SLUGS.vlogs), label: "Vlog", description: "Video posts from YouTube, Vimeo or a direct link", icon: Video, tone: "rose", count: vlogs.length },
            ],
        }];
        return { kpis, groups };
    }, [articles, vlogs]);
}
