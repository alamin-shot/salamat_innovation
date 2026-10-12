"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useCommandParams } from "@/hooks/useCommandParams";
import { useTableManager } from "@/hooks/useTableManager";

export interface Brand {
    id: string;
    name: string;
    logo: string;
    totalProducts: number;
    tagline: string;
    primaryLogo: string;
    shopBanner: string;
    infoBanner: string;
    status: "Visible" | "Hidden";
}

const MOCK_BRANDS: Brand[] = [
    { id: "1", name: "Apple", logo: "/phone.png", totalProducts: 61, tagline: "Think Different", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Visible" },
    { id: "2", name: "Google", logo: "/phone.png", totalProducts: 23, tagline: "Do the right thing", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Visible" },
    { id: "3", name: "SAMSUNG", logo: "/phone.png", totalProducts: 72, tagline: "Inspire the World, Create the Future", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Visible" },
    { id: "4", name: "Xiaomi", logo: "/phone.png", totalProducts: 129, tagline: "Innovation for everyone", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Visible" },
    { id: "5", name: "Nothing", logo: "/phone.png", totalProducts: 11, tagline: "Make Tech Fun Again", primaryLogo: "/phone.png", shopBanner: "/banner.png", infoBanner: "/banner.png", status: "Visible" }
];

export function BrandsTable() {
    const { openView } = useCommandParams();
    const table = useTableManager(MOCK_BRANDS, (brand, query) =>
        brand.name.toLowerCase().includes(query.toLowerCase()) ||
        brand.tagline.toLowerCase().includes(query.toLowerCase())
    );

    const handleStatusChange = (id: string, nextStatus: "Visible" | "Hidden") => {
        table.setData(prev => prev.map(b => b.id === id ? { ...b, status: nextStatus } : b));
        toast.success(`Brand status set to ${nextStatus}.`);
    };


    const handleDelete = (id: string) => {
        table.setData(prev => prev.filter(b => b.id !== id));
        table.setSelectedIds(prev => prev.filter(itemId => itemId !== id));
        toast.success("Brand deleted successfully.");
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <FilterBar searchQuery={table.searchQuery} onSearchChange={table.setSearchQuery} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-[48px] px-4">
                            <input
                                type="checkbox"
                                checked={table.selectedIds.length === table.filteredData.length && table.filteredData.length > 0}
                                onChange={(e) => table.handleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                            />
                        </TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell className="text-center">Total Products</TableHeadCell>
                        <TableHeadCell>Tagline</TableHeadCell>
                        <TableHeadCell className="text-center">Primary Logo</TableHeadCell>
                        <TableHeadCell className="text-center">Shop Banner</TableHeadCell>
                        <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {table.filteredData.map((brand) => (
                            <TableRow key={brand.id} className={table.selectedIds.includes(brand.id) ? "bg-emerald-50/30" : ""}>
                                <TableCell className="w-[48px] px-4">
                                    <input
                                        type="checkbox"
                                        checked={table.selectedIds.includes(brand.id)}
                                        onChange={(e) => table.handleSelectRow(brand.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                    />
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-8 w-8 overflow-hidden rounded-md border border-brand-subtext/15 bg-brand-bg shrink-0">
                                            <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1" />
                                        </div>
                                        <span className="font-medium text-brand-text">{brand.name}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-center font-medium text-brand-text">{brand.totalProducts}</TableCell>
                                <TableCell><span className="text-sm text-brand-subtext">{brand.tagline}</span></TableCell>

                                <TableCell className="text-center">
                                    <div className="relative mx-auto h-8 w-8 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                                        <Image src={brand.primaryLogo} alt="Primary" fill className="object-contain p-0.5" />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                                        <Image src={brand.shopBanner} alt="Shop Banner" fill className="object-cover" />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                                        <Image src={brand.infoBanner} alt="Info Banner" fill className="object-cover" />
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold outline-none transition-colors cursor-pointer ${brand.status === "Visible"
                                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                            }`}>
                                            <span>{brand.status}</span>
                                            <ChevronDown className="h-3 w-3 opacity-70" />
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content align="start" className="z-50 w-28 rounded-md border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
                                                <DropdownMenu.Item onClick={() => handleStatusChange(brand.id, "Visible")} className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 outline-none">
                                                    Visible
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item onClick={() => handleStatusChange(brand.id, "Hidden")} className="cursor-pointer rounded px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 outline-none">
                                                    Hidden
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => openView("drawer", "edit", brand.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                            title="Edit Brand"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
                                            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Delete Brand"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BulkActionBar selectedCount={table.selectedIds.length} onClearSelection={table.clearSelection}>
                <button
                    onClick={() => {
                        table.setData(prev => prev.filter(b => !table.selectedIds.includes(b.id)));
                        toast.success(`Deleted ${table.selectedIds.length} brands`);
                        table.clearSelection();
                    }}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Delete All</span>
                </button>
            </BulkActionBar>
        </div>
    );
}