"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDataTable } from "@/hooks/useDataTable";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { ColumnsVisibilityDropdown } from "@/components/ui/ColumnsVisibilityDropdown";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { QuickPeekModal } from "@/components/ui/QuickPeekModal";
import { UsedProductActionMenu } from "./UsedProductActionMenu";
import { UpdatePriceModal } from "./modals/UpdatePriceModal";
import { PreOwnedCareModal } from "./modals/PreOwnedCareModal";
import { Trash2, CheckCircle2, PackageX, ChevronDown, Tag, Heart } from "lucide-react";
import { toast } from "sonner";

export interface UsedProduct {
    id: string;
    name: string;
    image: string;
    variant: string;
    price: number;
    serialNumber: string;
    carePlan: string;
    isSold: boolean;
}

const MOCK_USED_PRODUCTS: UsedProduct[] = [
    { id: "1", name: "iPhone 13 Pro", image: "https://placehold.co/100x100/e2e8f0/64748b?text=Phone", variant: "128GB/Gold", price: 53990.00, serialNumber: "359052378710667", carePlan: "TEKZO Care for Apple", isSold: false },
    { id: "2", name: "iPhone 13 Pro", image: "https://placehold.co/100x100/e2e8f0/64748b?text=Phone", variant: "256GB/Gold", price: 56990.00, serialNumber: "355677815053877", carePlan: "TEKZO Screen Care", isSold: false },
    { id: "3", name: "iPhone 13 Pro", image: "https://placehold.co/100x100/e2e8f0/64748b?text=Phone", variant: "128GB/Sierra Blue", price: 53990.00, serialNumber: "353100552915705", carePlan: "None", isSold: true },
];

type ModalType = "price" | "care";

