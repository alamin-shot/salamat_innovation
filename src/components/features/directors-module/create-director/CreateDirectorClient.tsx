"use client";
import { useRouter } from "next/navigation";
import { useDirectorFormManager } from "@/hooks/people_hooks/director_profile_hooks/useDirectorFormManager";
import { directorProfilePath } from "@/constants/directors";
import { DirectorProfileFormFields } from "../shared/DirectorProfileFormFields";

/** Create Directors: saves to the Directors store, then opens the new profile. */
export function CreateDirectorClient() {
    const router = useRouter();
    const manager = useDirectorFormManager(null, (director) => router.push(directorProfilePath(director.id)));

    return (
        <div className="relative flex min-h-full w-full flex-col bg-gray-50/50 p-4">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Create Directors</h1>
            </div>
            <div className="max-w-5xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <DirectorProfileFormFields manager={manager} />
            </div>
        </div>
    );
}
