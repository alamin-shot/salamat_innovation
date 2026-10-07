"use client";
import * as React from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { Product } from "@/types/product";
import {
    Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell
} from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ProductActionMenu } from "@/components/features/products/ProductActionMenu";

// Mock data to demonstrate the table engine
const MOCK_PRODUCTS: Product[] = [
    { id: "1", name: "vivo S2", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "2", name: "vivo S50 Pro mini", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, createdAt: "05-10-2026" },
    { id: "3", name: "Portable Mini Air Cooler", category: "Desk Fan", brand: "Non Brand", status: "Active", ecommerce: false, createdAt: "04-10-2026" },
];

export function ProductTable() {
    const {
        data, searchQuery, setSearchQuery, sortKey, sortDirection, handleSort
    } = useDataTable<Product>(MOCK_PRODUCTS, ["name", "category", "brand"]);

    const [selectedStatus, setSelectedStatus] = React.useState<string>("");
    const [selectedBrand, setSelectedBrand] = React.useState<string>("");

    return (
        <div className="flex flex-col w-full h-full">
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
                        { label: "Power Banks", value: "powerbanks" }
                    ]}
                    onSelect={() => { }}
                />
                <FilterDropdown
                    label="Brand"
                    options={[
                        { label: "VIVO", value: "vivo" },
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

            <Table>
                <TableHeader>
                    <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>
                        Name
                    </TableHeadCell>
                    <TableHeadCell sortable activeDirection={sortKey === "category" ? sortDirection : null} onClick={() => handleSort("category")}>
                        Category
                    </TableHeadCell>
                    <TableHeadCell sortable activeDirection={sortKey === "brand" ? sortDirection : null} onClick={() => handleSort("brand")}>
                        Brand
                    </TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Ecommerce</TableHeadCell>
                    <TableHeadCell sortable activeDirection={sortKey === "createdAt" ? sortDirection : null} onClick={() => handleSort("createdAt")}>
                        Created at
                    </TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>

                <TableBody>
                    {data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.brand}</TableCell>

                            <TableCell>
                                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {product.status}
                                </span>
                            </TableCell>

                            <TableCell>
                                <span className="inline-flex cursor-pointer items-center rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-500/20 ring-1 ring-inset ring-yellow-600/20">
                                    {product.ecommerce ? "Enabled" : "Disabled"}
                                </span>
                            </TableCell>

                            <TableCell>{product.createdAt}</TableCell>

                            <TableCell className="text-right">
                                <ProductActionMenu productId={product.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}