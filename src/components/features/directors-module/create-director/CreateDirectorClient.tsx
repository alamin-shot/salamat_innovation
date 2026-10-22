"use client";
import { useCreateDirectorManager } from "@/hooks/people_hooks/director_profile_hooks/useCreateDirectorManager";
import { DirectorProfileFormFields } from "../shared/DirectorProfileFormFields";

export function CreateDirectorClient() {
    const manager = useCreateDirectorManager();

    return (
        <div className="flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 relative bg-gray-50/50">
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Create Directors</h1>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8 max-w-5xl">
                <DirectorProfileFormFields manager={manager} />
            </div>
        </div>
    );
}