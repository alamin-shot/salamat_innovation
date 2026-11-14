import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Old address; the page is now a full-page spoke.
export default async function NewsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/news-vlog/news", searchParams, {});
}
