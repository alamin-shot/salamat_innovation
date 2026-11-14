import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Moved into the News & Vlog hub; old links land on the News tab.
export default async function NewsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/news-vlog", searchParams, { tab: "news" });
}
