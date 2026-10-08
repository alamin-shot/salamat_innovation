"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebarSearch } from "@/hooks/useSidebarSearch";
import { SidebarSection } from "./SidebarSection";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getNavIcon } from "@/utils/getNavIcon";

interface AdminSidebarProps {
    isOpen: boolean;
}

export function AdminSidebar({ isOpen }: AdminSidebarProps) {
    const { search, setSearch, filteredNav } = useSidebarSearch();

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-full lg:w-[280px] shrink-0 flex-col border-r border-brand-subtext/20 bg-brand-bg transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:static lg:translate-x-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"}`}>

            <div className="p-4">
                <div className="group relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary via-yellow-200 to-brand-primary p-[2px] shadow-sm animate-gradient-pan transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-primary/30">
                    <div className="pointer-events-none absolute inset-0 z-20 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent animate-lightning-sweep" />

                    <Link href="/admin" className="relative z-10 flex h-full w-full items-center justify-between rounded-[10px] bg-white p-3 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="flex shrink-0 items-center justify-center">
                                <Image src="/logo.svg" alt="Salamat Logo" width={40} height={40} />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="truncate text-sm font-bold leading-tight text-brand-text transition-colors group-hover:text-brand-primary">
                                    Salamat Innovation
                                </h2>
                                <span className="block truncate text-xs text-brand-subtext">Admin dashboard</span>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-brand-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                    </Link>
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

            <div className="flex-1 overflow-y-auto px-4 pb-24 custom-scrollbar">
                {filteredNav.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                        sectionIcon={getNavIcon(section.title, "h-5 w-5 text-brand-subtext")}
                    />
                ))}
            </div>
        </aside>
    );
}