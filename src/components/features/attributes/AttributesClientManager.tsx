"use client";
import * as React from "react";
import { useCommandParams } from "@/hooks/useCommandParams";
import { AttributesTable } from "./AttributesTable";
import { AttributeModal } from "./AttributeModal";

export function AttributesClientManager() {
    const { activeModal, activeId, openView, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Attributes</h1>
                    <p className="text-xs sm:text-sm text-brand-subtext">Manage global product variant attributes and property values</p>
                </div>

                <button
                    type="button"
                    onClick={() => openView("modal", "add")}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
                >
                    + Add Attribute
                </button>
            </div>

            <div className="rounded-xl border border-brand-subtext/20 bg-white shadow-sm overflow-hidden flex-1">
                <AttributesTable />
            </div>

            <AttributeModal
                isOpen={activeModal === "add" || activeModal === "edit"}
                attributeId={activeId}
                onClose={closeView}
            />
        </div>
    );
}