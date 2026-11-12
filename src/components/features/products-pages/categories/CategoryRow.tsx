"use client";
import * as React from "react";
import Image from "next/image";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Category, RecordStatus } from "@/types/products";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusToggle } from "../shared/StatusToggle";
import { StatusDropdown } from "../shared/StatusDropdown";
import { AuditCells } from "../shared/AuditCells";

interface CategoryRowProps {
    category: Category;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onToggleEcommerce: (id: string) => void;
    onRename: (id: string, name: string) => void;
}

export const CategoryRow = React.memo(function CategoryRow({
    category, isSelected, onToggleSelect, onSetStatus, onToggleEcommerce, onRename
}: CategoryRowProps) {
    // Inline Edit State
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState("");

    const handleStartEdit = () => {
        setEditValue(category.name);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!editValue.trim()) return;
        onRename(category.id, editValue);
        setIsEditing(false);
    };

    return (
        <TableRow className={isSelected ? "bg-emerald-50/30" : ""}>
            <TableCell className="w-[48px] px-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(category.id)}
                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
            </TableCell>

            <TableCell>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input
                            autoFocus
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setIsEditing(false);
                            }}
                            className="w-full rounded-md border border-emerald-500 bg-white px-2 py-1 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button onClick={handleSaveEdit} className="rounded p-1 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                        <button onClick={() => setIsEditing(false)} className="rounded p-1 text-brand-subtext hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button>
                    </div>
                ) : (
                    <div className="group">
                        <NameWithThumbnail name={category.name} image={category.logo || category.secLogo}>
                            <button onClick={handleStartEdit} className="opacity-0 group-hover:opacity-100 text-brand-subtext hover:text-emerald-600 transition-opacity p-1">
                                <Edit2 className="h-3.5 w-3.5" />
                            </button>
                        </NameWithThumbnail>
                    </div>
                )}
            </TableCell>

            <TableCell><span className="text-brand-subtext">{category.parentCategory}</span></TableCell>
            <TableCell className="text-center font-medium text-brand-text">{category.totalProducts}</TableCell>
            <TableCell className="text-center">
                <div className="relative mx-auto h-8 w-8 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                    <Image src={category.secLogo || "/phone.png"} alt="Sec. Logo" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className="object-contain p-0.5" />
                </div>
            </TableCell>
            <TableCell className="text-center">
                <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                    <Image src={category.banner || "/banner.png"} alt="Banner" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className="object-cover" />
                </div>
            </TableCell>
            <TableCell className="text-center">
                <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                    <Image src={category.infoBanner || "/banner.png"} alt="Info Banner" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className="object-cover" />
                </div>
            </TableCell>

            <TableCell>
                <StatusDropdown status={category.status} onChange={(status) => onSetStatus(category.id, status)} />
            </TableCell>

            <TableCell>
                <StatusToggle
                    checked={category.ecommerce}
                    onChange={() => onToggleEcommerce(category.id)}
                    label={category.ecommerce ? "Enabled" : "Disabled"}
                />
            </TableCell>

            <AuditCells createdBy={category.createdBy} createdAt={category.createdAt} />

            <TableCell className="text-right">
                <button onClick={() => toast.error("Delete confirmation...")} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none">
                    <Trash2 className="h-4 w-4" />
                </button>
            </TableCell>
        </TableRow>
    );
});

CategoryRow.displayName = "CategoryRow";
