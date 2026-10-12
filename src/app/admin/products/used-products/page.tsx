import { UsedProductsClientManager } from "@/components/features/products-pages/used-products/UsedProductsClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function UsedProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <UsedProductsClientManager />
        </Suspense>
    );
}
