import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Moved into the Orders hub; old links land on the matching tab.
export default async function PendingOrdersRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/orders", searchParams, { tab: "orders", status: "Pending" });
}
