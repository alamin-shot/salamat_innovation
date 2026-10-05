"use client";
import * as React from "react";
import { useState, useMemo } from "react";
import { NAVIGATION_DATA } from "@/constants/navigation";
import { SidebarSection } from "./SidebarSection";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminSidebar() {
    const [search, setSearch] = useState("");
    const [openSection, setOpenSection] = useState<string | null>(NAVIGATION_DATA[0]?.title || null);

    const filteredNav = useMemo(() => {
        if (!search) return NAVIGATION_DATA;
        const lowerSearch = search.toLowerCase();
        return NAVIGATION_DATA.map((section) => ({
            ...section,
            items: section.items.filter((item) => item.title.toLowerCase().includes(lowerSearch)),
        })).filter((section) => section.items.length > 0);
    }, [search]);

    return (
        <aside className="hidden md:flex w-[280px] h-screen bg-brand-bg flex-col border-r border-brand-subtext/20 shrink-0">
            <div className="p-4">
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-text font-bold text-brand-primary">
                        SI
                    </div>
                    <div>
                        <h2 className="text-sm font-bold leading-tight text-brand-primary">Salamat Innovation</h2>
                        <span className="text-xs text-brand-subtext">User dashboard</span>
                    </div>
                </div>
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-subtext" />
                    <Input
                        placeholder="Search"
                        className="border-0 bg-brand-subtext/10 pl-9 shadow-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide">
                {filteredNav.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                        isOpen={openSection === section.title || !!search}
                        onToggle={() => setOpenSection(openSection === section.title ? null : section.title)}
                    />
                ))}
            </div>
        </aside>
    );
}