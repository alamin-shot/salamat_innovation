"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { CategoryReorderTree } from "./CategoryReorderTree";
import { CategoryMasterForm } from "./CategoryMasterForm";
import { CategoriesTable } from "./CategoriesTable";
import { useProductsManager } from "@/hooks/products_hooks/useProductsManager";
import { SectionPageShell } from "@/components/layout/SectionPageShell";

export function CategoriesClientManager() {
    const manager = useProductsManager("categories");

    // This stays local since it dictates the internal view of the drawer, not the URL
    const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

    const handleCloseDrawer = () => {
        manager.closeDrawer();
        setSelectedCategoryId(null);
    };

    return (
        <>
            <SectionPageShell
                isPending={manager.isPending}
                header={
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Categories</h1>
                            <p className="text-xs sm:text-sm text-brand-subtext">Manage product taxonomy and storefront hierarchy</p>
                        </div>
                        <button
                            onClick={() => manager.openDrawer("drawer", "reorder")}
                            className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                        >
                            Reorder Category
                        </button>
                    </div>
                }
            >
                <CategoriesTable manager={manager} />
            </SectionPageShell>

            <Drawer
                title="Manage Categories"
                isOpen={manager.drawerMode === "reorder"}
                onClose={handleCloseDrawer}
                width="w-[100vw] max-w-[100vw]" // Full width drawer
            >
                <div className="flex h-full flex-col lg:flex-row bg-brand-bg/30">
                    {/* LEFT COLUMN: Drag and Drop Tree */}
                    <div className="w-full lg:w-[45%] border-r border-brand-subtext/20 bg-white p-6 overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-brand-text">Hierarchy Tree</h2>
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                                + Create Category
                            </button>
                        </div>
                        <CategoryReorderTree onSelectCategory={setSelectedCategoryId} activeId={selectedCategoryId} />
                    </div>

                    {/* RIGHT COLUMN: Data Form */}
                    <div className="w-full lg:w-[55%] p-6 overflow-y-auto custom-scrollbar">
                        <CategoryMasterForm categoryId={selectedCategoryId} onSave={handleCloseDrawer} />
                    </div>
                </div>
            </Drawer>
        </>
    );
}