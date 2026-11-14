import * as React from "react";
import { PurchaseStatus, PurchaseStatusTone } from "@/types/purchases";
import { PURCHASE_STATUS_TONES } from "@/constants/purchases";

const TONE_CLASSES: Record<PurchaseStatusTone, string> = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600",
    amber: "border-amber-100 bg-amber-50 text-amber-600",
    rose: "border-rose-100 bg-rose-50 text-rose-600",
};

/** Read-only status indicator. Statuses are recorded values, never edited through a dropdown. */
export const PurchaseStatusBadge = React.memo(function PurchaseStatusBadge({ status }: { status: PurchaseStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_CLASSES[PURCHASE_STATUS_TONES[status]]}`}>
            {status}
        </span>
    );
});

PurchaseStatusBadge.displayName = "PurchaseStatusBadge";
