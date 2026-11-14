import { useMemo } from "react";
import { CheckCircle2, CircleSlash, FileText, FolderTree, Package, Tag } from "lucide-react";
import { useSeoStore } from "@/store/useSeoStore";
import { HubKpi, HubSpokeGroup } from "@/types/hub";
import { SeoPlatform, SeoTabType } from "@/types/seo";
import { PAGE_METADATA_HUB, PAGE_METADATA_SECTION_SLUGS, spokeHref } from "@/constants/hubRoutes";

/** Page Metadata hub (inside SEO): records per section for the selected storefront. */
export function usePageMetadataOverview(platform: SeoPlatform): { kpis: HubKpi[]; groups: HubSpokeGroup<SeoTabType>[] } {
    const records = useSeoStore((state) => state.records);

    return useMemo(() => {
        const own = records.filter((record) => record.platform === platform);
        const count = (section: SeoTabType) => own.filter((record) => record.type === section).length;
        const active = own.filter((record) => record.status === "Active").length;
        const missingMeta = own.filter((record) => !record.metaTitle.trim() || !record.metaDescription.trim()).length;
        const href = (section: SeoTabType) => spokeHref(PAGE_METADATA_HUB, PAGE_METADATA_SECTION_SLUGS[section], { platform });

        const kpis: HubKpi[] = [
            { id: "records", label: "Metadata Records", value: String(own.length), hint: `${platform === "salamat" ? "Salamat" : "TEKZO"} storefront`, icon: FileText, tone: "blue" },
            { id: "active", label: "Active", value: String(active), hint: "Live on the storefront", icon: CheckCircle2, tone: "emerald" },
            { id: "inactive", label: "Inactive", value: String(own.length - active), hint: "Saved but not published", icon: CircleSlash, tone: own.length - active ? "amber" : "emerald" },
            { id: "missing", label: "Missing Meta", value: String(missingMeta), hint: "Without meta title or description", icon: Tag, tone: missingMeta ? "rose" : "emerald" },
        ];
        const groups: HubSpokeGroup<SeoTabType>[] = [
            {
                title: "Site Pages",
                description: "Static storefront pages such as Home, About and Contact.",
                spokes: [
                    { id: "pages", href: href("pages"), label: "Pages", description: "Meta title, description and tags for storefront pages", icon: FileText, tone: "blue", count: count("pages") },
                ],
            },
            {
                title: "Catalogue",
                description: "Search appearance of products and how they are grouped.",
                spokes: [
                    { id: "products", href: href("products"), label: "Products", description: "Per-product metadata with category and brand", icon: Package, tone: "emerald", count: count("products") },
                    { id: "categories", href: href("categories"), label: "Categories", description: "Category landing page metadata", icon: FolderTree, tone: "violet", count: count("categories") },
                    { id: "brands", href: href("brands"), label: "Brands", description: "Brand landing page metadata", icon: Tag, tone: "amber", count: count("brands") },
                ],
            },
        ];
        return { kpis, groups };
    }, [records, platform]);
}
