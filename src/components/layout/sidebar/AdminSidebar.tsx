"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSidebarSearch } from "@/hooks/useSidebarSearch";
import { SidebarSection } from "./SidebarSection";
import { Search, LayoutGrid, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminSidebar() {
    const { search, setSearch, filteredNav } = useSidebarSearch();

    return (
        <aside className="hidden md:flex w-[280px] h-screen flex-col border-r border-brand-subtext/20 bg-brand-bg shrink-0">
            <div className="p-4">

                {/* Immersive Animated Brand Header Wrapper */}
                <div className="group relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-brand-primary via-yellow-200 to-brand-primary p-[2px] shadow-sm animate-gradient-pan transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-primary/30">

                    {/* The Lightning Bolt Sweep */}
                    <div className="pointer-events-none absolute inset-0 z-20 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent animate-lightning-sweep" />

                    {/* Inner Link Container */}
                    <Link
                        href="/admin"
                        className="relative z-10 flex h-full w-full items-center justify-between rounded-[10px] bg-white p-3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex shrink-0 items-center justify-center">
                                <Image src="/logo.svg" alt="Salamat Logo" width={40} height={40} />
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="truncate text-lg font-bold leading-tight text-brand-text transition-colors group-hover:text-brand-primary">
                                    Salamat Innovation
                                </h2>
                                <span className="block truncate text-xs text-brand-subtext">
                                    Admin dashboard
                                </span>
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
                        sectionIcon={<LayoutGrid className="h-5 w-5 text-brand-text" />}
                    />
                ))}
            </div>
        </aside>
    );
}