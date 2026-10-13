"use client";
import * as React from "react";
import { AddSaleForm } from "./AddSaleForm";

export function AddSaleClient() {
    return (
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Create Sale
                </h1>
            </div>

            {/* Natural scrolling wrapper */}
            <div className="w-full pb-12">
                <AddSaleForm />
            </div>
        </div>
    );
}