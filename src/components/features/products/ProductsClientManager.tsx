"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { ProductTable } from "@/components/features/products/ProductTable";
import { ProductMasterForm } from "@/components/features/products/ProductMasterForm";
import { SpecificationsForm } from "@/components/features/products/SpecificationsForm";
import { CareForm } from "@/components/features/products/CareForm";
import { VariantsManager } from "@/components/features/products/VariantsManager";
import { ProductPreviewContent } from "@/components/features/products/ProductPreviewContent";

export function ProductsClientManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeDrawer = searchParams.get("drawer");
    const activeId = searchParams.get("id");

    const [persistedDrawer, setPersistedDrawer] = React.useState(activeDrawer);
    const [persistedId, setPersistedId] = React.useState(activeId);

    // Sync from URL
    React.useEffect(() => {
        if (activeDrawer) {
            setPersistedDrawer(activeDrawer);
            setPersistedId(activeId);
        }
    }, [activeDrawer, activeId]);

    // Listen for Route/Navigation changes and instantly hide the drawer
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
            case "add-product": return "Add New Product";
            case "edit": return "Edit Product";
            case "preview": return "Live Storefront Preview";
            case "specs": return "Product Specifications";
            case "variants": return "Manage Variants";
            case "care": return "Product Care Instructions";
            default: return "";
        }
    };

    const renderDrawerContent = () => {
        switch (persistedDrawer) {
            case "add-product":
            case "edit":
                return (
                    <ProductMasterForm
                        productId={persistedId}
                        onCancel={closeDrawer}
                        onSave={() => closeDrawer()}
                    />
                );
            case "preview": return <ProductPreviewContent productId={persistedId} />;
            case "specs": return <SpecificationsForm productId={persistedId} />;
            case "variants": return <VariantsManager productId={persistedId} />;
            case "care": return <CareForm productId={persistedId} />;
            default: return null;
        }
    };

    return (
        <>
            <ProductTable />

            <Drawer
                title={getDrawerTitle()}
                isOpen={!!activeDrawer}
                onClose={closeDrawer}
                width={
                    persistedDrawer === "add-product" || persistedDrawer === "edit" || persistedDrawer === "preview"
                        // Wide Drawers: Full width on mobile, fills remaining screen on desktop
                        ? "w-full max-w-none lg:w-[calc(100vw-280px)]"
                        // Standard Drawers (Specs, Variants, Care): Full width on mobile, strictly 600px on tablet/desktop
                        : "w-full max-w-none sm:max-w-[600px]"
                }
            >
                {renderDrawerContent()}
            </Drawer>
        </>
    );
}