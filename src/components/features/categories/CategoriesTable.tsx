"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { FilterBar } from "@/components/ui/FilterBar";
import { BulkActionBar } from "@/components/ui/BulkActionBar";
import { Edit2, Trash2, Check, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    parentCategory: string;
    totalProducts: number;
    status: "Visible" | "Hidden";
}

const MOCK_CATEGORIES: Category[] = [
    { id: "1", name: "Smart Band", parentCategory: "Wearable Technology", totalProducts: 1, status: "Visible" },
    { id: "2", name: "Desk Lamp", parentCategory: "Lighting", totalProducts: 1, status: "Visible" },
    { id: "3", name: "Gaming", parentCategory: "-", totalProducts: 7, status: "Visible" },
];

export function CategoriesTable() {
    const [categories, setCategories] = React.useState(MOCK_CATEGORIES);
    const [searchQuery, setSearchQuery] = React.useState("");

    // 1. Inline Edit State
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editValue, setEditValue] = React.useState("");

    // 2. Bulk Selection State (This fixes the 'selectedIds' not found error)
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(categories.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const handleStartEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setEditValue(currentName);
    };

    const handleSaveEdit = (id: string) => {
        if (!editValue.trim()) return;
        setCategories(categories.map(c => c.id === id ? { ...c, name: editValue } : c));
        setEditingId(null);
        toast.success("Category name updated");
    };

    const handleStatusChange = (id: string, status: "Visible" | "Hidden") => {
        setCategories(categories.map(c => c.id === id ? { ...c, status } : c));
        toast.success(`Category marked as ${status}`);
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="border-b border-brand-subtext/20 bg-white">
                <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1 pb-16">
                <Table>
                    <TableHeader>
                        <TableHeadCell className="w-[48px] px-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === categories.length && categories.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                            />
                        </TableHeadCell>
                        <TableHeadCell>Name</TableHeadCell>
                        <TableHeadCell>Parent Category</TableHeadCell>
                        <TableHeadCell className="text-center">Total Products</TableHeadCell>
                        <TableHeadCell className="text-center">Sec. Logo</TableHeadCell>
                        <TableHeadCell className="text-center">Banner</TableHeadCell>
                        <TableHeadCell className="text-center">Info Banner</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell className="text-right">Action</TableHeadCell>
                    </TableHeader>

                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id} className={selectedIds.includes(cat.id) ? "bg-emerald-50/30" : ""}>
                                <TableCell className="w-[48px] px-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(cat.id)}
                                        onChange={(e) => handleSelectRow(cat.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                                    />
                                </TableCell>

                                <TableCell>
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(cat.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className="w-full rounded-md border border-emerald-500 bg-white px-2 py-1 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                            />
                                            <button onClick={() => handleSaveEdit(cat.id)} className="rounded p-1 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="rounded p-1 text-brand-subtext hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
                                        </div>
                                    ) : (
                                        <div className="group flex items-center gap-2">
                                            <span className="font-medium text-brand-text">{cat.name}</span>
                                            <button onClick={() => handleStartEdit(cat.id, cat.name)} className="opacity-0 group-hover:opacity-100 text-brand-subtext hover:text-emerald-600 transition-opacity p-1">
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </TableCell>

                                <TableCell><span className="text-brand-subtext">{cat.parentCategory}</span></TableCell>
                                <TableCell className="text-center font-medium text-brand-text">{cat.totalProducts}</TableCell>

                                <TableCell className="text-center"><div className="mx-auto h-8 w-8 rounded bg-brand-bg/80 border border-brand-subtext/10 flex items-center justify-center text-[10px] text-brand-subtext">Img</div></TableCell>
                                <TableCell className="text-center"><div className="mx-auto h-8 w-16 rounded bg-brand-bg/80 border border-brand-subtext/10 flex items-center justify-center text-[10px] text-brand-subtext">Img</div></TableCell>
                                <TableCell className="text-center"><div className="mx-auto h-8 w-16 rounded bg-brand-bg/80 border border-brand-subtext/10 flex items-center justify-center text-[10px] text-brand-subtext">Img</div></TableCell>

                                <TableCell>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-100 outline-none">
                                            {cat.status} <ChevronDown className="h-3 w-3" />
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="z-50 w-28 rounded-md border border-brand-subtext/20 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95" align="start">
                                                <DropdownMenu.Item onClick={() => handleStatusChange(cat.id, "Visible")} className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 outline-none">Visible</DropdownMenu.Item>
                                                <DropdownMenu.Item onClick={() => handleStatusChange(cat.id, "Hidden")} className="cursor-pointer rounded-sm px-2 py-1.5 text-xs font-medium text-brand-subtext hover:bg-brand-bg outline-none">Hidden</DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </TableCell>

                                <TableCell className="text-right">
                                    <button onClick={() => toast.error("Delete confirmation...")} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Using YOUR exact BulkActionBar syntax */}
            <BulkActionBar
                selectedCount={selectedIds.length}
                onClearSelection={() => setSelectedIds([])}
            >
                <button
                    onClick={() => {
                        toast.success(`Deleted ${selectedIds.length} categories`);
                        setSelectedIds([]);
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