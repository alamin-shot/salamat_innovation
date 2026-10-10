"use client";
import * as React from "react";
import { useCommandParams } from "@/hooks/useCommandParams";
import { PagesTable } from "./PagesTable";
import { PageEditModal } from "./PageEditModal";

export function PagesClientManager() {
    const { activeModal, activeId, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Pages</h1>
                    <p className="text-xs sm:text-sm text-brand-subtext">Manage storefront banners and core navigation page media</p>
                </div>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1">
                <PagesTable />
            </div>

            <PageEditModal
                isOpen={activeModal === "edit"}
                pageId={activeId}
                onClose={closeView}
            />
        </div>
    );
}