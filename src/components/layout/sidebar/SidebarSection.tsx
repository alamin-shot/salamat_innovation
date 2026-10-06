import * as React from "react";
import { SidebarLink } from "./SidebarLink";
import type { NavSection } from "@/constants/navigation";

interface SidebarSectionProps {
    section: NavSection;
    sectionIcon?: React.ReactNode;
}

export function SidebarSection({ section, sectionIcon }: SidebarSectionProps) {
    return (
        <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 px-2 text-brand-text font-semibold">
                {sectionIcon && <span className="flex h-5 w-5 items-center justify-center">{sectionIcon}</span>}
                <span className="text-base">{section.title}</span>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm flex flex-col">
                {section.items.map((item) => (
                    <SidebarLink key={item.title} item={item} />
                ))}
            </div>
        </div>
    );
}