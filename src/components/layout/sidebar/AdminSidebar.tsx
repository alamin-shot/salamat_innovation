"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebarSearch } from "@/hooks/useSidebarSearch";
import { SidebarSection } from "./SidebarSection";
import { Search, LayoutGrid, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminSidebar() {
    // All business logic is now cleanly abstracted away
    const { search, setSearch, filteredNav } = useSidebarSearch();

    return (
        <aside className="hidden md:flex w-[280px] h-screen bg-brand-bg flex-col border-r border-brand-subtext/20 shrink-0">
            <div className="p-4">
                <Link
                    href="/admin"
                    className="mb-6 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm transition-colors hover:bg-brand-bg/50 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex shrink-0 items-center justify-center">
                            <Image src="/logo.svg" alt="Salamat Logo" width={40} height={40} />
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="truncate text-lg font-bold leading-tight text-brand-primary">Salamat Innovation</h2>
                            <span className="block truncate text-xs text-brand-subtext">Admin dashboard</span>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-subtext transition-transform group-hover:translate-x-1" />
                </Link>

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
            <div className="flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">
                {filteredNav.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                        sectionIcon={<LayoutGrid className="h-5 w-5 text-brand-text" />}
                    />
                ))}
            </div>
        </aside>
    );
}