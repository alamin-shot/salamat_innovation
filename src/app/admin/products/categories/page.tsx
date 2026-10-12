import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";
import { CategoriesClientManager } from "@/components/features/products-pages/categories/CategoriesClientManager";

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
