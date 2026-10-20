"use client";
import { useAddDirectorManager } from "@/hooks/finance_hooks/withdrawal_hooks/useAddDirectorManager";
import { AddDirectorForm } from "./AddDirectorForm";

export function AddDirectorClient() {
    const manager = useAddDirectorManager();
    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Director</h1>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 max-w-5xl">
                <AddDirectorForm manager={manager} />
            </div>
        </div>
    );
}