"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { PagesTable } from "./PagesTable";
import { PageEditDrawer } from "./PageEditDrawer";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function PagesClientManager() {
    const manager = useProductsManager("pages");

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Pages</h1>
                            <p className="text-xs sm:text-sm text-brand-subtext">Manage storefront banners and core navigation page media</p>
                        </div>
                    </div>
                }
            >
                <PagesTable manager={manager} />
            </SectionPageShell>

            <PageEditDrawer manager={manager} />
        </>
    );
}
