"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ProductStatus, RecordStatus } from "@/types/products";

interface StatusDropdownProps {
    status: ProductStatus;
    onChange: (status: RecordStatus) => void;
}

/** Active / Inactive status pill. Same look as the original Products page status cell. */
export const StatusDropdown = React.memo(function StatusDropdown({ status, onChange }: StatusDropdownProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors outline-none cursor-pointer ${status === "Active"
                ? "bg-green-500/10 text-green-700 ring-green-600/20 hover:bg-green-500/20"
                : "bg-red-500/10 text-red-700 ring-red-600/20 hover:bg-red-500/20"
                }`}>
                <span>{status}</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                    <DropdownMenu.Item onClick={() => onChange("Active")} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 outline-none">
                        Active
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => onChange("Inactive")} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 outline-none">
                        Inactive
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
});

StatusDropdown.displayName = "StatusDropdown";
