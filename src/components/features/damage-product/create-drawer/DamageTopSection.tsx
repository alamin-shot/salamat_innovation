"use client";
import { CustomSelect } from "@/components/ui/CustomSelect";
import * as React from "react";


export function DamageTopSection({ manager }: { manager: any }) {
    const shopOptions = ["A-Block", "TEKZO JFP 4A-018A", "Salamat Innovation", "TEKZO Online Shop"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
            {/* Shop Column */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-600 font-medium">
                    Shop <span className="text-red-500">*</span>
                </label>
                {manager.isEditingShop ? (
                    <CustomSelect
                        value={manager.shop}
                        onChange={(val: string) => {
                            manager.setShop(val);
                            manager.setIsEditingShop(false);
                        }}
                        options={shopOptions}
                        placeholder="Select Shop"
                    />
                ) : manager.shop ? (
                    <div className="flex items-center gap-2 py-2">
                        <span className="text-[13px] font-bold text-gray-800">{manager.shop}</span>
                        <button
                            type="button"
                            onClick={() => manager.setIsEditingShop(true)}
                            className="text-[12px] font-medium text-blue-600 hover:underline"
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <span className="text-[13px] text-gray-400 py-2">
                        Scan a serial to detect shop
                    </span>
                )}
            </div>

            {/* Damage Date Column */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-600 font-medium">
                    Damage Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={manager.damageDate}
                    onChange={(e) => manager.setDamageDate(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500"
                />
            </div>

            {/* Note / Reason Column */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[13px] text-gray-600 font-medium">Note / Reason</label>
                <textarea
                    value={manager.note}
                    onChange={(e) => manager.setNote(e.target.value)}
                    rows={2}
                    className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
            </div>
        </div>
    );
}