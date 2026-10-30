import { Suspense } from "react";
import { Loader } from "@/components/shared/loader/Loader";
import { ProductVerifyClient } from "@/components/features/product-verify/ProductVerifyClient";

export const metadata = {
    title: "Product Verify | Salamat Innovation ERP",
};

export default function ProductVerifyPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <ProductVerifyClient />
        </Suspense>
    );
}