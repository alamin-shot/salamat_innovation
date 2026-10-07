"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import {
    MoreVertical, Edit, Layers, XCircle, Zap, Clock, Package,
    Tag, ShieldCheck, MinusCircle, Globe, AlertTriangle, RefreshCw, Heart
} from "lucide-react";

interface ProductActionMenuProps {
    productId: string;
}

export function ProductActionMenu({ productId }: ProductActionMenuProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const openDrawer = (drawerType: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", drawerType);
        params.set("id", productId);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Mock API Mutations for direct actions
    const handleAction = (message: string) => toast.success(message);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-brand-bg hover:text-brand-text focus:outline-none">
                <MoreVertical className="h-4 w-4" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={4}
                    collisionPadding={24}

                    className="z-[100] w-56 max-h-70 overflow-y-auto custom-scrollbar rounded-lg border border-brand-subtext/20 bg-brand-text py-1 text-white shadow-xl animate-in fade-in zoom-in-95"
                >
                    <DropdownMenu.Item onClick={() => openDrawer("edit")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Edit className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Edit
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => openDrawer("variants")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Layers className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Variants
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Product marked as Inactive")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <XCircle className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Inactive
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Product marked as Featured")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Zap className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Mark as Featured
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Product marked as Coming Soon")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Clock className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Mark as Coming Soon
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Product marked as Arrival")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Package className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Mark as Arrival
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => openDrawer("specs")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Tag className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Specifications
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Official Warranty Added")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-green-400 outline-none hover:bg-brand-subtext/20">
                        <ShieldCheck className="mr-3 h-4 w-4 shrink-0" /> Add Official Warranty
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Ecommerce Disabled")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <MinusCircle className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Disable Ecommerce
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Chinese Badge Added")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Globe className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Add Chinese Badge
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Unofficial Badge Added")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <AlertTriangle className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Add Unofficial Badge
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => handleAction("Refurbished Badge Added")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <RefreshCw className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Add Refurbished Badge
                    </DropdownMenu.Item>

                    <DropdownMenu.Item onClick={() => openDrawer("care")} className="flex w-full cursor-pointer items-center px-4 py-2 text-sm outline-none hover:bg-brand-subtext/20">
                        <Heart className="mr-3 h-4 w-4 shrink-0 text-brand-subtext" /> Care
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}