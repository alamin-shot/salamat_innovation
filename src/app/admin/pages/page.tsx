import { PagesClientManager } from "@/components/features/pages/PagesClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default async function AdminPagesPage() {

    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <PagesClientManager />
        </Suspense>
    );
}