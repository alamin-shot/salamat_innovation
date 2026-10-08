"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProductActionMenuProps {
    productId: string;
}

export function ProductActionMenu({ productId }: ProductActionMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // The Live Preview Trigger
    const openPreviewDrawer = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", "preview");
        params.set("id", productId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // The Macro Edit Trigger (Opens the 1000px Drawer)
    const openMasterEditDrawer = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", "edit");
        params.set("id", productId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleDelete = () => toast.error("Triggering secure delete confirmation...");

    return (
        <div className="flex items-center justify-end gap-1 sm:gap-2">
            <button
                onClick={openPreviewDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
                title="Live Preview"
            >
                <Eye className="h-4 w-4" />
            </button>
            <button
                onClick={openMasterEditDrawer}
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-amber-50 hover:text-amber-600 focus:outline-none"
                title="Advanced Edit"
            >
                <Edit className="h-4 w-4" />
            </button>
            <button
                onClick={handleDelete}
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none"
                title="Delete Product"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
}