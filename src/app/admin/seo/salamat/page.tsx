import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

const SECTIONS = ["pages", "products", "categories", "brands"];

// Old Salamat SEO page → Page Metadata spoke with salamat selected. Its old ?tab= section opens that section's page.
export default async function SalamatSeoRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    const oldSection = (await searchParams).tab;
    const section = typeof oldSection === "string" && SECTIONS.includes(oldSection) ? oldSection : "pages";
    return redirectToHub(`/admin/seo/page-metadata/${section}`, searchParams, { platform: "salamat" });
}
