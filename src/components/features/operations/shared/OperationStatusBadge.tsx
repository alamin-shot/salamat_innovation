import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { OperationApprovalStatus } from "@/types/operations";

const VARIANT: Record<OperationApprovalStatus, "success" | "destructive" | "warning"> = {
    Approved: "success",
    Cancelled: "destructive",
    Draft: "warning",
};

/** Read-only status: Draft (amber), Approved (emerald), Cancelled (rose). */
export function OperationStatusBadge({ status }: { status: OperationApprovalStatus }) {
    return <Badge variant={VARIANT[status]}>{status}</Badge>;
}
