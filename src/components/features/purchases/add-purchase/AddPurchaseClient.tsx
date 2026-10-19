"use client";
import * as React from "react";
import { AddPurchaseForm } from "./AddPurchaseForm";
import { AddSupplierModal } from "./AddSupplierModal";
import { useCommandParams } from "@/hooks/shared_hooks/useCommandParams";

export function AddPurchaseClient() {
    const { activeModal, closeView } = useCommandParams();

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">Create Purchase</h1>
            </div>

            <div className="w-full pb-12">
                <AddPurchaseForm />
            </div>

            <AddSupplierModal
                isOpen={activeModal === "add-supplier"}
                onClose={closeView}
            />
        </div>
    );
}