import * as React from "react";
import { Eye } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DamageProduct } from "@/types/damageProducts";
import { formatOperationTimestamp } from "@/utils/operationsRules";
import { OperationStatusBadge } from "../../shared/OperationStatusBadge";

interface DamageProductRowProps {
    row: DamageProduct;
    onView: (id: string) => void;
}

export const DamageProductRow = React.memo(function DamageProductRow({ row, onView }: DamageProductRowProps) {
    return (
        <TableRow>
            <TableCell className="pl-4 text-[13px] font-medium text-gray-700">{row.ref}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.shop}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{formatOperationTimestamp(row.createdAt)}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.serials.length}</TableCell>
            <TableCell><OperationStatusBadge status={row.status} /></TableCell>
            <TableCell className="text-right pr-4">
                <Button size="icon-sm" variant="ghost" onClick={() => onView(row.id)} title="View details">
                    <Eye className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                </Button>
            </TableCell>
        </TableRow>
    );
});

DamageProductRow.displayName = "DamageProductRow";
