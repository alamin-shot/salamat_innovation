"use client";
import * as React from "react";
import { AddSaleReturnForm } from "./AddSaleReturnForm";

export function AddSaleReturnClient() {
    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 relative">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Create Sale Return
                </h1>
            </div>

            {/* Natural scrolling wrapper */}
            <div className="w-full pb-12">
                <AddSaleReturnForm />
            </div>
        </div>
    );
}