"use client";
import { SharedSeoManagerType } from "@/hooks/seo_hooks/useSharedSeoManager";
import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from "@/components/ui/Table";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DescriptionPopover } from "./DescriptionPopover";
import { Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SharedSeoTable({ manager }: { manager: SharedSeoManagerType }) {
    return (
        <div className="overflow-x-auto flex-1">
            <Table>
                <TableHeader>
                    <TableHeadCell className="w-12">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            checked={manager.table.selectedIds.length > 0 && manager.table.selectedIds.length === manager.table.paginatedData.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    manager.table.setSelectedIds(manager.table.paginatedData.map(r => r.id));
                                } else {
                                    manager.table.setSelectedIds([]);
                                }
                            }}
                        />
                    </TableHeadCell>

                    <TableHeadCell>{manager.currentTab === "products" || manager.currentTab === "categories" ? "Name" : "Title"}</TableHeadCell>

                    {/* Slug is hidden on Categories and Brands views */}
                    {manager.currentTab !== "categories" && manager.currentTab !== "brands" && (
                        <TableHeadCell>Slug</TableHeadCell>
                    )}

                    {/* Specific columns for Products */}
                    {manager.currentTab === "products" && (
                        <>
                            <TableHeadCell>Category</TableHeadCell>
                            <TableHeadCell>Brand</TableHeadCell>
                        </>
                    )}

                    <TableHeadCell>Description</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell className="text-right">Action</TableHeadCell>
                </TableHeader>
                <TableBody>
                    {manager.table.paginatedData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    checked={manager.table.selectedIds.includes(row.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            manager.table.setSelectedIds([...manager.table.selectedIds, row.id]);
                                        } else {
                                            manager.table.setSelectedIds(manager.table.selectedIds.filter(id => id !== row.id));
                                        }
                                    }}
                                />
                            </TableCell>

                            <TableCell className="font-medium text-gray-900">{row.name}</TableCell>

                            {manager.currentTab !== "categories" && manager.currentTab !== "brands" && (
                                <TableCell className="text-gray-500">{row.slug}</TableCell>
                            )}

                            {manager.currentTab === "products" && (
                                <>
                                    <TableCell className="text-gray-500">{row.productCategory || "-"}</TableCell>
                                    <TableCell className="text-gray-500">{row.productBrand || "-"}</TableCell>
                                </>
                            )}

                            <TableCell>
                                <DescriptionPopover description={row.description} />
                            </TableCell>

                            <TableCell>
                                <div className="w-28">
                                    <CustomSelect
                                        value={row.status}
                                        onChange={(val) => manager.handleInlineStatusChange(row.id, val as "Active" | "Inactive")}
                                        options={["Active", "Inactive"]}
                                    />
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon-sm" className="text-blue-600 hover:bg-blue-50">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" className="text-emerald-600 hover:bg-emerald-50" onClick={() => manager.openView("drawer", "seo-form", row.id)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon-sm" className="text-red-600 hover:bg-red-50" onClick={() => manager.handleDelete(row.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {manager.table.paginatedData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                                No SEO records found for this tab.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}