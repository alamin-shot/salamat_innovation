"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { BrandsTable } from "./BrandsTable";
import { BrandMasterForm } from "./BrandMasterForm";
import { BrandReorderList } from "./BrandReorderList";

export function BrandsClientManager() {
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
            case "add": return "Add Brand";
            case "edit": return "Update Brand";
            case "reorder": return "Reorder Brands";
            default: return "";
        }
    };

    return (
        <>
            <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
                {/* Header matching legacy layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Brands</h1>
                        <p className="text-xs sm:text-sm text-brand-subtext">Manage manufacturer catalog, app links, and branding</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push(`${pathname}?drawer=reorder`, { scroll: false })}
                            className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                        >
                            Reorder Brands
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push(`${pathname}?drawer=add`, { scroll: false })}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                        >
                            + Add Brand
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1">
                    <BrandsTable />
                </div>
            </div>

            {/* URL Driven Drawer */}
            <Drawer
                title={getDrawerTitle()}
                isOpen={!!activeDrawer}
                onClose={closeDrawer}
                width={
                    persistedDrawer === "reorder"
                        ? "w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
                        : "w-[100vw] max-w-[100vw] lg:max-w-none lg:w-[calc(100vw-280px)]"
                }
            >
                {persistedDrawer === "add" || persistedDrawer === "edit" ? (
                    <BrandMasterForm
                        brandId={persistedId}
                        onCancel={closeDrawer}
                        onSave={closeDrawer}
                    />
                ) : persistedDrawer === "reorder" ? (
                    <BrandReorderList onBack={closeDrawer} />
                ) : null}
            </Drawer>
        </>
    );
}