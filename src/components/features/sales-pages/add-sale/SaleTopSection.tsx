"use client";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { useAddSaleManager } from "@/hooks/sales_hooks/useAddSaleManager";
import { CustomSelect } from "@/components/ui/CustomSelect";

type Manager = ReturnType<typeof useAddSaleManager>;

export function SaleTopSection({ manager }: { manager: Manager }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Customer Info</label>
                    <div className="flex gap-2">
                        <CustomSelect value={manager.customer} onChange={manager.setCustomer} options={["Md Shakhiur Rahman Tamal", "Mainul Hasan", "Bina"]} placeholder="Choose Customer" />
                        <Button variant="success" className="shrink-0 text-[12px] px-3">Add Customer</Button>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Seller</label>
                    <CustomSelect value={manager.seller} onChange={manager.setSeller} options={["AV", "Alamin Rifat", "Md Siyam Hosen"]} placeholder="Choose a Seller" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Date <span className="text-red-500">*</span></label>
                    <input type="date" value={manager.date} onChange={(e) => manager.setDate(e.target.value)} className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-gray-500">Address</label>
                    <input type="text" value={manager.address} onChange={(e) => manager.setAddress(e.target.value)} placeholder="Customer Address" className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500" />
                </div>
            </div>
        </div>
    );
}