import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";
import { CategoriesClientManager } from "@/components/features/categories/CategoriesClientManager";

export default function CategoriesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <CategoriesClientManager />
        </Suspense>
    );
}