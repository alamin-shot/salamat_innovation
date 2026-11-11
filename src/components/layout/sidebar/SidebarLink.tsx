import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";
import { getSubItemColor } from "@/utils/getNavIcon";

interface SidebarLinkProps {
    item: NavItem;
    isActive?: boolean;
    icon?: React.ReactNode;
}

export function SidebarLink({ item, isActive }: SidebarLinkProps) {
    const ItemIcon = item.icon;
    const colorClasses = item.color || getSubItemColor(item.title);

    return (
        <Link
            href={item.href}
            className={cn(
                "group flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-all hover:bg-brand-bg/60 hover:text-brand-primary border-b border-brand-subtext/10 last:border-b-0",
                isActive ? "text-brand-primary bg-brand-bg/50 font-semibold" : "text-brand-text"
            )}
        >
            <span
                className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg border shrink-0 transition-transform duration-200 group-hover:scale-105",
                    colorClasses
                )}
            >
                <ItemIcon className="w-4 h-4" />
            </span>
            <span className="truncate">{item.title}</span>
        </Link>
    );
}