"use client";
import * as React from "react";
import { SaleReturnListTable } from "./SaleReturnListTable";
import { ViewSaleReturnDrawer } from "./ViewSaleReturnDrawer";
import { useCommandParams } from "@/hooks/useCommandParams";
import { EditSaleReturnDrawer } from "./edit-return/EditSaleReturnDrawer";

const initialData = [
    { id: "293", initials: "MR", customer: "MD MINHAZUL ISLAM RIFAT", invoice: "SR-000293", date: "2026-10-10", items: 2, total: "1,000.00", createdBy: "Md Zihadul Islam Sazzad", color: "bg-emerald-700" },
    { id: "289", initials: "J", customer: "Jihad", invoice: "SR-000289", date: "2026-09-28", items: 1, total: "999.00", createdBy: "Md Zihadul Islam Sazzad", color: "bg-teal-700" },
    { id: "285", initials: "D", customer: "Daraz", invoice: "SR-000285", date: "2026-09-27", items: 1, total: "2,565.00", createdBy: "Md Zihadul Islam Sazzad", color: "bg-emerald-800" },
];

export function SaleReturnClient() {
    const { activeDrawer, activeId, closeView } = useCommandParams();
    const [returns, setReturns] = React.useState(initialData);

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sales Return</h1>
            </div>

            <div className="w-full pb-12">
                <SaleReturnListTable returns={returns} setReturns={setReturns} />
            </div>

            <ViewSaleReturnDrawer
                id={activeId}
                isOpen={activeDrawer === "view-return"}
                onClose={closeView}
            />

            <EditSaleReturnDrawer id={activeId} isOpen={activeDrawer === "edit-return"} onClose={closeView} />
        </div>
    );
}