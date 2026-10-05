"use client";
import * as React from "react";
import { SidebarLink } from "./SidebarLink";
import type { NavSection } from "@/constants/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
    section: NavSection;
    isOpen: boolean;
    onToggle: () => void;
    sectionIcon?: React.ReactNode;
}

export function SidebarSection({ section, isOpen, onToggle, sectionIcon }: SidebarSectionProps) {
    return (
        <div className="mb-6">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between px-2 py-2 text-brand-text transition-colors hover:text-brand-primary"
            >
                <div className="flex items-center gap-2 font-semibold">
                    {sectionIcon && <span className="flex h-5 w-5 items-center justify-center">{sectionIcon}</span>}
                    <span className="text-base">{section.title}</span>
                </div>
                <ChevronDown
                    className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")}
                />
            </button>
            <div className="mt-2 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="accordion-wrapper" data-state={isOpen ? "open" : "closed"}>
                    <div className="accordion-inner flex flex-col">
                        {section.items.map((item) => (
                            <SidebarLink key={item.title} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}