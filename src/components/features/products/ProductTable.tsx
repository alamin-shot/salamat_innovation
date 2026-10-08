"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDataTable } from "@/hooks/useDataTable";
import { Product } from "@/types/product";
import {
    Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell
} from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { ProductActionMenu } from "@/components/features/products/ProductActionMenu";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { QuickPeekModal } from "@/components/ui/QuickPeekModal";
import { WarrantyModal } from "@/components/features/products/modals/WarrantyModal";
import { ProductTagsDropdown } from "@/components/features/products/ProductTagsDropdown";
import { VariantsManager } from "@/components/features/products/VariantsManager";
import { SpecificationsForm } from "@/components/features/products/SpecificationsForm";
import { CareForm } from "@/components/features/products/CareForm";
import { Trash2, Tag, CheckCircle2, Globe, Settings, Package, Heart, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export interface ProductExtended extends Product {
    variantsCount?: number;
    specsCount?: number;
    hasCare?: boolean;
    ecommerce: boolean;
    warrantyActive: boolean;
}

const MOCK_PRODUCTS: ProductExtended[] = [
    { id: "1", name: "vivo S2", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: false, warrantyActive: true, tags: ["featured", "official"], variantsCount: 4, specsCount: 12, hasCare: true, createdAt: "05-10-2026" },
    { id: "2", name: "vivo S50 Pro mini", category: "Smart Phones", brand: "VIVO", status: "Active", ecommerce: true, warrantyActive: true, tags: [], variantsCount: 2, specsCount: 8, hasCare: false, createdAt: "05-10-2026" },
    { id: "3", name: "Portable Mini Air Cooler", category: "Desk Fan", brand: "Non Brand", status: "Inactive", ecommerce: false, warrantyActive: false, tags: [], variantsCount: 0, specsCount: 4, hasCare: true, createdAt: "04-10-2026" },
    { id: "4", name: "xiaomi 14", category: "Smart Phones", brand: "Xiaomi", status: "Active", ecommerce: true, warrantyActive: true, tags: [], variantsCount: 3, specsCount: 15, hasCare: true, createdAt: "05-10-2026" },
];

type ModalType = "warranty" | "variants" | "specs" | "care";

export function ProductTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Mutable state for table data so inline dropdown changes reflect immediately
    const [products, setProducts] = React.useState<ProductExtended[]>(MOCK_PRODUCTS);

    const {
        data, searchQuery, setSearchQuery, sortKey, sortDirection, handleSort
    } = useDataTable<ProductExtended>(products, ["name", "category", "brand"]);

    const [selectedStatus, setSelectedStatus] = React.useState<string>("");
    const [selectedBrand, setSelectedBrand] = React.useState<string>("");
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = React.useState<{ type: ModalType; id: string } | null>(null);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelectedRows(new Set(data.map(p => p.id)));
        else setSelectedRows(new Set());
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedRows);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedRows(newSet);
    };

    // Handlers for inline state updates
    const updateProductField = (id: string, field: keyof ProductExtended, value: any) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        toast.success(`Product updated successfully.`);
    };

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
        name: true, category: true, brand: true, tags: true, status: true, ecommerce: true,
        variants: false, specs: false, care: false, warranty: true, createdAt: true,
    });
    const handleToggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleResetColumns = () => setVisibleColumns({
        name: true, category: true, brand: true, tags: true, status: true, ecommerce: true,
        variants: false, specs: false, care: false, warranty: true, createdAt: true,
    });

    const handleBulkAction = (actionName: string) => {
        toast.success(`${actionName} applied to ${selectedRows.size} products.`);
        setSelectedRows(new Set());
    };

    const handleAdvancedEdit = () => {
        if (!activeModal) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", "edit");
        params.set("tab", activeModal.type);
        params.set("id", activeModal.id);
        setActiveModal(null);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getModalTitle = () => {
        if (!activeModal) return "";
        switch (activeModal.type) {
            case "warranty": return "Warranty Details";
            case "variants": return "Product Variants";
            case "specs": return "Specifications";
            case "care": return "Care Instructions";
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
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
                        <FilterDropdown label="Category" options={[{ label: "Smart Phones", value: "smartphones" }, { label: "Wearables", value: "wearables" }, { label: "Desk Fan", value: "deskfan" }]} selectedValue={selectedStatus} onSelect={setSelectedStatus} />
                        <FilterDropdown label="Brand" options={[{ label: "VIVO", value: "vivo" }, { label: "Xiaomi", value: "xiaomi" }, { label: "Realme", value: "realme" }]} selectedValue={selectedBrand} onSelect={setSelectedBrand} />
                        <FilterDropdown label="Status" options={[{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]} selectedValue={selectedStatus} onSelect={setSelectedStatus} />
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
                            { key: "tags", label: "Tags" },
                            { key: "variants", label: "Variants" },
                            { key: "specs", label: "Specs" },
                            { key: "care", label: "Care" },
                            { key: "warranty", label: "Warranty" },
                            { key: "createdAt", label: "Created at" }
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
                        <TableHeadCell className="w-[48px] px-4">
                            <div className="flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-brand-primary transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
                                    onChange={handleSelectAll}
                                    checked={data.length > 0 && selectedRows.size === data.length}
                                />
                            </div>
                        </TableHeadCell>

                        {visibleColumns.name !== false && <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>Name</TableHeadCell>}
                        {visibleColumns.category !== false && <TableHeadCell sortable activeDirection={sortKey === "category" ? sortDirection : null} onClick={() => handleSort("category")}>Category</TableHeadCell>}
                        {visibleColumns.brand !== false && <TableHeadCell sortable activeDirection={sortKey === "brand" ? sortDirection : null} onClick={() => handleSort("brand")}>Brand</TableHeadCell>}

                        {/* 1. STATUS COLUMN WITH INLINE DROPDOWN */}
                        {visibleColumns.status !== false && <TableHeadCell>Status</TableHeadCell>}

                        {/* 2. ECOMMERCE COLUMN WITH INLINE DROPDOWN */}
                        {visibleColumns.ecommerce !== false && <TableHeadCell>Ecommerce</TableHeadCell>}

                        {visibleColumns.tags !== false && <TableHeadCell>Tags</TableHeadCell>}
                        {visibleColumns.variants !== false && <TableHeadCell>Variants</TableHeadCell>}
                        {visibleColumns.specs !== false && <TableHeadCell>Specs</TableHeadCell>}
                        {visibleColumns.care !== false && <TableHeadCell>Care</TableHeadCell>}

                        {/* 3. WARRANTY COLUMN WITH INLINE DROPDOWN */}
                        {visibleColumns.warranty !== false && <TableHeadCell>Warranty</TableHeadCell>}

                        {visibleColumns.createdAt !== false && <TableHeadCell sortable activeDirection={sortKey === "createdAt" ? sortDirection : null} onClick={() => handleSort("createdAt")}>Created at</TableHeadCell>}
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {data.map((product) => (
                            <TableRow
                                key={product.id}
                                className={selectedRows.has(product.id) ? "bg-brand-primary/5 transition-colors" : "transition-colors"}
                            >
                                <TableCell className="w-[48px] px-4">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-brand-primary transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-1"
                                            checked={selectedRows.has(product.id)}
                                            onChange={(e) => handleSelectRow(product.id, e.target.checked)}
                                        />
                                    </div>
                                </TableCell>

                                {visibleColumns.name !== false && <TableCell className="font-medium">{product.name}</TableCell>}
                                {visibleColumns.category !== false && <TableCell>{product.category}</TableCell>}
                                {visibleColumns.brand !== false && <TableCell>{product.brand}</TableCell>}

                                {/* 1. STATUS INLINE DROPDOWN CELL */}
                                {visibleColumns.status !== false && (
                                    <TableCell>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors outline-none cursor-pointer ${product.status === "Active"
                                                    ? "bg-green-500/10 text-green-700 ring-green-600/20 hover:bg-green-500/20"
                                                    : "bg-red-500/10 text-red-700 ring-red-600/20 hover:bg-red-500/20"
                                                }`}>
                                                <span>{product.status}</span>
                                                <ChevronDown className="h-3 w-3 opacity-70" />
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                                    <DropdownMenu.Item onClick={() => updateProductField(product.id, "status", "Active")} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 outline-none">
                                                        Active
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item onClick={() => updateProductField(product.id, "status", "Inactive")} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 outline-none">
                                                        Inactive
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </TableCell>
                                )}

                                {/* 2. ECOMMERCE INLINE DROPDOWN CELL */}
                                {visibleColumns.ecommerce !== false && (
                                    <TableCell>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors outline-none cursor-pointer ${product.ecommerce
                                                    ? "bg-blue-500/10 text-blue-700 ring-blue-600/20 hover:bg-blue-500/20"
                                                    : "bg-yellow-500/10 text-yellow-700 ring-yellow-600/20 hover:bg-yellow-500/20"
                                                }`}>
                                                <span>{product.ecommerce ? "Enabled" : "Disabled"}</span>
                                                <ChevronDown className="h-3 w-3 opacity-70" />
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                                    <DropdownMenu.Item onClick={() => updateProductField(product.id, "ecommerce", true)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 outline-none">
                                                        Enabled
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item onClick={() => updateProductField(product.id, "ecommerce", false)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-50 outline-none">
                                                        Disabled
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </TableCell>
                                )}

                                {visibleColumns.tags !== false && (
                                    <TableCell>
                                        <ProductTagsDropdown productId={product.id} initialTags={product.tags} />
                                    </TableCell>
                                )}

                                {visibleColumns.variants !== false && (
                                    <TableCell>
                                        <button onClick={() => setActiveModal({ type: "variants", id: product.id })} className="flex items-center gap-1.5 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 py-1 text-xs font-medium text-brand-text transition-colors hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary">
                                            <Package className="h-3 w-3" /> {product.variantsCount! > 0 ? `${product.variantsCount} Variants` : "+ Setup"}
                                        </button>
                                    </TableCell>
                                )}

                                {visibleColumns.specs !== false && (
                                    <TableCell>
                                        <button onClick={() => setActiveModal({ type: "specs", id: product.id })} className="flex items-center gap-1.5 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 py-1 text-xs font-medium text-brand-text transition-colors hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary">
                                            <Tag className="h-3 w-3" /> {product.specsCount! > 0 ? `${product.specsCount} Specs` : "+ Setup"}
                                        </button>
                                    </TableCell>
                                )}

                                {visibleColumns.care !== false && (
                                    <TableCell>
                                        <button onClick={() => setActiveModal({ type: "care", id: product.id })} className={`flex items-center gap-1.5 rounded-md border border-brand-subtext/20 px-2 py-1 text-xs font-medium transition-colors hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 ${product.hasCare ? 'bg-brand-bg text-brand-text' : 'bg-transparent text-brand-subtext border-dashed'}`}>
                                            <Heart className={`h-3 w-3 ${product.hasCare ? 'text-pink-500' : ''}`} /> {product.hasCare ? "View Care" : "+ Add Care"}
                                        </button>
                                    </TableCell>
                                )}

                                {/* 3. WARRANTY ACTIVE INLINE DROPDOWN CELL */}
                                {visibleColumns.warranty !== false && (
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors outline-none cursor-pointer ${product.warrantyActive
                                                        ? "bg-green-500/10 text-green-700 ring-green-600/20 hover:bg-green-500/20"
                                                        : "bg-brand-subtext/10 text-brand-subtext ring-brand-subtext/20 hover:bg-brand-subtext/20"
                                                    }`}>
                                                    <span>{product.warrantyActive ? "Active" : "Inactive"}</span>
                                                    <ChevronDown className="h-3 w-3 opacity-70" />
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Portal>
                                                    <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                                        <DropdownMenu.Item onClick={() => updateProductField(product.id, "warrantyActive", true)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 outline-none">
                                                            Active
                                                        </DropdownMenu.Item>
                                                        <DropdownMenu.Item onClick={() => updateProductField(product.id, "warrantyActive", false)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-brand-subtext hover:bg-brand-bg outline-none">
                                                            Inactive
                                                        </DropdownMenu.Item>
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Portal>
                                            </DropdownMenu.Root>

                                            <button onClick={() => setActiveModal({ type: "warranty", id: product.id })} className="flex h-6 items-center gap-1 rounded-md border border-brand-subtext/20 bg-brand-bg px-2 text-xs font-medium text-brand-text transition-colors hover:bg-brand-subtext/10 hover:text-brand-primary hover:border-brand-primary/30">
                                                <Settings className="h-3 w-3" /> Details
                                            </button>
                                        </div>
                                    </TableCell>
                                )}

                                {visibleColumns.createdAt !== false && <TableCell>{product.createdAt}</TableCell>}
                                <TableCell className="text-right">
                                    <ProductActionMenu productId={product.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BulkActionBar selectedCount={selectedRows.size} onClearSelection={() => setSelectedRows(new Set())}>
                <button onClick={() => handleBulkAction("Status Update")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> <span className="hidden sm:inline-block">Status</span>
                </button>
                <button onClick={() => handleBulkAction("Tags Applied")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <Tag className="h-4 w-4 text-brand-primary" /> <span className="hidden sm:inline-block">Tags</span>
                </button>
                <button onClick={() => handleBulkAction("Global Flags Applied")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <Globe className="h-4 w-4 text-blue-400" /> <span className="hidden sm:inline-block">Flags</span>
                </button>
                <div className="mx-1 h-4 w-px bg-brand-subtext/30"></div>
                <button onClick={() => handleBulkAction("Deleted")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline-block">Delete</span>
                </button>
            </BulkActionBar>

            <QuickPeekModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={getModalTitle()} onAdvancedEdit={handleAdvancedEdit}>
                {(isEditMode, setIsEditMode) => {
                    if (!activeModal) return null;
                    switch (activeModal.type) {
                        case "warranty": return <WarrantyModal isEditMode={isEditMode} setIsEditMode={setIsEditMode} productId={activeModal.id} />;
                        case "variants": return <VariantsManager productId={activeModal.id} />;
                        case "specs": return <SpecificationsForm productId={activeModal.id} />;
                        case "care": return <CareForm productId={activeModal.id} />;
                        default: return null;
                    }
                }}
            </QuickPeekModal>
        </div>
    );
}