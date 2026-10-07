"use client";
import * as React from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { Product } from "@/types/product";
import {
    Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell
} from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { ProductActionMenu } from "@/components/features/products/ProductActionMenu";

const MOCK_PRODUCTS: Product[] = [
    { id: "1", name: "vivo S2", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "2", name: "vivo S50 Pro mini", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "3", name: "Portable Mini Air Cooler", category: "Desk Fan", brand: "Non Brand", status: "Active", ecommerce: false, createdAt: "04-10-2026" },
    { id: "4", name: "xiaomi 14", category: "Smart Phones", brand: "Xiaomi", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "5", name: "realme narzo n10", category: "Smart Phones", brand: "Realme", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "6", name: "smart watch", category: "Wearables", brand: "Non Brand", status: "Active", ecommerce: false, createdAt: "04-10-2026" },
    { id: "7", name: "infinix note 15", category: "Smart Phones", brand: "Infinix", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "8", name: "redmi watch", category: "Wearables", brand: "Xiaomi", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "9", name: "air cooler", category: "Desk Fan", brand: "Non Brand", status: "Active", ecommerce: false, createdAt: "04-10-2026" },
];

export function ProductTable() {
    const {
        data, searchQuery, setSearchQuery, sortKey, sortDirection, handleSort
    } = useDataTable<Product>(MOCK_PRODUCTS, ["name", "category", "brand"]);

    const [selectedStatus, setSelectedStatus] = React.useState<string>("");
    const [selectedBrand, setSelectedBrand] = React.useState<string>("");

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
        name: true,
        category: true,
        brand: true,
        status: true,
        ecommerce: true,
        createdAt: true,
    });

    const handleToggleColumn = (key: string) => {
        setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleResetColumns = () => {
        setVisibleColumns({
            name: true,
            category: true,
            brand: true,
            status: true,
            ecommerce: true,
            createdAt: true,
        });
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Responsive Top Toolbar: Filters & Columns Dropdown */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-brand-subtext/20 bg-white">
                <div className="w-full overflow-x-auto custom-scrollbar">
                    <FilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilterCount={(selectedStatus ? 1 : 0) + (selectedBrand ? 1 : 0)}
                        onClearFilters={() => {
                            setSelectedStatus("");
                            setSelectedBrand("");
                            setSearchQuery("");
                        }}
                    >
                        <FilterDropdown
                            label="Category"
                            options={[
                                { label: "Smart Phones", value: "smartphones" },
                                { label: "Wearables", value: "wearables" },
                                { label: "Desk Fan", value: "deskfan" },
                            ]}
                            onSelect={() => { }}
                        />
                        <FilterDropdown
                            label="Brand"
                            options={[
                                { label: "VIVO", value: "vivo" },
                                { label: "Xiaomi", value: "xiaomi" },
                                { label: "Realme", value: "realme" },
                                { label: "Infinix", value: "infinix" },
                                { label: "Apple", value: "apple" }
                            ]}
                            selectedValue={selectedBrand}
                            onSelect={setSelectedBrand}
                        />
                        <FilterDropdown
                            label="Status"
                            options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" }
                            ]}
                            selectedValue={selectedStatus}
                            onSelect={setSelectedStatus}
                        />
                    </FilterBar>
                </div>

                <div className="w-full lg:w-auto flex lg:justify-end shrink-0 px-4 pb-3 pt-0 lg:px-4 lg:py-3">
                    <ColumnsVisibilityDropdown
                        columns={[
                            { key: "name", label: "Name" },
                            { key: "category", label: "Category" },
                            { key: "brand", label: "Brand" },
                            { key: "status", label: "Status" },
                            { key: "ecommerce", label: "Ecommerce" },
                            { key: "createdAt", label: "Created at" },
                        ]}
                        visibleColumns={visibleColumns}
                        onToggleColumn={handleToggleColumn}
                        onReset={handleResetColumns}
                    />
                </div>
            </div>

            <div className="overflow-x-auto mt-0">
            <Table>
                <TableHeader>
                    {visibleColumns.name !== false && (
                        <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>
                            Name
                        </TableHeadCell>
                    )}
                    {visibleColumns.category !== false && (
                        <TableHeadCell sortable activeDirection={sortKey === "category" ? sortDirection : null} onClick={() => handleSort("category")}>
                            Category
                        </TableHeadCell>
                    )}
                    {visibleColumns.brand !== false && (
                        <TableHeadCell sortable activeDirection={sortKey === "brand" ? sortDirection : null} onClick={() => handleSort("brand")}>
                            Brand
                        </TableHeadCell>
                    )}
                    {visibleColumns.status !== false && (
                        <TableHeadCell>Status</TableHeadCell>
                    )}
                    {visibleColumns.ecommerce !== false && (
                        <TableHeadCell>Ecommerce</TableHeadCell>
                    )}
                    {visibleColumns.createdAt !== false && (
                        <TableHeadCell sortable activeDirection={sortKey === "createdAt" ? sortDirection : null} onClick={() => handleSort("createdAt")}>
                            Created at
                        </TableHeadCell>
                    )}
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>

                <TableBody>
                    {data.map((product) => (
                        <TableRow key={product.id}>
                            {visibleColumns.name !== false && (
                                <TableCell className="font-medium">{product.name}</TableCell>
                            )}
                            {visibleColumns.category !== false && (
                                <TableCell>{product.category}</TableCell>
                            )}
                            {visibleColumns.brand !== false && (
                                <TableCell>{product.brand}</TableCell>
                            )}
                            {visibleColumns.status !== false && (
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        {product.status}
                                    </span>
                                </TableCell>
                            )}
                            {visibleColumns.ecommerce !== false && (
                                <TableCell>
                                    <span className="inline-flex cursor-pointer items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-500/20 ring-1 ring-inset ring-yellow-600/20">
                                        {product.ecommerce ? "Enabled" : "Disabled"}
                                    </span>
                                </TableCell>
                            )}
                            {visibleColumns.createdAt !== false && (
                                <TableCell>{product.createdAt}</TableCell>
                            )}
                            <TableCell className="text-right">
                                <ProductActionMenu productId={product.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}