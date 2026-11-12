"use client";
import * as React from "react";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { PagesTable } from "./PagesTable";
import { PageEditDrawer } from "./PageEditDrawer";

export function PagesClientManager() {
    const manager = useProductsManager("pages");

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Pages</h1>
                    <p className="text-xs sm:text-sm text-brand-subtext">Manage storefront banners and core navigation page media</p>
                </div>
            </div>

            <div className={`rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1 transition-opacity duration-200 ${manager.isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <PagesTable manager={manager} />
            </div>

            <PageEditDrawer manager={manager} />
        </div>
    );
}
