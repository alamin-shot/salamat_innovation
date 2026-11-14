import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Old address; the page is now a full-page spoke.
export default async function DamageProductsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/operations/damage-products", searchParams, {});
}
