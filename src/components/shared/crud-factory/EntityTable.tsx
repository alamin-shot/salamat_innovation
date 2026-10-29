"use client";
import * as React from "react";
import { GenericManagerType } from "@/hooks/crud_hooks/useGenericManager";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

export type FieldType = "text" | "number" | "select" | "image" | "url" | "textarea";

export interface EntitySchemaField {
    key: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: string[];
    isTableColumn?: boolean;
    format?: (value: any, row: any) => React.ReactNode;
}

interface EntityTableProps {
    schema: EntitySchemaField[];
    manager: GenericManagerType;
}

export function EntityTable({ schema, manager }: EntityTableProps) {
    const columns = schema.filter(s => s.isTableColumn);

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) manager.setSelectedIds(manager.data.map(d => d.id));
        else manager.setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        manager.setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full overflow-x-auto min-h-[350px]">
            <table className="w-full text-left text-sm text-brand-subtext border-collapse">
                <thead className="bg-brand-primary/5 text-brand-text border-b border-brand-subtext/20">
                    <tr>
                        <th className="p-4 w-12">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                checked={manager.data.length > 0 && manager.selectedIds.length === manager.data.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        {columns.map(col => (
                            <th key={col.key} className="p-4 font-semibold">{col.label}</th>
                        ))}
                        <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-subtext/10">
                    {manager.data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 2} className="p-8 text-center text-gray-500">
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        manager.data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                        checked={manager.selectedIds.includes(row.id)}
                                        onChange={() => toggleSelect(row.id)}
                                    />
                                </td>
                                {columns.map(col => (
                                    <td key={col.key} className="p-4">
                                        {col.format ? col.format(row[col.key], row) : (
                                            col.type === "image" ? (
                                                row[col.key] ?
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={row[col.key]} alt="" className="h-10 w-10 rounded object-cover" /> :
                                                    <ImageIcon className="h-5 w-5 text-gray-300" />
                                            ) : col.type === "url" ? (
                                                <a href={row[col.key]} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-1">
                                                    <LinkIcon className="h-3 w-3" /> Link
                                                </a>
                                            ) : (
                                                row[col.key] || "-"
                                            )
                                        )}
                                    </td>
                                ))}
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon-sm" onClick={() => manager.openEditDrawer(row.id)} title="Edit">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive-ghost" size="icon-sm" onClick={() => manager.handleDelete(row.id)} title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}