export function UsedProductTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = React.useState<UsedProduct[]>(MOCK_USED_PRODUCTS);
    const { data, searchQuery, setSearchQuery, sortKey, sortDirection, handleSort } = useDataTable<UsedProduct>(products, ["name", "serialNumber", "variant"]);

    const [selectedStatus, setSelectedStatus] = React.useState<string>("");
    const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
    const [activeModal, setActiveModal] = React.useState<{ type: ModalType; id: string } | null>(null);

    const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>({
        name: true, variant: true, price: true, serialNumber: true, carePlan: true, isSold: true
    });

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

    const updateProductStatus = (id: string, isSold: boolean) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isSold } : p));
        toast.success(`Product marked as ${isSold ? 'Sold' : 'Available'}.`);
    };

    const handleToggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleResetColumns = () => setVisibleColumns({ name: true, variant: true, price: true, serialNumber: true, carePlan: true, isSold: true });

    const handleBulkAction = (actionName: string) => {
        toast.success(`${actionName} applied to ${selectedRows.size} products.`);
        setSelectedRows(new Set());
    };

    const handleAdvancedEdit = () => {
        if (!activeModal) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("drawer", "edit-used");
        params.set("id", activeModal.id);
        setActiveModal(null);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const getModalTitle = () => {
        if (!activeModal) return "";
        return activeModal.type === "price" ? "Update Price" : "Pre-Owned Care";
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-brand-subtext/20 bg-white">
                <div className="w-full overflow-x-auto custom-scrollbar">
                    <FilterBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilterCount={selectedStatus ? 1 : 0}
                        onClearFilters={() => { setSelectedStatus(""); setSearchQuery(""); }}
                    >
                        <FilterDropdown label="Status" options={[{ label: "Available", value: "Available" }, { label: "Sold", value: "Sold" }]} selectedValue={selectedStatus} onSelect={setSelectedStatus} />
                    </FilterBar>
                </div>
                <div className="w-full lg:w-auto flex lg:justify-end shrink-0 px-4 pb-3 pt-0 lg:px-4 lg:py-3">
                    <ColumnsVisibilityDropdown
                        columns={[
                            { key: "name", label: "Product Name" },
                            { key: "variant", label: "Variant" },
                            { key: "price", label: "Price" },
                            { key: "serialNumber", label: "Serial Number" },
                            { key: "carePlan", label: "Care Plan" },
                            { key: "isSold", label: "Is Sold" },
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
                                <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-emerald-600 focus:ring-emerald-600" onChange={handleSelectAll} checked={data.length > 0 && selectedRows.size === data.length} />
                            </div>
                        </TableHeadCell>
                        {visibleColumns.name !== false && <TableHeadCell sortable activeDirection={sortKey === "name" ? sortDirection : null} onClick={() => handleSort("name")}>Name</TableHeadCell>}
                        {visibleColumns.variant !== false && <TableHeadCell sortable activeDirection={sortKey === "variant" ? sortDirection : null} onClick={() => handleSort("variant")}>Variant</TableHeadCell>}
                        {visibleColumns.price !== false && <TableHeadCell sortable activeDirection={sortKey === "price" ? sortDirection : null} onClick={() => handleSort("price")}>Price</TableHeadCell>}
                        {visibleColumns.serialNumber !== false && <TableHeadCell sortable activeDirection={sortKey === "serialNumber" ? sortDirection : null} onClick={() => handleSort("serialNumber")}>Serial Number</TableHeadCell>}
                        {visibleColumns.carePlan !== false && <TableHeadCell>Care Plan</TableHeadCell>}
                        {visibleColumns.isSold !== false && <TableHeadCell>Is Sold</TableHeadCell>}
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {data.map((product) => (
                            <TableRow key={product.id} className={selectedRows.has(product.id) ? "bg-emerald-50/50" : ""}>
                                <TableCell className="w-[48px] px-4">
                                    <div className="flex items-center justify-center">
                                        <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border-brand-subtext/40 bg-white text-emerald-600 focus:ring-emerald-600" checked={selectedRows.has(product.id)} onChange={(e) => handleSelectRow(product.id, e.target.checked)} />
                                    </div>
                                </TableCell>

                                {visibleColumns.name !== false && (
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-brand-subtext/10 bg-brand-bg shrink-0">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-medium text-brand-text">{product.name}</span>
                                        </div>
                                    </TableCell>
                                )}
                                {visibleColumns.variant !== false && <TableCell>{product.variant}</TableCell>}

                                {/* INTERACTIVE PRICE CELL */}
                                {visibleColumns.price !== false && (
                                    <TableCell>
                                        <button
                                            onClick={() => setActiveModal({ type: "price", id: product.id })}
                                            className="group inline-flex items-center gap-1.5 font-medium text-brand-text hover:text-emerald-600 transition-colors cursor-pointer"
                                            title="Click to update price"
                                        >
                                            <Tag className="h-3.5 w-3.5 text-brand-subtext group-hover:text-emerald-600" />
                                            <span>৳ {product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                                        </button>
                                    </TableCell>
                                )}

                                {visibleColumns.serialNumber !== false && <TableCell><span className="font-mono text-xs">{product.serialNumber}</span></TableCell>}

                                {/* INTERACTIVE CARE CELL */}
                                {visibleColumns.carePlan !== false && (
                                    <TableCell>
                                        <button
                                            onClick={() => setActiveModal({ type: "care", id: product.id })}
                                            className="group inline-flex items-center gap-1.5 rounded-md bg-brand-bg/60 px-2.5 py-1 text-xs font-medium text-brand-text border border-brand-subtext/10 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 transition-all cursor-pointer"
                                            title="Click to manage care plan"
                                        >
                                            <Heart className="h-3.5 w-3.5 text-brand-subtext group-hover:text-pink-600" />
                                            <span className="truncate max-w-[160px]">{product.carePlan}</span>
                                        </button>
                                    </TableCell>
                                )}

                                {/* INLINE STATUS DROPDOWN */}
                                {visibleColumns.isSold !== false && (
                                    <TableCell>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold transition-colors outline-none cursor-pointer ${!product.isSold
                                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                                    : "bg-brand-bg text-brand-subtext border border-brand-subtext/20 hover:bg-brand-subtext/10"
                                                }`}>
                                                <span>{!product.isSold ? "Available" : "Sold"}</span>
                                                <ChevronDown className="h-3 w-3 opacity-80" />
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="z-[110] w-32 rounded-lg border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                                    <DropdownMenu.Item onClick={() => updateProductStatus(product.id, false)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 outline-none">
                                                        Available
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item onClick={() => updateProductStatus(product.id, true)} className="cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium text-brand-subtext hover:bg-brand-bg outline-none">
                                                        Sold
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </TableCell>
                                )}

                                <TableCell className="text-right">
                                    <UsedProductActionMenu productId={product.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <BulkActionBar selectedCount={selectedRows.size} onClearSelection={() => setSelectedRows(new Set())}>
                <button onClick={() => handleBulkAction("Marked Available")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> <span className="hidden sm:inline-block">Mark Available</span>
                </button>
                <button onClick={() => handleBulkAction("Marked Sold")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-white/10">
                    <PackageX className="h-4 w-4 text-amber-400" /> <span className="hidden sm:inline-block">Mark Sold</span>
                </button>
                <div className="mx-1 h-4 w-px bg-brand-subtext/30"></div>
                <button onClick={() => handleBulkAction("Deleted")} className="flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10">
                    <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline-block">Delete</span>
                </button>
            </BulkActionBar>

            {/* Quick Peek Modal for Price & Care */}
            <QuickPeekModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={getModalTitle()} onAdvancedEdit={handleAdvancedEdit}>
                {(isEditMode, setIsEditMode) => {
                    if (!activeModal) return null;
                    switch (activeModal.type) {
                        case "price": return <UpdatePriceModal productId={activeModal.id} />;
                        case "care": return <PreOwnedCareModal productId={activeModal.id} />;
                        default: return null;
                    }
                }}
            </QuickPeekModal>
        </div>
    );
}