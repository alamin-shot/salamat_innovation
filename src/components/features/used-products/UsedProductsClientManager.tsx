"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { UsedProductTable } from "@/components/features/used-products/UsedProductTable";
import { UsedProductMasterForm } from "@/components/features/used-products/UsedProductMasterForm";
import { ProductPreviewContent } from "@/components/features/products/ProductPreviewContent";

export function UsedProductsClientManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeDrawer = searchParams.get("drawer");
    const activeId = searchParams.get("id");

    const [persistedDrawer, setPersistedDrawer] = React.useState(activeDrawer);
    const [persistedId, setPersistedId] = React.useState(activeId);

    React.useEffect(() => {
        if (activeDrawer) {
            setPersistedDrawer(activeDrawer);
            setPersistedId(activeId);
        }
    }, [activeDrawer, activeId]);

    React.useEffect(() => {
        setPersistedDrawer(null);
    }, [pathname]);

    const closeDrawer = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("drawer");
        params.delete("id");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getDrawerTitle = () => {
        switch (persistedDrawer) {
            case "add-used": return "Add Used Product";
            case "edit-used": return "Update Used Product";
            case "preview": return "Live Storefront Preview";
            default: return "";
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Used Products</h1>
                        <p className="text-xs sm:text-sm text-brand-subtext">Manage pre-owned inventory, serial numbers, and pricing</p>
                    </div>
                    <button
                        onClick={() => router.push(`${pathname}?drawer=add-used`)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                        + Add Used Product
                    </button>
                </div>

                <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1">
                    <UsedProductTable />
                </div>
            </div>

            <Drawer
                title={getDrawerTitle()}
                isOpen={!!activeDrawer}
                onClose={closeDrawer}
                width={
                    persistedDrawer === "preview"
                        ? "w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
                        : "w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
                }
            >
                {persistedDrawer === "add-used" || persistedDrawer === "edit-used" ? (
                    <UsedProductMasterForm productId={persistedId} onCancel={closeDrawer} onSave={closeDrawer} />
                ) : persistedDrawer === "preview" ? (
                    <ProductPreviewContent productId={persistedId} />
                ) : null}
            </Drawer>
        </>
    );
}