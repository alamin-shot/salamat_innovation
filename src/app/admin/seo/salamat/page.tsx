import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

const SECTIONS = ["pages", "products", "categories", "brands"];

// Moved into the SEO hub (Page Metadata spoke, salamat selected in the header switch).
// The old page used ?tab= for its section; the hub uses ?tab= for spokes, so it becomes ?section=.
export default async function SalamatSeoRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    const oldSection = (await searchParams).tab;
    const section: Record<string, string> = typeof oldSection === "string" && SECTIONS.includes(oldSection) ? { section: oldSection } : {};
    return redirectToHub("/admin/seo", searchParams, { tab: "page_metadata", platform: "salamat", ...section });
}
