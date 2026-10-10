"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { Edit } from "lucide-react";
import { useCommandParams } from "@/hooks/useCommandParams";
import { useTableManager } from "@/hooks/useTableManager";

export interface PageItem {
    id: string;
    title: string;
    slug: string;
    shop: string;
    avatar?: string;
    shopBanner?: string | null;
    infoBanner?: string | null;
}

const MOCK_PAGES: PageItem[] = [
    { id: "1", title: "home", slug: "home", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "/banner.png", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "2", title: "All Brands", slug: "brands", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Shop", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "3", title: "All Categories", slug: "categories", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Shop", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "4", title: "Shop", slug: "shop", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Shop", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "5", title: "About Us", slug: "about-us", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: null, infoBanner: null },
    { id: "6", title: "Contact Us", slug: "contact-us", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Shop", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "7", title: "Partners", slug: "partners", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: null, infoBanner: null },
    { id: "8", title: "Career", slug: "career", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Shop", infoBanner: "https://placehold.co/100x100/e2e8f0/64748b?text=Info" },
    { id: "9", title: "News", slug: "news", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: null, infoBanner: null },
    { id: "10", title: "Dealer Registration", slug: "dealer-register", shop: "Salamat Innovation", avatar: "/phone.png", shopBanner: null, infoBanner: null },
];

export function PagesTable() {
    const { openView } = useCommandParams();

    const table = useTableManager(MOCK_PAGES, (p, query) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.slug.toLowerCase().includes(query.toLowerCase())
    );
    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <FilterBar searchQuery={table.searchQuery} onSearchChange={table.setSearchQuery} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
                <Table>
                    <TableHeader>
                        <TableHeadCell>Title</TableHeadCell>
                        <TableHeadCell>Slug</TableHeadCell>
                        <TableHeadCell>Shop</TableHeadCell>
                        <TableHeadCell className="text-center">Shop Banner</TableHeadCell>
                        <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.map((page) => (
                            <TableRow key={page.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {page.avatar && (
                                            <div className="relative h-7 w-7 overflow-hidden rounded-md border border-brand-subtext/15 bg-brand-bg shrink-0">
                                                <Image src={page.avatar} alt={page.title} fill className="object-contain p-0.5" />
                                            </div>
                                        )}
                                        <span className="font-medium text-brand-text">{page.title}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <span className="font-mono text-xs text-brand-subtext">{page.slug}</span>
                                </TableCell>

                                <TableCell>
                                    <span className="text-sm text-brand-text">{page.shop}</span>
                                </TableCell>

                                <TableCell className="text-center">
                                    {page.shopBanner ? (
                                        <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                                            <Image src={page.shopBanner} alt="Shop Banner" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <span className="text-brand-subtext/50">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="text-center">
                                    {page.infoBanner ? (
                                        <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                                            <Image src={page.infoBanner} alt="Info Banner" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <span className="text-brand-subtext/50">—</span>
                                    )}
                                </TableCell>

                                <TableCell className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => openView("modal", "edit", page.id)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                        title="Edit Page"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}