import * as React from "react";

interface OperationInfoTileProps {
    label: string;
    value: string;
    /** Emerald highlight, used for "Approved By". */
    highlight?: boolean;
}

/** One labelled fact in a detail drawer (From Shop, Date, Created By, …). */
export function OperationInfoTile({ label, value, highlight = false }: OperationInfoTileProps) {
    return (
        <div className={`flex flex-col gap-1.5 p-3.5 rounded-lg border ${highlight ? "border-emerald-200 bg-emerald-100/40" : "border-gray-100 bg-gray-50/50"}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${highlight ? "text-emerald-600" : "text-gray-400"}`}>{label}</span>
            <span className={`text-[13px] font-medium ${highlight ? "text-emerald-800" : "text-gray-800"}`}>{value}</span>
        </div>
    );
}
