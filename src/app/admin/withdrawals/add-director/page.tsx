import { AddDirectorClient } from "@/components/features/withdrawals/add-director/AddDirectorClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function AddDirectorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <AddDirectorClient />
        </Suspense>
    );
}