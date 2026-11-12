"use client";
import * as React from "react";
import Image from "next/image";
import { Edit } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { ProductPage, RecordStatus } from "@/types/products";
import { NameWithThumbnail } from "../shared/NameWithThumbnail";
import { StatusToggle } from "../shared/StatusToggle";
import { StatusDropdown } from "../shared/StatusDropdown";
import { AuditCells } from "../shared/AuditCells";

interface PageRowProps {
    page: ProductPage;
    onSetStatus: (id: string, status: RecordStatus) => void;
    onToggleEcommerce: (id: string) => void;
    onEdit: (id: string) => void;
}

export const PageRow = React.memo(function PageRow({ page, onSetStatus, onToggleEcommerce, onEdit }: PageRowProps) {
    return (
        <TableRow>
            <TableCell>
                <NameWithThumbnail name={page.title} image={page.avatar} />
            </TableCell>

            <TableCell>
                <span className="font-mono text-xs text-brand-subtext">{page.slug}</span>
            </TableCell>

            <TableCell>
                <span className="text-sm text-brand-text">{page.shop}</span>
            </TableCell>

            <TableCell className="text-center">
                {page.shopBanner ? (
                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                        <Image src={page.shopBanner} alt="Shop Banner" fill sizes="64px" className="object-cover" />
                    </div>
                ) : (
                    <span className="text-brand-subtext/50">—</span>
                )}
            </TableCell>

            <TableCell className="text-center">
                {page.infoBanner ? (
                    <div className="relative mx-auto h-8 w-16 overflow-hidden rounded border border-brand-subtext/20 bg-brand-bg/50">
                        <Image src={page.infoBanner} alt="Info Banner" fill sizes="64px" className="object-cover" />
                    </div>
                ) : (
                    <span className="text-brand-subtext/50">—</span>
                )}
            </TableCell>

            <TableCell>
                <StatusDropdown status={page.status} onChange={(status) => onSetStatus(page.id, status)} />
            </TableCell>

            <TableCell>
                <StatusToggle
                    checked={page.ecommerce}
                    onChange={() => onToggleEcommerce(page.id)}
                    label={page.ecommerce ? "Enabled" : "Disabled"}
                />
            </TableCell>

            <AuditCells createdBy={page.createdBy} createdAt={page.createdAt} />

            <TableCell className="text-right">
                <button
                    type="button"
                    onClick={() => onEdit(page.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-brand-subtext hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    title="Edit Page"
                >
                    <Edit className="h-4 w-4" />
                </button>
            </TableCell>
        </TableRow>
    );
});

PageRow.displayName = "PageRow";
