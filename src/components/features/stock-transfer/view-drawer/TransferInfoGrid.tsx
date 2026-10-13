"use client";
import * as React from "react";

export function TransferInfoGrid({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created By</span>
                <span className="text-[13px] font-medium text-gray-800">{data.createdBy}</span>
            </div>
            <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-emerald-200 bg-emerald-100/40">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved By</span>
                <span className="text-[13px] font-medium text-emerald-800">{data.approvedBy}</span>
            </div>
        </div>
    );
}