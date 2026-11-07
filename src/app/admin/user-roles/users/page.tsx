import { UsersClient } from "@/components/features/users/UsersClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export const metadata = { title: "Users | Salamat Innovation ERP" };

export default function UsersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <UsersClient />
        </Suspense>
    );
}