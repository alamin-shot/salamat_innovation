import { CreateDirectorClient } from "@/components/features/directors-module/create-director/CreateDirectorClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";
export default function CreateDirectorsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <CreateDirectorClient />
        </Suspense>
    )
}

