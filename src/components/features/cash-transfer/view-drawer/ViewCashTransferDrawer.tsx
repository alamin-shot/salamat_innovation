"use client";
import * as React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ViewCashTransferDrawer({ id, isOpen, onClose }: { id: string | null, isOpen: boolean, onClose: () => void }) {
    const data = {
        ref: `CT-000${id || "056"}`,
        status: "Approved",
        amount: "14,500.00",
        fromShop: "A-Block",
        toShop: "TEKZO Online Shop",
        date: "2026-10-08",
        createdAt: "08-Oct-2026 08:09 PM",
        createdBy: "Md Zihadul Islam Sazzad",
        approvedBy: "Admin"
    };

    if (!id && !isOpen) return null;

    return (
        <Drawer title="Cash Transfer Detail" isOpen={isOpen} onClose={onClose} width="w-full max-w-none lg:w-[calc(100vw-280px)]">
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-full pb-12">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 sm:p-7 flex flex-col gap-6">

                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-gray-800">{data.ref}</h2>
                            <Badge variant={data.status === "Approved" ? "success" : "destructive"}>
                                {data.status}
                            </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-orange-600 border-orange-200 hover:bg-orange-50 bg-white w-full sm:w-auto">
                            <Printer className="h-4 w-4 mr-2" /> Print
                        </Button>
                    </div>

                    {/* Large Highlighted Amount Card matching screenshot */}
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-emerald-200 bg-emerald-50/60 w-full gap-1">
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Transfer Amount</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">৳ {data.amount}</span>
                    </div>

                    {/* Information Grid Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">From Shop</span>
                            <span className="text-[13px] font-medium text-gray-800">{data.fromShop}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">To Shop</span>
                            <span className="text-[13px] font-medium text-gray-800">{data.toShop}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transfer Date</span>
                            <span className="text-[13px] font-medium text-gray-800">{data.date}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created At</span>
                            <span className="text-[13px] font-medium text-gray-800">{data.createdAt}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created By</span>
                            <span className="text-[13px] font-medium text-gray-800">{data.createdBy}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-emerald-200 bg-emerald-100/40">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved By</span>
                            <span className="text-[13px] font-medium text-emerald-800">{data.approvedBy}</span>
                        </div>
                    </div>

                </div>
            </div>
        </Drawer>
    );
}