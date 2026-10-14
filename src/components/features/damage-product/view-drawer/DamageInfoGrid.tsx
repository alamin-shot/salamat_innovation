"use client";
import * as React from "react";

export function DamageInfoGrid({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:w-3/5 gap-3">
            <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shop</span>
                <span className="text-[13px] font-semibold text-gray-800">{data.shop}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Damage Date</span>
                <span className="text-[13px] font-semibold text-gray-800">{data.date}</span>
            </div>

            <div className="flex flex-col gap-1.5 p-3.5 rounded-lg border border-gray-100 bg-gray-50/50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created By</span>
                <span className="text-[13px] font-semibold text-gray-800">{data.createdBy}</span>
            </div>
        </div>
    );
}