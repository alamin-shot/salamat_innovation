"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { ProductTable } from "@/components/features/products/ProductTable";
import { ProductForm } from "@/components/features/products/ProductForm";
import { SpecificationsForm } from "@/components/features/products/SpecificationsForm";
import { CareForm } from "@/components/features/products/CareForm";
import { VariantsManager } from "@/components/features/products/VariantsManager";

export function ProductsClientManager() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeDrawer = searchParams.get("drawer");
    const activeId = searchParams.get("id");

    // Memory Cache for smooth slide-out animation
    const [persistedDrawer, setPersistedDrawer] = React.useState(activeDrawer);
    const [persistedId, setPersistedId] = React.useState(activeId);

    React.useEffect(() => {
        if (activeDrawer) {
            setPersistedDrawer(activeDrawer);
            setPersistedId(activeId);
        }
    }, [activeDrawer, activeId]);

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
            case "specs": return "Product Specifications";
            case "variants": return "Manage Variants";
            case "care": return "Product Care Instructions";
            default: return "";
        }
    };

    const renderDrawerContent = () => {
        switch (persistedDrawer) {
            case "add-product": return <ProductForm />;
            case "edit": return <ProductForm />;
            case "specs": return <SpecificationsForm productId={persistedId} />;
            case "variants": return <VariantsManager />;
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
                width={persistedDrawer === "add-product" || persistedDrawer === "edit" ? "w-full max-w-[1000px]" : "w-full max-w-[600px]"}
            >
                {renderDrawerContent()}
            </Drawer>
        </>
    );
}