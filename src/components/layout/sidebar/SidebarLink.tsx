import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/constants/navigation";

interface SidebarLinkProps {
    item: NavItem;
    isActive?: boolean;
    icon?: React.ReactNode;
}

export function SidebarLink({ item, isActive, icon }: SidebarLinkProps) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-brand-bg hover:text-brand-primary border-b border-brand-subtext/10 last:border-b-0",
                isActive ? "text-brand-primary bg-brand-bg/50" : "text-brand-text"
            )}
        >
            {icon && <span className="flex h-5 w-5 items-center justify-center shrink-0">{icon}</span>}
            <span className="truncate">{item.title}</span>
        </Link>
    );
}