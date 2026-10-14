import { DamageProductClient } from "@/components/features/damage-product/DamageProductClient";
import { Loader } from "@/components/shared/loader/Loader";
import { Suspense } from "react";

export default function DamageProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        }>
            <DamageProductClient />
        </Suspense>
    )
}