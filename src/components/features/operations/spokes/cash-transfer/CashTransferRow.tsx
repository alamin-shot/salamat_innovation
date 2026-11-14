import * as React from "react";
import { Eye } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CashTransfer } from "@/types/cashTransfers";
import { formatOperationTimestamp } from "@/utils/operationsRules";
import { OperationStatusBadge } from "../../shared/OperationStatusBadge";
import { formatTaka } from "./formatTaka";

interface CashTransferRowProps {
    row: CashTransfer;
    onView: (id: string) => void;
}

export const CashTransferRow = React.memo(function CashTransferRow({ row, onView }: CashTransferRowProps) {
    return (
        <TableRow>
            <TableCell className="pl-4 text-[13px] font-medium text-gray-700">{row.ref}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.fromShop}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.toShop}</TableCell>
            <TableCell className="text-[13px] font-semibold text-gray-800 text-right">{formatTaka(row.amount)}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{row.date}</TableCell>
            <TableCell className="text-[13px] text-gray-600">{formatOperationTimestamp(row.createdAt)}</TableCell>
            <TableCell><OperationStatusBadge status={row.status} /></TableCell>
            <TableCell className="text-right pr-4">
                <Button size="icon-sm" variant="ghost" onClick={() => onView(row.id)} title="View details">
                    <Eye className="h-4 w-4 text-gray-500 hover:text-emerald-600" />
                </Button>
            </TableCell>
        </TableRow>
    );
});

CashTransferRow.displayName = "CashTransferRow";
