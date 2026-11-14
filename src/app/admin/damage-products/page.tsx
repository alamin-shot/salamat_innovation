import { redirectToHub, PageSearchParams } from "@/utils/hubRedirect";

// Moved into the Operations hub; old links land on the matching tab.
export default async function DamageProductsRedirect({ searchParams }: { searchParams: PageSearchParams }) {
    return redirectToHub("/admin/operations", searchParams, { tab: "damage_products" });
}
