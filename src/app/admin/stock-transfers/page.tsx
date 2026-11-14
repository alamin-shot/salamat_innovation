import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Old address; the page is now a full-page spoke.
export default async function StockTransfersRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/operations/stock-transfers", searchParams, {});
}
