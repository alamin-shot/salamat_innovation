"use client";
import * as React from "react";
import { SaleListTable } from "./SaleListTable";
import { UpdateSellerModal } from "./UpdateSellerModal";
import { ViewSaleDrawer } from "./ViewSaleDrawer";
import { EditSaleDrawer } from "./EditSaleDrawer";
import { useCommandParams } from "@/hooks/useCommandParams";

const initialData = [
    { id: "3268", initials: "MT", customer: "Md Shakhiur Rahman Tamal", date: "2026-10-12", invoice: "PS-003268", items: 5, sCost: "120.00", total: "1,750.00", due: "1,750.00", received: "0.00", payment: "—", status: "Due", seller: "AV", courier: "Pending", color: "bg-emerald-600" },
    { id: "3267", initials: "MM", customer: "Mainul Hasan Mahin", date: "2026-10-12", invoice: "PS-003267", items: 1, sCost: "0.00", total: "75,000.00", due: "0.00", received: "75,000.00", payment: "Cash", status: "Paid", seller: "Md Zihadul Islam Sazzad", courier: "—", color: "bg-emerald-500" },
    { id: "3260", initials: "SR", customer: "SUFINEWAJ RAYHAN", date: "2026-10-10", invoice: "PS-003260", items: 1, sCost: "120.00", total: "13,600.00", due: "12,600.00", received: "1,000.00", payment: "SSLCommerz", status: "Partially_paid", seller: "AV", courier: "—", color: "bg-teal-600" },
];

export function SalesClient() {
    const { activeModal, activeDrawer, activeId, closeView, openView } = useCommandParams();
    const [sales, setSales] = React.useState(initialData);

    const handleUpdateSeller = (saleId: string, newSeller: string) => {
        setSales(prev => prev.map(s => s.id === saleId ? { ...s, seller: newSeller } : s));
        closeView();
    };

    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Sale List</h1>
            </div>

            <div className="w-full pb-12">
                <SaleListTable
                    sales={sales}
                    setSales={setSales}
                    onOpenSellerModal={(id) => openView("modal", "update-seller", id)}
                />
            </div>

            <UpdateSellerModal
                saleId={activeId}
                isOpen={activeModal === "update-seller"}
                onClose={closeView}
                onSave={handleUpdateSeller}
            />

            <ViewSaleDrawer
                id={activeId}
                isOpen={activeDrawer === "view-sale"}
                onClose={closeView}
            />


            <EditSaleDrawer
                id={activeId}
                isOpen={activeDrawer === "edit-sale"}
                onClose={closeView}
            />
        </div>
    );
}