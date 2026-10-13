"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { AddSaleForm } from "../add-sale/AddSaleForm";

interface EditSaleDrawerProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditSaleDrawer({ id, isOpen, onClose }: EditSaleDrawerProps) {
    if (!id && !isOpen) return null;

    return (
        <Drawer
            title={`Update Sale #${id}`}
            isOpen={isOpen}
            onClose={onClose}
            width="w-full max-w-none lg:w-[calc(100vw-280px)]"
        >
            {/* Natural scrolling wrapper inside the drawer */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <AddSaleForm />
            </div>
        </Drawer>
    );
}