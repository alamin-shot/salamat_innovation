import { RolesClient } from "@/components/features/users/RolesClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export const metadata = { title: "Roles | Salamat Innovation ERP" };

export default function RolesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <RolesClient />
        </Suspense>
    );
}

