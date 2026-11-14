import * as React from "react";
import Link from "next/link";
import { ListChecks, UserRound } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DirectorSectionRow as Row } from "@/types/directors";
import { directorProfilePath } from "@/constants/directors";
import { formatCurrency } from "@/utils/formatters";
import { formatDay } from "@/utils/dateDisplay";
import { toIsoDate } from "@/utils/dateRules";
import { DirectorAvatar } from "../shared/DirectorAvatar";

interface DirectorSectionRowProps {
    row: Row;
    recordsLabel: string;
    onOpenRecords: (id: string) => void;
}

export const DirectorSectionRow = React.memo(function DirectorSectionRow({ row, recordsLabel, onOpenRecords }: DirectorSectionRowProps) {
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <DirectorAvatar name={row.fullName} avatarUrl={row.avatarUrl} size="sm" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800">{row.fullName}</span>
                        <span className="text-xs text-gray-500">{row.title}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="text-sm text-gray-600">{row.phone}</TableCell>
            <TableCell className="text-center text-sm font-semibold text-gray-700">{row.recordCount}</TableCell>
            <TableCell className="whitespace-nowrap text-right text-base font-semibold tabular-nums text-gray-900">{formatCurrency(row.totalAmount)}</TableCell>
            <TableCell className="whitespace-nowrap text-sm text-gray-600">{row.lastDate ? formatDay(toIsoDate(row.lastDate)) : "—"}</TableCell>
            <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onOpenRecords(row.id)} className="rounded-md text-emerald-600 hover:bg-emerald-50" title={`View ${recordsLabel.toLowerCase()}`}>
                        <ListChecks className="h-4 w-4" />
                    </Button>
                    <Link href={directorProfilePath(row.id)} title="Director profile" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50">
                        <UserRound className="h-4 w-4" />
                    </Link>
                </div>
            </TableCell>
        </TableRow>
    );
});
DirectorSectionRow.displayName = "DirectorSectionRow";
