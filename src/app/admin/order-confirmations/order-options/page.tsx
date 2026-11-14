import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Old address; the page is now a full-page spoke.
export default async function OrderOptionsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/orders/order-options", searchParams, {});
}
