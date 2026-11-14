import * as React from "react";
import { BadgeCheck, Edit, Eye, Trash2, XCircle } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Partner } from "@/types/partners";
import { PartnerColumns } from "@/hooks/partner_hooks/shared/useSharedPartnerManager";
import { PartnerLogo, PartnerStatusBadge, PartnerStatusSwitch, PartnerTierBadge } from "./PartnerBits";

interface PartnerRowProps {
    row: Partner;
    cols: PartnerColumns;
    isApplication: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string, checked: boolean) => void;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (partner: Partner) => void;
    onApprove: (id: string) => void;
    onReject: (partner: Partner) => void;
}

export const PartnerRow = React.memo(function PartnerRow({ row, cols, isApplication, isSelected, onToggleSelect, onView, onEdit, onDelete, onToggleStatus, onApprove, onReject }: PartnerRowProps) {
    return (
        <TableRow className={isSelected ? "bg-emerald-50/50" : ""}>
            <TableCell className="text-center">
                <input type="checkbox" checked={isSelected} onChange={(e) => onToggleSelect(row.id, e.target.checked)} className="h-4 w-4 cursor-pointer rounded text-emerald-600" />
            </TableCell>
            {cols.customer && (
                <TableCell>
                    <button type="button" onClick={() => onView(row.id)} className="flex items-center gap-3 text-left">
                        <PartnerLogo name={row.businessName || row.name} logoUrl={row.logoUrl} />
                        <span className="flex flex-col">
                            <span className="text-[13px] font-semibold text-gray-800 hover:text-emerald-700">{row.name}</span>
                            <span className="text-[11px] text-gray-500">{row.primaryPhone}</span>
                        </span>
                    </button>
                </TableCell>
            )}
            {cols.tier && <TableCell><PartnerTierBadge tier={row.tier} /></TableCell>}
            {cols.businessName && <TableCell className="text-[13px] text-gray-600">{row.businessName}</TableCell>}
            {cols.primaryPhone && <TableCell className="text-[13px] text-gray-600">{row.primaryPhone}</TableCell>}
            {cols.secondaryPhone && <TableCell className="text-[13px] text-gray-600">{row.secondaryPhone}</TableCell>}
            {cols.email && <TableCell className="text-[13px] text-gray-600">{row.email}</TableCell>}
            {cols.tradeLicense && <TableCell className="text-[13px] text-gray-600">{row.tradeLicense}</TableCell>}
            {cols.address && <TableCell className="max-w-[160px] truncate text-[13px] text-gray-600" title={row.address}>{row.address}</TableCell>}
            {cols.status && (
                <TableCell>
                    {isApplication
                        ? <PartnerStatusBadge status={row.status} />
                        : <PartnerStatusSwitch isActive={row.status === "Active"} onToggle={() => onToggleStatus(row)} label={`${row.name} active`} />}
                </TableCell>
            )}
            <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    {isApplication && row.status === "Pending" && (
                        <>
                            <Button type="button" variant="ghost" size="sm" onClick={() => onApprove(row.id)} className="h-8 gap-1 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50" title="Approve as…">
                                <BadgeCheck className="h-4 w-4" /> Approve
                            </Button>
                            <Button type="button" variant="ghost" size="icon-sm" onClick={() => onReject(row)} className="text-rose-500 hover:bg-rose-50" title="Reject"><XCircle className="h-4 w-4" /></Button>
                        </>
                    )}
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onView(row.id)} className="text-brand-subtext hover:bg-blue-50 hover:text-blue-600" title="View profile"><Eye className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onEdit(row.id)} className="text-brand-subtext hover:bg-emerald-50 hover:text-emerald-600" title="Edit"><Edit className="h-4 w-4" /></Button>
                    <Button type="button" variant="destructive-ghost" size="icon-sm" onClick={() => onDelete(row.id)} className="text-brand-subtext" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </TableCell>
        </TableRow>
    );
});
PartnerRow.displayName = "PartnerRow";
