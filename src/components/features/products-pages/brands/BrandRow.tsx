"use client";
import * as React from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Brand, RecordStatus } from "@/types/products";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusToggle } from "../shared/StatusToggle";
import { StatusDropdown } from "../shared/StatusDropdown";
import { AuditCells } from "../shared/AuditCells";

interface BrandRowProps {
    brand: Brand;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onToggleEcommerce: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const EMPTY_MEDIA = <span className="text-brand-subtext/50">—</span>;

export const BrandRow = React.memo(function BrandRow({
    brand, isSelected, onToggleSelect, onSetStatus, onToggleEcommerce, onEdit, onDelete
}: BrandRowProps) {
    return (
        <TableRow className={isSelected ? "bg-emerald-50/30" : ""}>
            <TableCell className="w-[48px] px-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(brand.id)}
                    className="h-4 w-4 rounded border-brand-subtext/40 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
            </TableCell>

            <TableCell>
                <NameWithThumbnail name={brand.name} image={brand.logo} />
            </TableCell>

            <TableCell className="text-center font-medium text-brand-text">{brand.totalProducts}</TableCell>
            <TableCell><span className="text-sm text-brand-subtext">{brand.tagline}</span></TableCell>

            <TableCell className="text-center">
                {brand.primaryLogo ? (
                    <div className="relative mx-auto h-8 w-8 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                        <Image src={brand.primaryLogo} alt="Primary" fill sizes="32px" className="object-contain p-0.5" />
                    </div>
                ) : EMPTY_MEDIA}
            </TableCell>

            <TableCell className="text-center">
                {brand.shopBanner ? (
                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                        <Image src={brand.shopBanner} alt="Shop Banner" fill sizes="64px" className="object-cover" />
                    </div>
                ) : EMPTY_MEDIA}
            </TableCell>

            <TableCell className="text-center">
                {brand.infoBanner ? (
                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                        <Image src={brand.infoBanner} alt="Info Banner" fill sizes="64px" className="object-cover" />
                    </div>
                ) : EMPTY_MEDIA}
            </TableCell>

            <TableCell>
                <StatusDropdown status={brand.status} onChange={(status) => onSetStatus(brand.id, status)} />
            </TableCell>

            <TableCell>
                <StatusToggle
                    checked={brand.ecommerce}
                    onChange={() => onToggleEcommerce(brand.id)}
                    label={brand.ecommerce ? "Enabled" : "Disabled"}
                />
            </TableCell>

            <AuditCells createdBy={brand.createdBy} createdAt={brand.createdAt} />

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => onEdit(brand.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit Brand"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(brand.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Brand"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

BrandRow.displayName = "BrandRow";
