import { UsedProductsClientManager } from "@/components/features/used-products/UsedProductsClientManager";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function UsedProductsPage() {
    return (
        <Suspense fallback={
            <div>
                <Loader />
            </div>
        }>
            <UsedProductsClientManager />
        </Suspense>
    );
}