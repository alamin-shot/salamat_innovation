import * as React from "react";
import { BarcodeStatus } from "@/types/barcodes";
import { BARCODE_STATUS_STYLES } from "@/constants/barcodes";

interface BarcodeStatusBadgeProps {
    status: BarcodeStatus;
}

/** Lifecycle status chip; colours come from BARCODE_STATUS_STYLES. */
export const BarcodeStatusBadge = React.memo(function BarcodeStatusBadge({ status }: BarcodeStatusBadgeProps) {
    return (
        <span className={`inline-flex w-max items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${BARCODE_STATUS_STYLES[status]}`}>
            {status}
        </span>
    );
});

BarcodeStatusBadge.displayName = "BarcodeStatusBadge";
