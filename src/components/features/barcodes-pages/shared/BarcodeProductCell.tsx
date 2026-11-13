import * as React from "react";
import Image from "next/image";

interface BarcodeProductCellProps {
    productName: string;
    variant: string;
    image: string | null;
}

/** Product Name column: thumbnail, name and variant (same markup the barcode tables used). */
export const BarcodeProductCell = React.memo(function BarcodeProductCell({ productName, variant, image }: BarcodeProductCellProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-brand-subtext/15 bg-white mt-0.5">
                {image ? (
                    <Image src={image} alt={productName} fill sizes="40px" className="object-contain p-1" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-subtext">
                        {productName.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-brand-text leading-tight">{productName}</span>
                <span className="text-[11px] font-bold text-emerald-600">{variant}</span>
            </div>
        </div>
    );
});

BarcodeProductCell.displayName = "BarcodeProductCell";
