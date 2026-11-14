import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Old address; the page is now a full-page spoke.
export default async function ConfirmOrdersRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/orders/all-orders", searchParams, {status: "Confirmed"});
}
